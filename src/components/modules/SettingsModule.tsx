import React from 'react';
import { Settings as SettingsIcon, ShieldCheck, Database, RefreshCw, Bot, User } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface SettingsProps {
  onResetData: () => void;
}

export const SettingsModule: React.FC<SettingsProps> = ({ onResetData }) => {
  return (
    <div className="space-y-6 pb-12">
      <Card title="System Version & Operational Build Status">
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#090f1c] border border-[#1a2842]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-400 font-mono font-bold text-lg">
              v0.3
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Field Service Operations System</h3>
              <p className="text-xs text-slate-400">Milestone Build Release v0.3 — Commercial Grade Field Operations Engine</p>
            </div>
          </div>
          <Badge variant="emerald">OPERATIONAL</Badge>
        </div>
      </Card>

      <Card title="Lead Field Service Engineer Profile">
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#090f1c] border border-slate-800">
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
              <span className="text-cyan-400 font-bold">ISO Class 4 Wafer Cleanroom</span>
            </div>
            <div>
              <span className="text-slate-400 block font-mono">Security SLA Level:</span>
              <span className="text-emerald-400 font-bold">Enterprise Tier 1</span>
            </div>
          </div>
        </div>
      </Card>

      <Card title="AI Operations Assistant Configuration (Architecture Ready)">
        <div className="space-y-2 text-xs">
          <p className="text-slate-300">
            AI Assistant predictive failure models are architected and ready for live Gemini 2.5 API key pairing.
          </p>
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#090f1c] border border-slate-800 font-mono">
            <span className="text-slate-400">AI Model Status:</span>
            <span className="text-cyan-400 font-bold">GEMINI 2.5 FLASH ARCHITECTURE READY</span>
          </div>
        </div>
      </Card>

      <Card title="Data Persistence & Operational State Reset">
        <div className="flex items-center justify-between text-xs">
          <div>
            <p className="font-semibold text-slate-200">Reset Local Storage to Factory System Defaults</p>
            <p className="text-slate-400 text-[11px]">Resets contracts, planner, MHC reports, and machine records to initial state.</p>
          </div>
          <Button variant="danger" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onResetData}>
            Reset Data
          </Button>
        </div>
      </Card>
    </div>
  );
};
