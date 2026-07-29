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
            <div className="p-3 rounded-xl bg-[#8B9DFF]/15 border border-[#8B9DFF]/30 text-[#8B9DFF] font-mono font-bold text-lg">
              v0.2.5
            </div>
            <div>
              <h3 className="text-base font-bold">Field Service Operations System</h3>
              <p className="text-xs text-slate-400">Mission Control Signature Design v0.2.5 — Operational Work Order Workspace</p>
            </div>
          </div>
          <Badge variant="blue">v0.2.5 OPERATIONAL</Badge>
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
