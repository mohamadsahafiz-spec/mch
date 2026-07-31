export type NavigationTab = 
  | 'start_page'
  | 'workflow_guide'
  | 'mission_control'
  | 'contracts'
  | 'planner'
  | 'customers'
  | 'machines'
  | 'mhc'
  | 'laser_calibration'
  | 'baseline_check'
  | 'quality_investigation'
  | 'reports'
  | 'analytics'
  | 'knowledge_base'
  | 'users'
  | 'settings';

export type UserRole =
  | 'Administrator'
  | 'Field Service Engineer'
  | 'Senior Engineer'
  | 'Supervisor'
  | 'Manager'
  | 'Viewer';

export type UserStatus =
  | 'Online'
  | 'Offline'
  | 'On Leave'
  | 'Busy'
  | 'Inactive';

export interface SystemUser {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  department: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  timezone: string;
  language: string;
  accountStatus: 'Active' | 'Suspended' | 'Pending Activation';
  avatarUrl?: string;
  bio?: string;
}

export type ProductionReleaseStatus = 'APPROVED' | 'CONDITIONAL' | 'HALTED' | 'UNDER_INSPECTION';

export interface Customer {
  id: string;
  name: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  plantsCount: number;
  activeContractsCount: number;
}

export interface Plant {
  id: string;
  customerId: string;
  customerName: string;
  name: string;
  location: string;
  timezone: string;
  linesCount: number;
  machinesCount: number;
}

export interface ProductionLine {
  id: string;
  plantId: string;
  plantName: string;
  name: string;
  code: string;
  description: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'STANDARD';
}

export interface LaserHead {
  id: string;
  model: string;
  serialNumber: string;
  runningHours: number;
  maxRecommendedHours: number;
  remainingHours: number;
  estimatedReplacementDate: string;
  powerOutputWatts: number;
  ratedPowerWatts: number;
  wavelengthNm: number;
  beamQualityM2: number;
  healthScore: number; // 0 - 100
}

export interface ConsumableItem {
  id: string;
  name: string;
  partNumber: string;
  currentLifePercent: number;
  lastReplacedDate: string;
  estimatedDaysRemaining: number;
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL_REPLACE';
}

export interface Machine {
  id: string;
  customerId: string;
  customerName: string;
  plantId: string;
  plantName: string;
  productionLineId: string;
  productionLineName: string;
  model: string;
  machineNumber: string;
  serialNumber: string;
  installationDate: string;
  baselineDate: string;
  healthScore: number; // 0 - 100
  laserHeads: LaserHead[];
  consumables: ConsumableItem[];
  status: 'OPERATIONAL' | 'NEEDS_CALIBRATION' | 'MAINTENANCE_DUE' | 'OUT_OF_SERVICE';
  photos: string[];
  lastMhcDate: string;
  nextMhcDate: string;
}

export interface SubsystemHealth {
  laserHead1: number;
  laserHead2: number;
  cooling: number;
  optics: number;
  stage: number;
  agc: number;
  powerStability: number;
  beamQuality: number;
  overallScore: number;
}

export interface MHCInspectionData {
  laserInspection: { status: 'PASS' | 'WARNING' | 'FAIL'; note: string };
  opticsInspection: { status: 'PASS' | 'WARNING' | 'FAIL'; cleanlinessPercent: number; note: string };
  coolingInspection: { status: 'PASS' | 'WARNING' | 'FAIL'; flowRateLpm: number; tempCelsius: number; note: string };
  powerCheck: { measuredWatts: number; targetWatts: number; stabilityPercent: number };
  beamProfile: { beamSizeMm: number; focusOffsetMm: number; symmetryRatio: number };
  stageCalibration: { xAccuracymm: number; yAccuracymm: number; zAccuracymm: number };
  agcCalibration: { responseTimeMs: number; errorMarginPercent: number };
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
}

export interface MHCRecord {
  id: string;
  machineId: string;
  machineName: string;
  machineSerialNumber: string;
  customerName: string;
  plantName: string;
  engineerName: string;
  date: string;
  healthScores: SubsystemHealth;
  inspectionData: MHCInspectionData;
  engineerRemarks: string;
  recommendations: string[];
  productionReleaseStatus: ProductionReleaseStatus;
  isReportGenerated: boolean;
}

export interface Contract {
  id: string;
  contractNumber: string;
  customerName: string;
  plantName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  durationMonths: number;
  totalWorkingDays: number;
  remainingWorkingDays: number;
  machinesCoveredIds: string[];
  engineerAssigned: string;
  deliverables: string[];
  quarterlyScheduleCount: number;
  terms: string;
  customNotes: string;
  status: 'ACTIVE' | 'PENDING' | 'RENEWAL_DUE' | 'COMPLETED';
  progressPercent: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  milestones: {
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
  }[];
}

