import React from 'react';
import { ShieldAlert, AlertTriangle, Wrench, ShieldCheck, Cpu, Clock, CheckCircle2 } from 'lucide-react';
import { AlertItem } from '../../types';

interface OperationalPrerequisitesProps {
  alerts: AlertItem[];
}

export const OperationalPrerequisites: React.FC<OperationalPrerequisitesProps> = ({ alerts }) => {
  const machineAlerts = alerts.filter(a => a.machineName.includes('TSMC') || a.machineName.includes('TruMicro'));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Facility & Safety Prerequisites */}
      <div className="p-5 rounded-2xl bg-[#0e172a] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-100">Operational & Cleanroom Prerequisites</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
            ISO 4 VERIFIED
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-3 rounded-xl bg-[#090f1d] border border-slate-800/80 flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
            <div>
              <p className="font-semibold text-slate-200">ISO Class 4 Wafer Cleanroom Protocol</p>
              <p className="text-[11px] text-slate-400">Full gowning, ESD wristband grounding, airborne particle count &lt;10/m³.</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#090f1d] border border-slate-800/80 flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-1.5" />
            <div>
              <p className="font-semibold text-slate-200">Class 4 High-Power Optical Safety</p>
              <p className="text-[11px] text-slate-400">OD 7+ laser safety eyewear rated for 1030nm femtosecond pulses required.</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#090f1d] border border-slate-800/80 flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
            <div>
              <p className="font-semibold text-slate-200">Required Engineering Toolkit</p>
              <p className="text-[11px] text-slate-400">0.2µm filter canister spanner, thermal beam profiler, 9-point quartz grid target.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Machine Risks & Telemetry Alerts */}
      <div className="p-5 rounded-2xl bg-[#0e172a] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">Machine Health & Risk Telemetry</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
            2 ACTIVE RISKS
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-200">Cooling DI Water Filter Capacity Critical</p>
              <p className="text-[11px] text-amber-300/80">
                Filter life at 18% (12 days estimated). Flow delta dropped by 0.8 LPM. Swap filter in Stage 2.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-800/40 text-rose-200 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Laser Diode Module Head B Runtime Warning</p>
              <p className="text-[11px] text-rose-300/80">
                Logged 9,680 running hours (threshold: 10,000 hrs). Schedule diode stack swap for Q3 SLA cycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
