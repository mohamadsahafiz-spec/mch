import React from 'react';
import { Settings as SettingsIcon, ShieldCheck, Database, RefreshCw, Bot, User, History, CheckCircle2, FileText } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface SettingsProps {
  onResetData: () => void;
}

export const SettingsModule: React.FC<SettingsProps> = ({ onResetData }) => {
  const changelog = [
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#090f1c] border border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-800 text-blue-400 font-mono font-bold text-lg">
              v0.2.1
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Field Service Operations System</h3>
              <p className="text-xs text-slate-400">CTO Design Revision Build v0.2.1 — Field Operations Engineering Workspace</p>
            </div>
          </div>
          <Badge variant="blue">v0.2.1 OPERATIONAL</Badge>
        </div>
      </Card>

      {/* Structured Changelog */}
      <Card title="System Architecture Milestone Changelog">
        <div className="space-y-4">
          {changelog.map((entry) => (
            <div key={entry.version} className="p-4 rounded-xl bg-[#090f1c] border border-slate-800/80 text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/50">
                    {entry.version}
                  </span>
                  <span className="font-semibold text-slate-200">{entry.type}</span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">{entry.date}</span>
              </div>

              <ul className="space-y-1.5 pt-1">
                {entry.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* Lead Engineer Profile */}
      <Card title="Lead Field Service Engineer Profile">
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#090f1c] border border-slate-800">
            <div>
              <span className="text-slate-400 block font-mono">Engineer Name:</span>
              <span className="text-slate-100 font-bold">Alex Mercer</span>
            </div>
            <div>
              <span className="text-slate-400 block font-mono">Title:</span>
              <span className="text-slate-100 font-bold">Lead Laser Field Service Engineer</span>
            </div>
            <div>
              <span className="text-slate-400 block font-mono">Cleanroom Certification:</span>
              <span className="text-blue-400 font-bold">ISO Class 4 Wafer Cleanroom</span>
            </div>
            <div>
              <span className="text-slate-400 block font-mono">Security SLA Level:</span>
              <span className="text-emerald-400 font-bold">Enterprise Tier 1</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Local Storage Reset */}
      <Card title="Data Persistence & Operational State Reset">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-semibold text-slate-200">Reset Local Storage to Factory System Defaults</p>
            <p className="text-slate-400 text-[11px]">Resets contracts, planner, MHC reports, and machine records to initial state.</p>
          </div>
          <Button variant="danger" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onResetData}>
            Reset System Data
          </Button>
        </div>
      </Card>
    </div>
  );
};
