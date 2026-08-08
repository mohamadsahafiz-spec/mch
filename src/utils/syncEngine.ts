import { SyncStatus, SyncQueueItem, SyncState, CloudRecord } from '../types/sync';
import { ImageStore } from './imageStore';

const QUEUE_KEY = 'fsos_sync_queue';
const DEVICE_ID_KEY = 'fsos_device_id';
const LAST_SYNC_KEY = 'fsos_last_sync_time';
const MIGRATED_KEY = 'fsos_cloud_migrated_v1';

type Listener = (state: SyncState) => void;

class SyncEngineManager {
  private queue: SyncQueueItem[] = [];
  private deviceId: string = 'HOME-PC';
  private lastSyncTime: string | null = null;
  private status: SyncStatus = 'synced';
  private online: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private serverRecordCount: number = 0;
  private lastError: string | null = null;
  private listeners: Set<Listener> = new Set();
  private isProcessing: boolean = false;
  private syncInterval: any = null;
  private onRemoteDataUpdateCallback: ((table: string, data: any) => void) | null = null;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // Load Device ID or set default
    const savedDeviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (savedDeviceId) {
      this.deviceId = savedDeviceId;
    } else {
      this.deviceId = 'HOME-PC';
      localStorage.setItem(DEVICE_ID_KEY, this.deviceId);
    }

    // Load Last Sync Time
    this.lastSyncTime = localStorage.getItem(LAST_SYNC_KEY);

    // Load Queue from localStorage
    try {
      const savedQueue = localStorage.getItem(QUEUE_KEY);
      if (savedQueue) {
        this.queue = JSON.parse(savedQueue);
      }
    } catch (e) {
      console.warn('[SyncEngine] Failed to read saved queue', e);
    }

    // Network listeners
    window.addEventListener('online', () => {
      this.online = true;
      this.notify();
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.online = false;
      this.status = 'offline';
      this.notify();
    });

    // Initial state setup
    if (!this.online) {
      this.status = 'offline';
    } else if (this.queue.length > 0) {
      this.status = 'pending';
    }

