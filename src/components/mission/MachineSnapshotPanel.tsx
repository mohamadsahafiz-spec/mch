import React from 'react';
import { Cpu, Zap, Activity, Clock, ShieldCheck, HeartPulse } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Machine } from '../../types';

interface MachineSnapshotPanelProps {
  machine?: Machine;
}

export const MachineSnapshotPanel: React.FC<MachineSnapshotPanelProps> = ({ machine }) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const healthScore = machine ? machine.healthScore : 94;
  const status = machine ? machine.status : 'HEALTHY';

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-200 ${
      isDark 
        ? 'bg-[#20252B] border-[#2B323A] text-[#F3F4F6]' 
        : 'bg-white border-slate-200 text-slate-900 shadow-xs'
    }`}>
      {/* Title & Overall Health Pill */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2B323A]/60">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
            MACHINE SNAPSHOT
          </span>
          <h3 className="text-base font-bold tracking-tight">
            TRUMPF TruMicro 7000 Series
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#7FD4A6] bg-[#7FD4A6]/10 px-2.5 py-1 rounded-md border border-[#7FD4A6]/30 flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5" />
            {healthScore} / 100 ({status})
          </span>
        </div>
      </div>

      {/* Snapshot Subsystems Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-4 text-xs font-mono">
        <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'}`}>
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Laser Head 1</span>
          <span className="font-bold text-[#7FD4A6]">98% Nominal</span>
        </div>

        <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'}`}>
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Laser Head 2</span>
          <span className="font-bold text-[#7FD4A6]">91% Nominal</span>
        </div>

        <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'}`}>
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Cooling Loop</span>
          <span className="font-bold text-[#EFCB7A]">84% (In Progress)</span>
        </div>

        <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'}`}>
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Runtime Log</span>
          <span className="font-bold text-slate-200">9,680 / 10k hrs</span>
        </div>

        <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'}`}>
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Service Life</span>
          <span className="font-bold text-[#8ECDF7]">320 Operating Hrs</span>
        </div>

        <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'}`}>
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Contract SLA</span>
          <span className="font-bold text-[#8B9DFF]">Q3 (Month 8 / 12)</span>
        </div>

        <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'}`}>
          <span className="text-[10px] text-slate-400 uppercase block mb-1">Next SLA Cycle</span>
          <span className="font-bold text-slate-300">August 2026</span>
        </div>
      </div>
    </div>
  );
};
