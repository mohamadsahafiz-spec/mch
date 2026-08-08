import { LaserEngine } from './laserEngine';
import { ImageStore } from './imageStore';
import { SyncEngine } from './syncEngine';
import { 
  Customer, 
  Plant, 
  ProductionLine, 
  Machine, 
  Contract, 
  ExecutionScheduleItem, 
  MHCRecord, 
  ExecutiveReport, 
  QualityInvestigation, 
  BaselineCheck, 
  FieldEngineerTask, 
  AlertItem,
  ReportTemplate,
  ReportDraft,
  FounderBrandingConfig,
  EngineerProfile,
  NotificationItem,
  SystemUser,
  WorkspaceMode,
  UserSession,
  MHCSession,
  MHCReportDraftConfig,
  MhcWorkspaceTemplate,
  MhcWorkspaceDraft
} from '../types';
import { 
  INITIAL_CUSTOMERS, 
  INITIAL_PLANTS, 
  INITIAL_LINES, 
  INITIAL_MACHINES, 
  INITIAL_CONTRACTS, 
  INITIAL_SCHEDULE_ITEMS, 
  INITIAL_MHC_RECORDS, 
  INITIAL_EXECUTIVE_REPORTS, 
  INITIAL_TASKS, 
  INITIAL_ALERTS, 
  INITIAL_QUALITY_INVESTIGATIONS, 
  INITIAL_BASELINES,
  INITIAL_REPORT_TEMPLATES,
  INITIAL_REPORT_DRAFTS,
  INITIAL_FOUNDER_BRANDING,
  INITIAL_ENGINEER_PROFILE,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
  INITIAL_MHC_SESSIONS,
  INITIAL_MHC_REPORT_DRAFTS
} from '../data/mockData';

const KEYS = {
  CUSTOMERS: 'fso_v04_customers',
  PLANTS: 'fso_v04_plants',
  LINES: 'fso_v04_lines',
  MACHINES: 'fso_v04_machines',
  CONTRACTS: 'fso_v04_contracts',
  SCHEDULE: 'fso_v04_schedule',
  MHC_RECORDS: 'fso_v04_mhc_records',
  REPORTS: 'fso_v04_reports',
  TASKS: 'fso_v04_tasks',
  ALERTS: 'fso_v04_alerts',
  INVESTIGATIONS: 'fso_v04_investigations',
  BASELINES: 'fso_v04_baselines',
  TEMPLATES: 'fso_v04_templates',
  DRAFTS: 'fso_v04_drafts',
  BRANDING: 'fso_v04_branding',
  PROFILE: 'fso_v072_profile',
  NOTIFICATIONS: 'fso_v072_notifications',
  USERS: 'fso_v073_users',
  AUTH: 'fso_v080_authenticated',
  WORKSPACE_MODE: 'fso_v080_workspace_mode',
  MHC_SESSIONS: 'fso_v080_mhc_sessions',
  MHC_REPORT_DRAFTS: 'fso_v080_mhc_report_drafts',
  MHC_WORKSPACE_TEMPLATES: 'fso_v090_mhc_workspace_templates',
  MHC_WORKSPACE_DRAFTS: 'fso_v090_mhc_workspace_drafts'
};

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
  }
  return defaultValue;
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e: any) {
    console.error(`[StorageService] Error writing ${key} to localStorage:`, e);
    throw new Error(`Failed to persist data to local storage (${e?.message || 'Storage Quota Exceeded'}).`);
  }
}

function syncEnqueueList<T extends { id?: string }>(tableName: string, items: T[]) {
  if (!Array.isArray(items)) return;
  items.forEach((item, idx) => {
    if (item) {
      const recordId = item.id || `${tableName}_${idx}`;
      SyncEngine.enqueueChange(tableName, recordId, 'upsert', item);
    }
  });
}

