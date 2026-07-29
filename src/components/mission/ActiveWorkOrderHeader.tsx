import React from 'react';
import { Building2, Cpu, Calendar, ShieldCheck, Zap, ArrowRight, FileText, CheckCircle2, AlertTriangle, Play } from 'lucide-react';
import { Button } from '../common/Button';
import { NavigationTab } from '../../types';

interface ActiveWorkOrderHeaderProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenQuickMhc: () => void;
}

export const ActiveWorkOrderHeader: React.FC<ActiveWorkOrderHeaderProps> = ({
  onNavigate,
  onOpenQuickMhc
}) => {
  return (
    <div className="p-6 md:p-8 rounded-2xl bg-[#0e172a] border border-slate-800 shadow-xl relative overflow-hidden space-y-6">
      {/* Top Work Order Metadata Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-blue-950/80 text-blue-400 border border-blue-800/60 uppercase tracking-wider">
            WORK ORDER #WO-20260729-TSMC
          </span>
          <span className="text-xs font-mono text-slate-400">Scheduled: Today 08:00 AM UTC</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400 font-semibold">SLA: Tier 1 (99.8% Uptime Target)</span>
        </div>
      </div>

      {/* Main Work Order Header Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Customer & Machine Overview (Questions 1, 2, 3) */}
        <div className="lg:col-span-8 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>TSMC — Taiwan Semiconductor Manufacturing Co.</span>
              <span className="text-slate-600">•</span>
              <span>Fab 18A Cleanroom (Bay 4)</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
              TRUMPF TruMicro 7000 Series (MCH-TSMC-01)
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-1">
              SN: TRU-7070-8841 • Dual 1030nm Femtosecond Laser Source
            </p>
          </div>

          {/* Why Am I Here */}
          <div className="p-4 rounded-xl bg-[#090f1d] border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">
              OPERATIONAL PURPOSE & SLA MANDATE
            </span>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans">
              Q3 Scheduled SLA Maintenance & DI Water Cooling Filter Swap. Filter capacity is at <strong className="text-amber-400">18%</strong> (0.8 LPM flow delta drop). Complete filter swap and perform 8-Point Machine Health Check prior to wafer annealing batch release at 14:00 UTC.
            </p>
          </div>
        </div>

        {/* Current Stage & Direct Action (Questions 4, 5) */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-[#090f1d] border border-blue-900/40 space-y-4 flex flex-col justify-between h-full">
          <div>
            <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider block mb-1">
              CURRENT INSPECTION STAGE
            </span>
            <p className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
              Stage 3 of 5: Galvo Scanner Realignment
            </p>
            <p className="text-xs text-slate-400 mt-1">
              DI Filter swap completed. Galvo motor gain latency check in progress.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <Button
              variant="primary"
              size="md"
              className="w-full justify-between font-bold"
              icon={<Play className="w-4 h-4 fill-white" />}
              onClick={onOpenQuickMhc}
            >
              <span>Execute Stage 3 Check</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-center"
              icon={<FileText className="w-3.5 h-3.5" />}
              onClick={() => onNavigate('mhc')}
            >
              Open Full Inspection Worksheet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
