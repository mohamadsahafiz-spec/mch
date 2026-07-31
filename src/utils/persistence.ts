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
  NotificationItem
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
  INITIAL_NOTIFICATIONS
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
  NOTIFICATIONS: 'fso_v072_notifications'
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
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

export const StorageService = {
  getCustomers: (): Customer[] => getStorage(KEYS.CUSTOMERS, INITIAL_CUSTOMERS),
  saveCustomers: (data: Customer[]) => setStorage(KEYS.CUSTOMERS, data),

  getPlants: (): Plant[] => getStorage(KEYS.PLANTS, INITIAL_PLANTS),
  savePlants: (data: Plant[]) => setStorage(KEYS.PLANTS, data),

  getLines: (): ProductionLine[] => getStorage(KEYS.LINES, INITIAL_LINES),
  saveLines: (data: ProductionLine[]) => setStorage(KEYS.LINES, data),

  getMachines: (): Machine[] => getStorage(KEYS.MACHINES, INITIAL_MACHINES),
  saveMachines: (data: Machine[]) => setStorage(KEYS.MACHINES, data),

  getContracts: (): Contract[] => getStorage(KEYS.CONTRACTS, INITIAL_CONTRACTS),
  saveContracts: (data: Contract[]) => setStorage(KEYS.CONTRACTS, data),

  getSchedule: (): ExecutionScheduleItem[] => getStorage(KEYS.SCHEDULE, INITIAL_SCHEDULE_ITEMS),
  saveSchedule: (data: ExecutionScheduleItem[]) => setStorage(KEYS.SCHEDULE, data),

  getMhcRecords: (): MHCRecord[] => getStorage(KEYS.MHC_RECORDS, INITIAL_MHC_RECORDS),
  saveMhcRecords: (data: MHCRecord[]) => setStorage(KEYS.MHC_RECORDS, data),

  getReports: (): ExecutiveReport[] => getStorage(KEYS.REPORTS, INITIAL_EXECUTIVE_REPORTS),
  saveReports: (data: ExecutiveReport[]) => setStorage(KEYS.REPORTS, data),

  getTasks: (): FieldEngineerTask[] => getStorage(KEYS.TASKS, INITIAL_TASKS),
  saveTasks: (data: FieldEngineerTask[]) => setStorage(KEYS.TASKS, data),

  getAlerts: (): AlertItem[] => getStorage(KEYS.ALERTS, INITIAL_ALERTS),
  saveAlerts: (data: AlertItem[]) => setStorage(KEYS.ALERTS, data),

  getInvestigations: (): QualityInvestigation[] => getStorage(KEYS.INVESTIGATIONS, INITIAL_QUALITY_INVESTIGATIONS),
  saveInvestigations: (data: QualityInvestigation[]) => setStorage(KEYS.INVESTIGATIONS, data),

  getBaselines: (): BaselineCheck[] => getStorage(KEYS.BASELINES, INITIAL_BASELINES),
  saveBaselines: (data: BaselineCheck[]) => setStorage(KEYS.BASELINES, data),

  getTemplates: (): ReportTemplate[] => getStorage(KEYS.TEMPLATES, INITIAL_REPORT_TEMPLATES),
  saveTemplates: (data: ReportTemplate[]) => setStorage(KEYS.TEMPLATES, data),

  getDrafts: (): ReportDraft[] => getStorage(KEYS.DRAFTS, INITIAL_REPORT_DRAFTS),
  saveDrafts: (data: ReportDraft[]) => setStorage(KEYS.DRAFTS, data),

  getBranding: (): FounderBrandingConfig => getStorage(KEYS.BRANDING, INITIAL_FOUNDER_BRANDING),
  saveBranding: (data: FounderBrandingConfig) => setStorage(KEYS.BRANDING, data),

  getProfile: (): EngineerProfile => getStorage(KEYS.PROFILE, INITIAL_ENGINEER_PROFILE),
  saveProfile: (data: EngineerProfile) => setStorage(KEYS.PROFILE, data),

  getNotifications: (): NotificationItem[] => getStorage(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  saveNotifications: (data: NotificationItem[]) => setStorage(KEYS.NOTIFICATIONS, data),

  resetToDefaults: () => {
    localStorage.clear();
  }
};

