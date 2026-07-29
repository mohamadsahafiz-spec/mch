import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AlertItem } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { getThemeClasses } from '../../theme/tokens';

interface OperationalPrerequisitesProps {
  alerts: AlertItem[];
}

export const OperationalPrerequisites: React.FC<OperationalPrerequisitesProps> = ({ alerts }) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const themeCls = getThemeClasses(isDark);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Facility & Safety Prerequisites */}
      <div className={`p-5 rounded-2xl border transition-all duration-250 space-y-4 ${
        isDark 
          ? 'bg-[#20252B] border-[#2B323A]/80 text-[#F3F4F6]' 
          : 'bg-white border-slate-200/80 text-slate-900 shadow-xs'
      }`}>
        <div className="flex items-center justify-between border-b border-[#2B323A]/50 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8ECDF7]" />
            <h3 className="text-sm font-semibold">Cleanroom & Safety Prerequisites</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#8ECDF7]/10 text-[#8ECDF7] border border-[#8ECDF7]/30 font-medium">
            ISO 4 VERIFIED
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
            isDark ? 'bg-[#1A1D21] border-[#2B323A]/60' : 'bg-slate-50 border-slate-200/60'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#7FD4A6] shrink-0 mt-1.5" />
            <div>
              <p className="font-semibold">ISO Class 4 Wafer Cleanroom Protocol</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Full gowning, ESD wristband grounding, airborne particle count &lt;10/m³.</p>
            </div>
          </div>

          <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
            isDark ? 'bg-[#1A1D21] border-[#2B323A]/60' : 'bg-slate-50 border-slate-200/60'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#8ECDF7] shrink-0 mt-1.5" />
            <div>
              <p className="font-semibold">Class 4 High-Power Optical Safety</p>
              <p className="text-[11px] text-slate-400 mt-0.5">OD 7+ laser safety eyewear rated for 1030nm femtosecond pulses required.</p>
            </div>
          </div>

          <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
            isDark ? 'bg-[#1A1D21] border-[#2B323A]/60' : 'bg-slate-50 border-slate-200/60'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B9DFF] shrink-0 mt-1.5" />
            <div>
              <p className="font-semibold">Required Engineering Toolkit</p>
              <p className="text-[11px] text-slate-400 mt-0.5">0.2µm filter canister spanner, thermal beam profiler, 9-point quartz grid target.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Machine Risks & Telemetry Alerts */}
      <div className={`p-5 rounded-2xl border transition-all duration-250 space-y-4 ${
        isDark 
          ? 'bg-[#20252B] border-[#2B323A]/80 text-[#F3F4F6]' 
          : 'bg-white border-slate-200/80 text-slate-900 shadow-xs'
      }`}>
        <div className="flex items-center justify-between border-b border-[#2B323A]/50 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#EFCB7A]" />
            <h3 className="text-sm font-semibold">Machine Health & Risk Telemetry</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#EFCB7A]/10 text-[#EFCB7A] border border-[#EFCB7A]/30 font-medium">
            2 ACTIVE RISKS
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
            isDark ? 'bg-[#EFCB7A]/10 border-[#EFCB7A]/25 text-slate-200' : 'bg-amber-50/80 border-amber-200 text-slate-900'
          }`}>
            <AlertTriangle className="w-4 h-4 text-[#EFCB7A] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#EFCB7A]">Cooling DI Water Filter Capacity Critical</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Filter life at 18% (12 days estimated). Flow delta dropped by 0.8 LPM. Swap filter in Stage 2.
              </p>
            </div>
          </div>

          <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
            isDark ? 'bg-[#E98A8A]/10 border-[#E98A8A]/25 text-slate-200' : 'bg-rose-50/80 border-rose-200 text-slate-900'
          }`}>
            <ShieldAlert className="w-4 h-4 text-[#E98A8A] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#E98A8A]">Laser Diode Module Head B Runtime Warning</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Logged 9,680 running hours (threshold: 10,000 hrs). Schedule diode stack swap for Q3 SLA cycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