    // Start background polling loop every 10 seconds
    this.syncInterval = setInterval(() => {
      if (this.online) {
        this.processQueue();
      }
    }, 10000);
  }

  public registerRemoteUpdateCallback(cb: (table: string, data: any) => void) {
    this.onRemoteDataUpdateCallback = cb;
  }

  public getDeviceId(): string {
    return this.deviceId;
  }

  public setDeviceId(id: string) {
    if (!id || id.trim() === '') return;
    this.deviceId = id.trim().toUpperCase();
    localStorage.setItem(DEVICE_ID_KEY, this.deviceId);
    this.notify();
    this.processQueue();
  }

  public getState(): SyncState {
    return {
      status: this.status,
      lastSyncTime: this.lastSyncTime,
      pendingCount: this.queue.length,
      deviceId: this.deviceId,
      online: this.online,
      serverRecordCount: this.serverRecordCount,
      lastError: this.lastError
    };
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach(fn => {
      try {
        fn(state);
      } catch (err) {
        console.error('[SyncEngine] Listener error:', err);
      }
    });
  }

  private saveQueue() {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
    } catch (e) {
      console.warn('[SyncEngine] Failed to save queue to localStorage', e);
    }
  }

  // Enqueue a local record mutation (upsert or delete)
  public enqueueChange(table: string, recordId: string, action: 'upsert' | 'delete', data?: any) {
    if (!table || !recordId) return;

    // Filter out existing pending change for same table & recordId if new upsert replaces it
    this.queue = this.queue.filter(item => !(item.table === table && item.recordId === recordId));

    const newItem: SyncQueueItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      table,
      recordId,
      action,
      data,
      updatedAt: new Date().toISOString(),
      deviceId: this.deviceId,
      version: Date.now()
    };

    this.queue.push(newItem);
    this.saveQueue();

    if (this.online) {
      this.status = 'syncing';
      this.notify();
      // Queue background processing without blocking caller
      setTimeout(() => this.processQueue(), 100);
    } else {
      this.status = 'pending';
      this.notify();
    }
  }

  // Primary Sync Process Execution
  public async processQueue() {
    if (this.isProcessing) return;
    if (!navigator.onLine) {
      this.online = false;
      this.status = 'offline';
      this.notify();
      return;
    }

    this.isProcessing = true;
    if (this.queue.length > 0) {
      this.status = 'syncing';
    }
    this.notify();

    try {
      // 1. Process local image offloading to Cloud Image Store
      await this.uploadPendingImages();

      // 2. Upload pending queue items to Cloud API
      if (this.queue.length > 0) {
        const batchToUpload = [...this.queue];
        const res = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deviceId: this.deviceId,
            items: batchToUpload
          })
        });

        if (res.ok) {
          const result = await res.json();
          // Remove processed items from queue
          const processedIds = new Set(batchToUpload.map(i => i.id));
          this.queue = this.queue.filter(i => !processedIds.has(i.id));
          this.saveQueue();
          this.lastSyncTime = new Date().toISOString();
          localStorage.setItem(LAST_SYNC_KEY, this.lastSyncTime);
          this.lastError = null;
        } else {
          this.lastError = `Server returned ${res.status}`;
        }
      }

      // 3. Download cross-device cloud changes
      await this.pullCloudChanges();

      this.status = this.queue.length > 0 ? 'pending' : 'synced';
    } catch (err: any) {
      console.warn('[SyncEngine] Sync iteration encounter:', err);
      this.lastError = err?.message || 'Network error';
      this.status = this.queue.length > 0 ? 'pending' : 'offline';
    } finally {
      this.isProcessing = false;
      this.notify();
    }
  }

  // Upload image references (`idb:...`) to cloud
  private async uploadPendingImages() {
    try {
      // Find all image references in current queue items
      for (const item of this.queue) {
        if (!item.data) continue;
        const imageRefs = this.extractImageRefs(item.data);
        for (const ref of imageRefs) {
          const cachedPayload = ImageStore.getCachedImage(ref) || await ImageStore.getImage(ref);
          if (cachedPayload && (cachedPayload.startsWith('data:') || cachedPayload.startsWith('<svg'))) {
            await fetch('/api/images', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                imageId: ref,
                dataUrl: cachedPayload,
                deviceId: this.deviceId
              })
            }).catch(e => console.warn('[SyncEngine] Image upload soft fail:', e));
          }
        }
      }
    } catch (e) {
      console.warn('[SyncEngine] Image upload check exception:', e);
    }
  }

  private extractImageRefs(obj: any, refs: Set<string> = new Set()): string[] {
    if (!obj) return Array.from(refs);
    if (typeof obj === 'string') {
      if (obj.startsWith('idb:')) {
        refs.add(obj);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach(item => this.extractImageRefs(item, refs));
    } else if (typeof obj === 'object') {
      Object.keys(obj).forEach(k => this.extractImageRefs(obj[k], refs));
    }
    return Array.from(refs);
  }

  // Pull changes made on other devices
  private async pullCloudChanges() {
    try {
      const sinceParam = this.lastSyncTime ? encodeURIComponent(this.lastSyncTime) : '0';
      const res = await fetch(`/api/changes?since=${sinceParam}&deviceId=${encodeURIComponent(this.deviceId)}`);
      if (res.ok) {
        const data = await res.json();
        this.serverRecordCount = data.serverRecordCount || 0;
        const changes: CloudRecord[] = data.changes || [];

        if (changes.length > 0 && this.onRemoteDataUpdateCallback) {
          // Group changes by table
          const groupedByTable: Record<string, CloudRecord[]> = {};
          changes.forEach(change => {
            if (!groupedByTable[change.table]) groupedByTable[change.table] = [];
            groupedByTable[change.table].push(change);
          });

          for (const [table, records] of Object.entries(groupedByTable)) {
            this.onRemoteDataUpdateCallback(table, records);
          }
        }

        this.lastSyncTime = new Date().toISOString();
        localStorage.setItem(LAST_SYNC_KEY, this.lastSyncTime);
      }
    } catch (e) {
      console.warn('[SyncEngine] Pull changes soft error:', e);
    }
  }

  // Auto-migrate existing IndexedDB / StorageService local records to cloud D1 on first launch
  public autoMigrateExistingData(getAllLocalData: () => Record<string, any[]>) {
    const isMigrated = localStorage.getItem(MIGRATED_KEY);
    if (isMigrated) return;

    try {
      const localDataMap = getAllLocalData();
      let migratedCount = 0;

      for (const [table, records] of Object.entries(localDataMap)) {
        if (!Array.isArray(records)) continue;
        for (const record of records) {
          if (record && typeof record === 'object') {
            const recordId = record.id || `rec_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
            this.enqueueChange(table, recordId, 'upsert', record);
            migratedCount++;
          }
        }
      }

      localStorage.setItem(MIGRATED_KEY, 'true');
      console.log(`[SyncEngine] Auto-migrated ${migratedCount} local records to Cloud D1 queue.`);
    } catch (e) {
      console.warn('[SyncEngine] Auto-migration error:', e);
    }
  }
}

export const SyncEngine = new SyncEngineManager();