export interface ExecutionScheduleItem {
  id: string;
  contractId: string;
  customerName: string;
  plantName: string;
  machineId: string;
  machineName: string;
  engineerName: string;
  title: string;
  scheduledDate: string; // YYYY-MM-DD (M-F strictly)
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Q5' | 'Q6' | 'Q7' | 'Q8';
  type: 'QUARTERLY_MHC' | 'BASELINE_CHECK' | 'LASER_CALIBRATION' | 'EMERGENCY_SUPPORT';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'RESCHEDULED';
  estimatedHours: number;
}

export interface ExecutiveReport {
  id: string;
  reportNumber: string;
  mhcId: string;
  customerName: string;
  plantName: string;
  machineModel: string;
  serialNumber: string;
  date: string;
  engineerName: string;
  executiveSummary: string;
  overallHealthScore: number;
  productionReleaseStatus: ProductionReleaseStatus;
  subsystemHealth: SubsystemHealth;
  laserRuntimeSummary: {
    runningHours: number;
    maxHours: number;
    head1Health: number;
    head2Health?: number;
  };
  coolingStatus: string;
  powerStability: string;
  beamProfileSummary: string;
  powerComparison: {
    baselinePowerWatts: number;
    currentPowerWatts: number;
    deltaPercent: number;
  };
  engineerRemarks: string;
  recommendations: string[];
  signatureName: string;
  signatureTitle: string;
  signedDate: string;
}

export interface QualityInvestigation {
  id: string;
  ticketNumber: string;
  machineId: string;
  machineName: string;
  customerName: string;
  reportedDate: string;
  issueDescription: string;
  rootCauseAnalysis: string;
  correctiveActionsTaken: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  engineerAssigned: string;
}

export interface BaselineCheck {
  id: string;
  machineId: string;
  machineName: string;
  date: string;
  engineerName: string;
  laserPowerBaselineWatts: number;
  beamDiameterMm: number;
  coolingFlowRateLpm: number;
  stageRepeatabilityMm: number;
  notes: string;
  passed: boolean;
}

export interface FieldEngineerTask {
  id: string;
  title: string;
  machineName: string;
  customerName: string;
  priority: 'URGENT' | 'HIGH' | 'NORMAL';
  dueDate: string;
  type: 'MHC' | 'CALIBRATION' | 'REPORT_PENDING' | 'CONSUMABLE_REPLACE';
  completed: boolean;
}

export interface AlertItem {
  id: string;
  type: 'LASER_RUNTIME' | 'CONSUMABLE' | 'HEALTH_CRITICAL';
  severity: 'CRITICAL' | 'WARNING';
  machineId: string;
  machineName: string;
  customerName: string;
  message: string;
  timestamp: string;
}

export interface EngineerProfile {
  name: string;
  company: string;
  role: string;
  department: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}

export type NotificationCategory =
  | 'MISSION_ASSIGNED'
  | 'MHC_DUE'
  | 'CONTRACT_REMINDER'
  | 'PLANNER_REMINDER'
  | 'PENDING_REPORT'
  | 'COMPLETED_REPORT'
  | 'CUSTOMER_ADDED'
  | 'MACHINE_ADDED'
  | 'SYSTEM_UPDATE';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  category: NotificationCategory;
  read: boolean;
  targetTab?: NavigationTab;
}

// Report Studio Foundation Types (v0.5.0)
export interface ReportSectionConfig {
  id: string;
  sectionType: string; // e.g. 'machine_info', 'customer_info', 'visit_summary'
  title: string;
  description?: string;
  category?: 'CORE' | 'INSPECTION' | 'TIMELINE' | 'SIGNATURES' | 'OTHER';
  visible: boolean;
  pageBreakBefore: boolean;
  collapsible: boolean;
  showSectionNumber: boolean;
  notes?: string;
  customSettings?: Record<string, boolean | string | number>;
}

export interface ReportTemplate {
  id: string;
  name: string;
  code: string; // e.g. 'STM_PM', 'STM_CM', 'INSTALLATION', 'ACCEPTANCE_TEST'
  description: string;
  category: 'Preventive Maintenance' | 'Corrective Maintenance' | 'Commissioning' | 'Emergency' | 'Internal' | 'Quick Visit';
  sections: ReportSectionConfig[];
  updatedAt: string;
  isDefault?: boolean;
}

export interface FounderBrandingConfig {
  companyName: string;
  companyLogoUrl: string;
  customerLogoUrl: string;
  headerText: string;
  footerText: string;
  showPageNumbers: boolean;
  primaryColor: string;
  engineerSignatureBlock: boolean;
  customerSignatureBlock: boolean;
  confidentialityBanner: boolean;
}

export interface ReportDraft {
  id: string;
  reportTitle: string;
  templateId?: string;
  templateName?: string;
  customerId?: string;
  customerName?: string;
  machineId?: string;
  machineName?: string;
  sections: ReportSectionConfig[];
  branding: FounderBrandingConfig;
  status: 'DRAFT' | 'READY_FOR_REVIEW' | 'SAVED';
  updatedAt: string;
}

