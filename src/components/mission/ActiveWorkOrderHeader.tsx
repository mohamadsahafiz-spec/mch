import React from 'react';
import { Building2, Cpu, Calendar, ShieldCheck, Zap, ArrowRight, Play, Clock, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { NavigationTab } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { getThemeClasses } from '../../theme/tokens';

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
  const themeCls = getThemeClasses(isDark);

  return (
    <div className={`p-6 md:p-7 rounded-2xl border transition-all duration-250 ${
      isDark 
        ? 'bg-[#20252B] border-[#2B323A]/80 text-[#F3F4F6]' 
        : 'bg-white border-slate-200/80 text-slate-900 shadow-xs'
    }`}>
      {/* Greeting & Work Order Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#2B323A]/50">
        <div>
          <span className="text-[10px] font-mono tracking-wider font-semibold uppercase text-[#8B9DFF] block mb-0.5">
            WORK ORDER #WO-20260729-TSMC
          </span>
          <h1 className="text-lg md:text-xl font-semibold tracking-tight">
            Good morning, Alex
          </h1>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#7FD4A6]/10 text-[#7FD4A6] border border-[#7FD4A6]/30 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7FD4A6]" />
            SLA-TSMC-2026 (99.8% Target)
          </span>
          <span className="text-slate-400">Est. Completion: 11:30 AM UTC</span>
        </div>
      </div>

      {/* Hero Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-5 items-stretch">
        {/* Core Operational Details */}
        <div className="lg:col-span-8 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Customer */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1A1D21] border-[#2B323A]/60' : 'bg-slate-50 border-slate-200/60'}`}>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                CUSTOMER
              </span>
              <p className="text-sm font-semibold text-[#8ECDF7]">
                TSMC — Taiwan Semiconductor
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Fab 18A Cleanroom • Bay 4</p>
            </div>

            {/* Machine */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1A1D21] border-[#2B323A]/60' : 'bg-slate-50 border-slate-200/60'}`}>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                TARGET MACHINE
              </span>
              <p className="text-sm font-semibold text-[#8B9DFF]">
                TRUMPF TruMicro 7000 Series
              </p>
              <p className="text-xs text-slate-400 mt-0.5">SN: TRU-7070-8841 (MCH-TSMC-01)</p>
            </div>
          </div>

          {/* Today's Mission */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1A1D21] border-[#2B323A]/60' : 'bg-slate-50 border-slate-200/60'}`}>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B9DFF] font-semibold block mb-1">
              TODAY'S MISSION
            </span>
            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              Q3 Scheduled SLA Maintenance & DI Water Cooling Filter Replacement. Swap filter cartridge and execute 8-Point MHC prior to 14:00 UTC wafer annealing release.
            </p>
          </div>
        </div>

        {/* Current Inspection Stage & Single Primary Action */}
        <div className={`lg:col-span-4 p-4 rounded-xl border flex flex-col justify-between space-y-4 ${
          isDark ? 'bg-[#1A1D21] border-[#2B323A]/60' : 'bg-slate-50 border-slate-200/60'
        }`}>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              CURRENT STAGE
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#8B9DFF]">
              <span className="w-2 h-2 rounded-full bg-[#8B9DFF]" />
              Stage 3 of 5: Galvo Realignment
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Filter swap complete. Servo gain latency check active.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            className="w-full justify-between font-medium"
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

