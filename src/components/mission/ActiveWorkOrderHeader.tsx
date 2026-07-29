import React from 'react';
import { Building2, Cpu, Calendar, ShieldCheck, Zap, ArrowRight, Play, Clock, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { NavigationTab } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface ActiveWorkOrderHeaderProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenQuickMhc: () => void;
}

export const ActiveWorkOrderHeader: React.FC<ActiveWorkOrderHeaderProps> = ({
  onNavigate,
  onOpenQuickMhc
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  return (
    <div className={`p-6 md:p-8 rounded-2xl border transition-all duration-200 ${
      isDark 
        ? 'bg-[#20252B] border-[#2B323A] text-[#F3F4F6]' 
        : 'bg-white border-slate-200 text-slate-900 shadow-xs'
    }`}>
      {/* Greeting & Work Order Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#2B323A]/60">
        <div>
          <span className="text-[11px] font-mono tracking-wider font-semibold uppercase text-[#8B9DFF] block mb-1">
            OPERATIONAL DESK • WORK ORDER #WO-20260729-TSMC
          </span>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Good morning, Alex
          </h1>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7FD4A6]/10 text-[#7FD4A6] border border-[#7FD4A6]/30 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#7FD4A6] animate-pulse" />
            SLA SLA-TSMC-2026 (99.8% Target)
          </span>
          <span className="text-slate-400">Est. Completion: 11:30 AM UTC (2h 40m left)</span>
        </div>
      </div>

      {/* Hero Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-center">
        {/* Five Answers Core Info */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                TODAY'S CUSTOMER
              </span>
              <p className="text-sm font-bold text-[#8ECDF7]">
                TSMC — Taiwan Semiconductor
              </p>
              <p className="text-xs text-slate-400">Fab 18A Cleanroom • Bay 4</p>
            </div>

            {/* Machine */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                TODAY'S MACHINE
              </span>
              <p className="text-sm font-bold text-[#8B9DFF]">
                TRUMPF TruMicro 7000 Series
              </p>
              <p className="text-xs text-slate-400">SN: TRU-7070-8841 (MCH-TSMC-01)</p>
            </div>
          </div>

          {/* Today's Mission */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B9DFF] font-bold block mb-1">
              TODAY'S MISSION
            </span>
            <p className="text-sm font-semibold text-slate-200 leading-snug">
              Q3 Scheduled SLA Maintenance & DI Water Cooling Filter Replacement. Swap filter cartridge and execute 8-Point MHC prior to 14:00 UTC wafer annealing release.
            </p>
          </div>
        </div>

        {/* Current Inspection Stage & Single Primary Action */}
        <div className={`lg:col-span-4 p-5 rounded-xl border space-y-5 flex flex-col justify-between h-full ${
          isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              CURRENT INSPECTION STAGE
            </span>
            <div className="flex items-center gap-2 text-base font-bold text-[#8B9DFF]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B9DFF] animate-ping" />
              Stage 3 of 5: Galvo Realignment
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Filter swap complete. Servo gain latency check active.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            className="w-full justify-between font-semibold shadow-md"
            icon={<Play className="w-4 h-4 fill-current" />}
            onClick={onOpenQuickMhc}
          >
            <span>Execute Stage 3 Check</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
