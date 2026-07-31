import React from 'react';
import { Settings as SettingsIcon, ShieldCheck, Database, RefreshCw, Bot, User, History, CheckCircle2, FileText } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useTheme } from '../../context/ThemeContext';

interface SettingsProps {
  onResetData: () => void;
}

export const SettingsModule: React.FC<SettingsProps> = ({ onResetData }) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const changelog = [
    {
      version: 'v0.6.0',
      date: '2026-08-01',
      type: 'Service Execution Foundation — SOP Navigation Enhancement (ECO-20260801-022)',
      highlights: [
        'Established FSOS Workflow Navigation Principle: Exists once, remains visible, reflects progress.',
        'Replaced top horizontal Mission Progression bar with persistent sticky vertical Workflow Navigator.',
        'Implemented automatic scroll-position synchronization with real-time active step detection.',
        'Added visual step indicators for completed (✓), active (►), and upcoming (○) SOP stages.',
        'Integrated smooth-scroll click jumping across all 6 SOP phases (Mission, Passport, MHC, Planner, Report, Complete).',
        'Extracted WorkflowNavigator as a reusable component for future execution modules (Calibration, Quality, Reports).'
      ]
    },
    {
      version: 'v0.5.3',
      date: '2026-07-31',
      type: 'Machine Passport Production Ready (ECO-20260731-021)',
      highlights: [
        'Declared Machine Passport feature-complete for Founder Release v0.5.3.',
        'Validated two-tier workspace interaction standard: Workspace Management vs Selected Object Management.',
        'Refined Customer & Machine Workspace card visual consistency, dashed creation tiles, and hover states.',
        'Verified zero modal clipping issues on Machine Hero Cockpit dropdowns across Light and Dark themes.',
        'Established Machine Passport as the gold-standard reference implementation for upcoming Service Execution and Report Studio milestones.'
      ]
    },
    {
      version: 'v0.5.2',
      date: '2026-07-31',
      type: 'Workspace Interaction Standardization (ECO-20260731-019)',
      highlights: [
        'Established FSOS permanent Workspace Interaction Principle: Creation is a Workspace Action, Management is an Object Action.',
        'Extracted "Add Machine" from Machine Actions dropdown and implemented dedicated "+ Add Machine" card tile in Machine Workspace grid.',
        'Maintained strict visual consistency between Customer Workspace cards and Machine Workspace cards (proportions, border-radius, hover transitions, dashed creation tiles).',
        'Enhanced Managed Laser Fleet header with rich customer account site, asset count, and operational availability status indicators.',
        'Kept Machine Actions dropdown strictly contextual to the selected machine (Edit, Rename, Duplicate, Archive, Delete).',
        'Updated version discipline across system sidebar, settings, report studio, and CTO notes.'
      ]
    },
    {
      version: 'v0.5.1',
      date: '2026-07-31',
      type: 'Customer Workspace Management (ECO-20260731-018)',
      highlights: [
        'Resolved MP-001 Machine Hero Cockpit dropdown menu clipping issue by eliminating parent overflow constraints.',
        'Completed full Customer CRUD suite (Add, Edit Details, Quick Rename, Delete Account) with persistent state.',
        'Integrated overflow dropdown menu (⋮) on all Layer 1 Customer Cards for inline account management.',
        'Added Add Customer card to Layer 1 grid for streamlined account creation.',
        'Enforced full version alignment to v0.5.1 across system sidebar, settings, and release notes.'
      ]
    },
    {
      version: 'v0.5.0',
      date: '2026-07-31',
      type: 'Customer Workspace Foundation (ECO-20260731-017)',
      highlights: [
        'Architected Layer 1 Customer Workspace with high-precision account cards displaying machine counts, average health, PM due, and critical alert badges.',
        'Architected Layer 2 Machine Workspace displaying filtered laser asset cards for the active customer account.',
        'Seamlessly bound Layer 3 Machine Hero Cockpit to selected machine cards for unified 3-tier navigation: Customer → Machine → Workspace.',
        'Preserved all existing CRUD features (Add, Edit, Rename, Duplicate, Archive, Delete) and 8-Point MHC execution workflows.',
        'Scaled navigation architecture for multi-customer, multi-site, and 100+ machine expansion.',
        'Updated system version discipline to v0.5.0 across all application modules.'
      ]
    },
    {
      version: 'v0.4.2',
      date: '2026-07-30',
      type: 'Machine Passport UX Enhancement (ECO-20260730-016)',
      highlights: [
        'Redesigned Machine Passport top section into a high-precision industrial hero cockpit.',
        'Created Fleet Navigator strip with Previous/Next machine controls and active status counts.',
        'Promoted selected machine to prominent Hero Card displaying core identity, health gauge, and location.',
        'Grouped all management functions (Add, Edit, Rename, Duplicate, Archive, Delete) into a sleek Machine Actions dropdown.',
        'Streamlined primary workflow actions (Execute 8-Point MHC, View Reports) for immediate engineer clarity.',
        'Maintained complete backward compatibility and system version discipline at v0.4.2.'
      ]
    },
    {
      version: 'v0.4.1',
      date: '2026-07-30',
      type: 'Machine Passport Management (ECO-20260730-015)',
      highlights: [
        'Integrated complete Machine Passport Management suite inside MachinePassportModule.',
        'Added Add Machine feature with complete telemetry baseline, laser heads, and consumable defaults.',
        'Added Edit Machine feature for updating machine specifications, customer allocations, and health scores.',
        'Added Rename Machine feature for fast inline re-designation of machine models and IDs.',
        'Added Delete Machine feature with confirmation dialog and automatic fleet re-selection.',
        'Positioned high-visibility management toolbar for <5-second discovery in Machine Passport.',
        'Updated system version discipline to v0.4.1 across sidebar, settings, and release notes.'
      ]
    },
    {
      version: 'v0.3.1',
      date: '2026-07-30',
      type: 'Theme Consistency (ECO-20260730-013)',
      highlights: [
        'Completed system-wide Light Theme compliance audit across all 15 operational modules.',
        'Standardized shared theme tokens across reusable UI primitives (Card, Button, Badge, Modal, Tables).',
        'Eliminated hardcoded theme color overrides to ensure automatic theme inheritance.',
        'Improved readability, font weights, and surface elevation contrast for bright site operations.',
        'Unified Dark Mode and Light Mode visual fidelity and component behavior.',
        'Engineering Metrics: 28 Files Reviewed, 14 Files Modified, 112 Hardcoded Theme Colors Converted, 0 Remaining Violations.'
      ]
    },
    {
      version: 'v0.3.0',
      date: '2026-07-30',
      type: 'Premium Light Experience (ECO-20260730-012)',
      highlights: [
        'Rebuilt Light Theme Design System for enhanced clarity, accessibility, and professional polish.',
        'Elevated text contrast hierarchy across headings, body text, and labels for comfortable reading.',
        'Improved surface elevation and border separation for clean card visibility across all system views.',
        'Refined sticky workflow navigation, badges, timeline connectors, and buttons for light mode operations.',
        'Enhanced sidebar readability with distinct section group titles and active item indicators.',
        'Dark theme token values strictly preserved and verified.'
      ]
    },
    {
      version: 'v0.2.9',
      date: '2026-07-30',
      type: 'Information Architecture (ECO-20260730-011)',
      highlights: [
        'Sidebar reorganized into workflow-based groups (DAILY WORK, SERVICE EXECUTION, OPERATIONS, SMART TOOLS, SYSTEM).',
        'Added collapsible navigation sections with auto-expansion for the active workflow tab.',
        'Reduced navigation complexity and cognitive load for field service engineers.',
        'Improved engineer workflow discovery following operational journey instead of flat/alphabetical lists.',
        'Preserved existing module functionality and routing architecture across all 15 system modules.'
      ]
    },
    {
      version: 'v0.2.8',
      date: '2026-07-30',
      type: 'Guided Navigation (ECO-20260730-010)',
      highlights: [
        'Added sticky Mission Progression navigation bar for effortless orientation during field operations.',
        'Added smooth scroll workflow navigation with stable section anchors (#mission, #passport, #mhc, #planner, #report, #complete).',
        'Active workflow step now tracks scrolling automatically via IntersectionObserver without layout flashing.',
        'Improved Workflow Guide usability for new field service engineers entering cleanroom sites.',
        'Existing workflow architecture, 6-phase SOP journey, and direct quick-action buttons preserved.'
      ]
    },
    {
      version: 'v0.2.7',
      date: '2026-07-30',
      type: 'Workflow Guide (ECO-20260730-009)',
      highlights: [
        'Introduced new Workflow Guide module providing 6-phase Standard Operating Procedure (SOP).',
        'Standardized step structure: Purpose, What To Do (max 4 bullets), Expected Outcome, Quick Action Buttons.',
        'Added visual progress indicator bar and end-of-workflow completion badge.'
      ]
    },
    {
      version: 'v0.2.5',
      date: '2026-07-30',
      type: 'Mission Control Signature Design (ECO-20260730-003)',
      highlights: [
        'Transformed Mission Control into an engineer\'s Operational Desk with signature visual identity.',
        'Implemented full pastel color language (#111315, #1A1D21, #20252B, #2B323A, #8B9DFF, #7FD4A6, #8ECDF7, #EFCB7A, #E98A8A).',
        'Implemented complete Theme Engine supporting Dark, Light, and System modes with smooth 250ms transitions.',
        'Refined Hero Section answering the 5 core operational questions in under 5 seconds.',
        'Added dedicated compact Machine Snapshot panel (Health, Heads, Cooling, Runtime, Remaining Service Life, SLA Progress).',
        'Reduced visual noise, softened borders, increased whitespace and mathematical typographic hierarchy.'
      ]
    },
    {
      version: 'v0.2.2',
      date: '2026-07-29',
      type: 'Mission Control Re-Architecture (ECO-20260729-004)',
      highlights: [
        "Re-architected Mission Control from a generic dashboard into a true operational workspace (like opening today's work order).",
        "Starts immediately with today's operation: Customer, Machine, Purpose, Inspection Stage, and Next Action.",
        "Split Mission Control into modular components: ActiveWorkOrderHeader, InspectionStageStepper, WorkOrderChecklist, OperationalPrerequisites, TodayActivityLog.",
        "Removed quick-action buttons grid and statistics charts from Mission Control in favor of sequence-based action flow.",
        "Embedded contextual AI guidance directly inside active inspection stages."
      ]
    },
    {
      version: 'v0.2.1',
      date: '2026-07-29',
      type: 'CTO Design Revision',
      highlights: [
        'Shifted interface to calm, quiet, industrial operations workspace for field engineers.',
        'Implemented intentional Light & Dark theme transition between dark operational workspace and bright customer documents.',
        'Redesigned Executive Reports & Knowledge Base into crisp, document-oriented light theme.',
        'Removed artificial stats blocks and glowing visual noise in favor of mission-first hierarchy.',
        'Enforced strict version discipline across all footers, settings, and documentation.'
      ]
    },
    {
      version: 'v0.2.0',
      date: '2026-07-15',
      type: 'Core System Expansion',
      highlights: [
        'Added 2-Year Execution Planner for long-term contract SLA maintenance scheduling.',
        'Integrated 8-Point Machine Health Check (MHC) automated score calculator.',
        'Added Laser Optics Beam Profiler & Galvo Scanner Calibration module.'
      ]
    },
    {
      version: 'v0.1.0',
      date: '2026-06-01',
      type: 'Initial Platform Release',
      highlights: [
        'Initial release of Field Service Operations System with Machine Passport & Contract Tracking.'
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Version Status Card */}
      <Card title="System Version & Operational Build Status">
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border gap-4 ${
          isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border font-mono font-bold text-lg ${
              isDark ? 'bg-[#8B9DFF]/15 border-[#8B9DFF]/30 text-[#8B9DFF]' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}>
              v0.6.0
            </div>
            <div>
              <h3 className="text-base font-bold">Field Service Operations System</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
                Service Execution Foundation v0.6.0 — SOP Navigation Enhancement (ECO-20260801-022)
              </p>
            </div>
          </div>
          <Badge variant="blue">v0.6.0 OPERATIONAL</Badge>
        </div>
      </Card>

      {/* Structured Changelog */}
      <Card title="System Architecture Milestone Changelog">
        <div className="space-y-4">
          {changelog.map((entry) => (
            <div key={entry.version} className={`p-4 rounded-xl border text-xs space-y-2 ${
              isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b border-[#2B323A]/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#8B9DFF]">{entry.version}</span>
                  <span className="font-semibold">{entry.type}</span>
                </div>
                <span className="font-mono text-slate-400">{entry.date}</span>
              </div>
              <ul className="space-y-1 pl-4 list-disc text-slate-400">
                {entry.highlights.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* Engineer Profile & Reset */}
      <Card title="Engineer Workspace & System Data Management">
        <div className="space-y-4 text-xs">
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-[#8B9DFF]" />
              <div>
                <p className="font-bold text-sm">Alex Mercer</p>
                <p className="text-slate-400">Lead Field Service Engineer • Certification: TRUMPF Tier 3 Laser Optics</p>
              </div>
            </div>
            <Badge variant="emerald">ACTIVE ON-SITE</Badge>
          </div>

          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <p className="font-bold text-sm text-[#E98A8A]">Reset Local Workspace State</p>
              <p className="text-slate-400">Restores default contracts, machines, schedule, tasks, and MHC audit records.</p>
            </div>
            <Button variant="danger" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onResetData}>
              Reset State
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