export const StorageService = {
  getCustomers: (): Customer[] => getStorage(KEYS.CUSTOMERS, INITIAL_CUSTOMERS),
  saveCustomers: (data: Customer[]) => {
    setStorage(KEYS.CUSTOMERS, data);
    syncEnqueueList('customers', data);
  },

  getPlants: (): Plant[] => getStorage(KEYS.PLANTS, INITIAL_PLANTS),
  savePlants: (data: Plant[]) => {
    setStorage(KEYS.PLANTS, data);
    syncEnqueueList('plants', data);
  },

  getLines: (): ProductionLine[] => getStorage(KEYS.LINES, INITIAL_LINES),
  saveLines: (data: ProductionLine[]) => {
    setStorage(KEYS.LINES, data);
    syncEnqueueList('lines', data);
  },

  getMachines: (): Machine[] => {
    let raw = getStorage(KEYS.MACHINES, INITIAL_MACHINES);
    if (!raw || !Array.isArray(raw) || raw.length === 0) {
      raw = INITIAL_MACHINES;
    }
    const normalized = LaserEngine.normalizeMachines(raw) as unknown as Machine[];
    return ImageStore.hydrateImagesSync(normalized);
  },
  saveMachines: (data: Machine[]) => {
    const processedMachines = data.map(m => {
      const recordId = m.id || `M-${Date.now()}`;
      return ImageStore.extractAndStoreImagesSync(m, recordId);
    });
    setStorage(KEYS.MACHINES, processedMachines);
    syncEnqueueList('machines', processedMachines);
  },

  getContracts: (): Contract[] => getStorage(KEYS.CONTRACTS, INITIAL_CONTRACTS),
  saveContracts: (data: Contract[]) => {
    setStorage(KEYS.CONTRACTS, data);
    syncEnqueueList('contracts', data);
  },

  getSchedule: (): ExecutionScheduleItem[] => getStorage(KEYS.SCHEDULE, INITIAL_SCHEDULE_ITEMS),
  saveSchedule: (data: ExecutionScheduleItem[]) => {
    setStorage(KEYS.SCHEDULE, data);
    syncEnqueueList('schedule', data);
  },

  getMhcRecords: (): MHCRecord[] => getStorage(KEYS.MHC_RECORDS, INITIAL_MHC_RECORDS),
  saveMhcRecords: (data: MHCRecord[]) => {
    setStorage(KEYS.MHC_RECORDS, data);
    syncEnqueueList('mhc_records', data);
  },

  getReports: (): ExecutiveReport[] => getStorage(KEYS.REPORTS, INITIAL_EXECUTIVE_REPORTS),
  saveReports: (data: ExecutiveReport[]) => {
    setStorage(KEYS.REPORTS, data);
    syncEnqueueList('reports', data);
  },

  getTasks: (): FieldEngineerTask[] => getStorage(KEYS.TASKS, INITIAL_TASKS),
  saveTasks: (data: FieldEngineerTask[]) => {
    setStorage(KEYS.TASKS, data);
    syncEnqueueList('tasks', data);
  },

  getAlerts: (): AlertItem[] => getStorage(KEYS.ALERTS, INITIAL_ALERTS),
  saveAlerts: (data: AlertItem[]) => {
    setStorage(KEYS.ALERTS, data);
    syncEnqueueList('alerts', data);
  },

  getInvestigations: (): QualityInvestigation[] => getStorage(KEYS.INVESTIGATIONS, INITIAL_QUALITY_INVESTIGATIONS),
  saveInvestigations: (data: QualityInvestigation[]) => {
    setStorage(KEYS.INVESTIGATIONS, data);
    syncEnqueueList('investigations', data);
  },

  getBaselines: (): BaselineCheck[] => getStorage(KEYS.BASELINES, INITIAL_BASELINES),
  saveBaselines: (data: BaselineCheck[]) => {
    setStorage(KEYS.BASELINES, data);
    syncEnqueueList('baselines', data);
  },

  getTemplates: (): ReportTemplate[] => getStorage(KEYS.TEMPLATES, INITIAL_REPORT_TEMPLATES),
  saveTemplates: (data: ReportTemplate[]) => {
    setStorage(KEYS.TEMPLATES, data);
    syncEnqueueList('templates', data);
  },

  getDrafts: (): ReportDraft[] => getStorage(KEYS.DRAFTS, INITIAL_REPORT_DRAFTS),
  saveDrafts: (data: ReportDraft[]) => {
    setStorage(KEYS.DRAFTS, data);
    syncEnqueueList('drafts', data);
  },

  getBranding: (): FounderBrandingConfig => getStorage(KEYS.BRANDING, INITIAL_FOUNDER_BRANDING),
  saveBranding: (data: FounderBrandingConfig) => setStorage(KEYS.BRANDING, data),

  getProfile: (): EngineerProfile => getStorage(KEYS.PROFILE, INITIAL_ENGINEER_PROFILE),
  saveProfile: (data: EngineerProfile) => setStorage(KEYS.PROFILE, data),

  getNotifications: (): NotificationItem[] => getStorage(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  saveNotifications: (data: NotificationItem[]) => setStorage(KEYS.NOTIFICATIONS, data),

  getUsers: (): SystemUser[] => getStorage(KEYS.USERS, INITIAL_USERS),
  saveUsers: (data: SystemUser[]) => setStorage(KEYS.USERS, data),

  getAuth: (): UserSession | null => getStorage(KEYS.AUTH, null),
  saveAuth: (session: UserSession | null) => setStorage(KEYS.AUTH, session),
  clearAuth: () => localStorage.removeItem(KEYS.AUTH),

  getWorkspaceMode: (): WorkspaceMode => getStorage(KEYS.WORKSPACE_MODE, 'MHC_MODE'),
  saveWorkspaceMode: (mode: WorkspaceMode) => setStorage(KEYS.WORKSPACE_MODE, mode),

  getMhcSessions: (): MHCSession[] => getStorage(KEYS.MHC_SESSIONS, INITIAL_MHC_SESSIONS),
  saveMhcSessions: (data: MHCSession[]) => {
    setStorage(KEYS.MHC_SESSIONS, data);
    syncEnqueueList('mhc_sessions', data);
  },

  getMhcReportDrafts: (): MHCReportDraftConfig[] => getStorage(KEYS.MHC_REPORT_DRAFTS, INITIAL_MHC_REPORT_DRAFTS),
  saveMhcReportDrafts: (data: MHCReportDraftConfig[]) => {
    setStorage(KEYS.MHC_REPORT_DRAFTS, data);
    syncEnqueueList('mhc_report_drafts', data);
  },

  getMhcWorkspaceTemplates: (): MhcWorkspaceTemplate[] => getStorage(KEYS.MHC_WORKSPACE_TEMPLATES, []),
  saveMhcWorkspaceTemplates: (data: MhcWorkspaceTemplate[]) => {
    setStorage(KEYS.MHC_WORKSPACE_TEMPLATES, data);
    syncEnqueueList('mhc_workspace_templates', data);
  },

  getMhcWorkspaceDrafts: (): MhcWorkspaceDraft[] => getStorage(KEYS.MHC_WORKSPACE_DRAFTS, []),
  saveMhcWorkspaceDrafts: (data: MhcWorkspaceDraft[]) => {
    setStorage(KEYS.MHC_WORKSPACE_DRAFTS, data);
    syncEnqueueList('mhc_workspace_drafts', data);
  },

  getAllLocalData: (): Record<string, any[]> => {
    return {
      machines: StorageService.getMachines(),
      mhc_sessions: StorageService.getMhcSessions(),
      reports: StorageService.getReports(),
      customers: StorageService.getCustomers(),
      plants: StorageService.getPlants(),
      lines: StorageService.getLines(),
      contracts: StorageService.getContracts(),
      tasks: StorageService.getTasks(),
      baselines: StorageService.getBaselines(),
      investigations: StorageService.getInvestigations(),
      mhc_report_drafts: StorageService.getMhcReportDrafts(),
      mhc_workspace_templates: StorageService.getMhcWorkspaceTemplates(),
      mhc_workspace_drafts: StorageService.getMhcWorkspaceDrafts()
    };
  },

  resetToDefaults: () => {
    localStorage.clear();
  }
};

// Register remote update merge handler
SyncEngine.registerRemoteUpdateCallback((tableName, remoteRecords) => {
  if (!Array.isArray(remoteRecords) || remoteRecords.length === 0) return;

  const keyMap: Record<string, { key: string; get: () => any[]; save: (data: any[]) => void }> = {
    machines: { key: KEYS.MACHINES, get: StorageService.getMachines, save: StorageService.saveMachines },
    mhc_sessions: { key: KEYS.MHC_SESSIONS, get: StorageService.getMhcSessions, save: StorageService.saveMhcSessions },
    reports: { key: KEYS.REPORTS, get: StorageService.getReports, save: StorageService.saveReports },
    customers: { key: KEYS.CUSTOMERS, get: StorageService.getCustomers, save: StorageService.saveCustomers },
    plants: { key: KEYS.PLANTS, get: StorageService.getPlants, save: StorageService.savePlants },
    lines: { key: KEYS.LINES, get: StorageService.getLines, save: StorageService.saveLines },
    contracts: { key: KEYS.CONTRACTS, get: StorageService.getContracts, save: StorageService.saveContracts },
    tasks: { key: KEYS.TASKS, get: StorageService.getTasks, save: StorageService.saveTasks },
    baselines: { key: KEYS.BASELINES, get: StorageService.getBaselines, save: StorageService.saveBaselines },
    investigations: { key: KEYS.INVESTIGATIONS, get: StorageService.getInvestigations, save: StorageService.saveInvestigations },
    mhc_report_drafts: { key: KEYS.MHC_REPORT_DRAFTS, get: StorageService.getMhcReportDrafts, save: StorageService.saveMhcReportDrafts },
    mhc_workspace_templates: { key: KEYS.MHC_WORKSPACE_TEMPLATES, get: StorageService.getMhcWorkspaceTemplates, save: StorageService.saveMhcWorkspaceTemplates },
    mhc_workspace_drafts: { key: KEYS.MHC_WORKSPACE_DRAFTS, get: StorageService.getMhcWorkspaceDrafts, save: StorageService.saveMhcWorkspaceDrafts }
  };

  const config = keyMap[tableName];
  if (!config) return;

  const currentLocal = config.get();
  const nextList = [...currentLocal];
  let updated = false;

  remoteRecords.forEach(rec => {
    if (rec.isDeleted) {
      const idx = nextList.findIndex(item => item && item.id === rec.recordId);
      if (idx !== -1) {
        nextList.splice(idx, 1);
        updated = true;
      }
    } else if (rec.data) {
      const idx = nextList.findIndex(item => item && item.id === rec.recordId);
      if (idx !== -1) {
        nextList[idx] = rec.data;
      } else {
        nextList.unshift(rec.data);
      }
      updated = true;
    }
  });

  if (updated) {
    setStorage(config.key, nextList);
  }
});
