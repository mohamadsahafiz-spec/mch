export interface Env {
  DB?: any;
  ASSETS?: { fetch: (request: Request) => Promise<Response> };
}

interface D1Record {
  table: string;
  recordId: string;
  data: any;
  updatedAt: string;
  deviceId: string;
  version: number;
  isDeleted?: boolean;
}

interface D1Image {
  imageId: string;
  dataUrl: string;
  deviceId: string;
  updatedAt: string;
}

const memoryDb = new Map<string, D1Record>();
const memoryImages = new Map<string, D1Image>();
const activeDevices = new Set<string>();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle OPTIONS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const json = (data: any, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    };

    // Worker API Routes
    if (path.startsWith("/api/")) {
      try {
        if (path === "/api/health") {
          return json({ status: "ok", runtime: "cloudflare-workers", timestamp: new Date().toISOString() });
        }

        if (path === "/api/sync" || path === "/api/sync/") {
          if (request.method === "GET") {
            return json({
              status: "online",
              endpoint: "/api/sync",
              runtime: "cloudflare-workers",
              serverRecordCount: memoryDb.size,
              serverTimestamp: new Date().toISOString()
            });
          }

          if (request.method === "POST") {
            const body: any = await request.json().catch(() => ({}));
            const { deviceId, items } = body;
            if (!Array.isArray(items)) {
              return json({ error: "Invalid sync request format: items array required" }, 400);
            }

            if (deviceId) activeDevices.add(deviceId);

            let processedCount = 0;
            const nowIso = new Date().toISOString();

            for (const item of items) {
              if (!item.table || !item.recordId) continue;
              const key = `${item.table}:${item.recordId}`;
              const existing = memoryDb.get(key);

              if (!existing || (item.version && item.version >= existing.version) || item.updatedAt >= existing.updatedAt) {
                const rec: D1Record = {
                  table: item.table,
                  recordId: item.recordId,
                  data: item.action === "delete" ? null : item.data,
                  updatedAt: item.updatedAt || nowIso,
                  deviceId: item.deviceId || deviceId || "UNKNOWN",
                  version: item.version || Date.now(),
                  isDeleted: item.action === "delete"
                };
                memoryDb.set(key, rec);

                if (env.DB) {
                  try {
                    await env.DB.prepare(
                      `INSERT INTO records (key, table_name, record_id, data, updated_at, device_id, version, is_deleted)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                       ON CONFLICT(key) DO UPDATE SET
                       data = excluded.data, updated_at = excluded.updated_at, device_id = excluded.device_id, version = excluded.version, is_deleted = excluded.is_deleted`
                    ).bind(key, rec.table, rec.recordId, JSON.stringify(rec.data), rec.updatedAt, rec.deviceId, rec.version, rec.isDeleted ? 1 : 0).run();
                  } catch (e) {
                    console.warn("[Cloudflare D1 Write Error]:", e);
                  }
                }
                processedCount++;
              }
            }

            return json({
              success: true,
              processedCount,
              serverTimestamp: nowIso,
              totalServerRecords: memoryDb.size
            });
          }
        }

        if (path === "/api/changes") {
          const sinceParam = url.searchParams.get("since") || "0";
          const deviceIdParam = url.searchParams.get("deviceId") || "";

          if (deviceIdParam) activeDevices.add(deviceIdParam);

          const sinceTime = sinceParam === "0" ? 0 : (new Date(sinceParam).getTime() || 0);
          const changes: D1Record[] = [];

          memoryDb.forEach((rec) => {
            const recordTime = new Date(rec.updatedAt).getTime() || rec.version || 0;
            if (sinceTime === 0) {
              if (!rec.isDeleted) changes.push(rec);
            } else {
              if (recordTime > sinceTime && (!deviceIdParam || rec.deviceId !== deviceIdParam)) {
                changes.push(rec);
              }
            }
          });

          return json({
            success: true,
            serverTimestamp: new Date().toISOString(),
            serverRecordCount: memoryDb.size,
            changes
          });
        }

        if (path === "/api/images") {
          if (request.method === "POST") {
            const body: any = await request.json().catch(() => ({}));
            const { imageId, dataUrl, deviceId } = body;
            if (!imageId || !dataUrl) {
              return json({ error: "imageId and dataUrl required" }, 400);
            }

            memoryImages.set(imageId, {
              imageId,
              dataUrl,
              deviceId: deviceId || "UNKNOWN",
              updatedAt: new Date().toISOString()
            });

            return json({ success: true, imageId });
          }
        }

        if (path.startsWith("/api/images/")) {
          const imageId = path.replace("/api/images/", "");
          const img = memoryImages.get(imageId);
          if (!img) {
            return json({ error: "Image not found in Cloud D1 replica" }, 404);
          }
          return json({ success: true, imageId: img.imageId, dataUrl: img.dataUrl });
        }

        if (path === "/api/record") {
          const body: any = await request.json().catch(() => ({}));
          const { table, recordId, deviceId, action } = body;
          if (!table || !recordId) {
            return json({ error: "table and recordId required" }, 400);
          }

          const key = `${table}:${recordId}`;
          const isDeleted = action === "delete" || request.method === "DELETE";

          const rec: D1Record = {
            table,
            recordId,
            data: isDeleted ? null : body.data,
            updatedAt: new Date().toISOString(),
            deviceId: deviceId || "UNKNOWN",
            version: Date.now(),
            isDeleted
          };

          memoryDb.set(key, rec);

          return json({ success: true, table, recordId, isDeleted });
        }

        if (path === "/api/sync/status") {
          return json({
            status: "online",
            runtime: "cloudflare-workers",
            serverRecordCount: memoryDb.size,
            totalStoredImages: memoryImages.size,
            activeDevices: Array.from(activeDevices),
            serverTimestamp: new Date().toISOString()
          });
        }

        return json({ error: `API route not found: ${request.method} ${path}` }, 404);
      } catch (err: any) {
        return json({ error: err?.message || "Internal Worker Error" }, 500);
      }
    }

    // Serve static frontend assets via env.ASSETS if available
    if (env && env.ASSETS) {
      return await env.ASSETS.fetch(request);
    }

    return new Response("FSOS Cloudflare Worker Application Active", {
      headers: { "Content-Type": "text/html", ...corsHeaders }
    });
  }
};
