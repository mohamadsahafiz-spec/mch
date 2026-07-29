import React, { useState } from 'react';
import { CheckCircle2, Clock, Bot, ArrowRight, Zap, Wrench, ShieldCheck, Play, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { NavigationTab } from '../../types';

interface InspectionStageStepperProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenQuickMhc: () => void;
}

export const InspectionStageStepper: React.FC<InspectionStageStepperProps> = ({
  onNavigate,
  onOpenQuickMhc
}) => {
  const [activeStageId, setActiveStageId] = useState<number>(3);

  const stages = [
    {
      id: 1,
      title: 'ISO 4 Cleanroom Gowning & Safety Check',
      time: '08:10 AM',
      status: 'completed' as const,
      description: 'ESD wristband grounded, particulate count <10/m³, laser safety curtains verified.'
    },
    {
      id: 2,
      title: 'DI Water Filter Swap & De-aeration',
      time: '08:35 AM',
      status: 'completed' as const,
      description: 'Spent 0.2µm cartridge replaced. Chiller loop pressure re-established at 3.2 bar.'
    },
    {
      id: 3,
      title: 'Galvo Scanner Realignment & Beam Profiling',
      time: '08:50 AM (Active)',
      status: 'active' as const,
      description: 'Dual-axis galvo motor servo gain check & focal plane grid matrix mapping.'
    },
    {
      id: 4,
      title: '8-Point Machine Health Check (MHC) Scan',
      time: 'Pending Stage 3',
      status: 'pending' as const,
      description: 'Automated laser power output, AGC circuit, and beam waist quality scoring.'
    },
    {
      id: 5,
      title: 'Executive Report & Customer Digital Sign-off',
      time: 'Pending Stage 4',
      status: 'pending' as const,
      description: 'Generate PDF report and request TSMC Fab 18A manager digital signature.'
    }
  ];

  return (
    <div className="p-6 rounded-2xl bg-[#0e172a] border border-slate-800 space-y-6">
      {/* Title & Sequential Stepper Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">
            WORKFLOW SEQUENCE
          </span>
          <h3 className="text-base font-bold text-slate-100">Today's Sequential Inspection & Maintenance Stages</h3>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Progress: <span className="text-blue-400 font-bold">2 / 5 Stages Completed</span>
        </div>
      </div>

      {/* Sequential Stepper Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {stages.map((stage) => {
          const isCompleted = stage.status === 'completed';
          const isActive = stage.status === 'active';

          return (
            <button
              key={stage.id}
              onClick={() => setActiveStageId(stage.id)}
              className={`p-3 rounded-xl border text-left transition-all relative ${
                isActive
                  ? 'bg-blue-950/60 border-blue-500 text-slate-100 shadow-md ring-1 ring-blue-500/50'
                  : isCompleted
                  ? 'bg-[#090f1d] border-slate-800 text-slate-300 hover:bg-slate-800/40'
                  : 'bg-[#090f1d]/50 border-slate-800/60 text-slate-500 hover:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-blue-500 text-white' : isCompleted ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' : 'bg-slate-800 text-slate-400'
                }`}>
                  STAGE {stage.id}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isActive ? (
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>
              <p className="text-xs font-semibold truncate leading-snug">{stage.title}</p>
              <p className="text-[10px] font-mono text-slate-500 mt-1">{stage.time}</p>
            </button>
          );
        })}
      </div>

      {/* Active Stage Focus Detail Panel */}
      <div className="p-5 rounded-xl bg-[#090f1d] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-950 border border-blue-800 text-blue-400">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">ACTIVE STAGE DETAIL</span>
              <h4 className="text-sm font-bold text-slate-100">
                Stage 3: Galvo Scanner Realignment & Beam Profiling
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Wrench className="w-3.5 h-3.5" />}
              onClick={() => onNavigate('laser_calibration')}
            >
              Open Calibration Studio
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Play className="w-3.5 h-3.5 fill-white" />}
              onClick={onOpenQuickMhc}
            >
              Proceed to Stage 4 MHC
            </Button>
          </div>
        </div>

        {/* Embedded Contextual AI Insight (Workflow Location, not floating box) */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-blue-950/30 to-[#090f1d] border border-indigo-800/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              CONTEXTUAL AI WORKFLOW ADVISORY (GEMINI AI ENGINE)
            </span>
            <span className="text-[10px] font-mono text-indigo-400">98.4% Precision Model</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            "Galvo X-Axis step response latency jumped by <strong className="text-amber-300">2.1 microseconds</strong> following the DI filter swap. Recommended action: Trim X-galvo motor servo gain pot until step response latency drops below 12µs before launching Stage 4 Automated MHC Scan."
          </p>
        </div>

        {/* Stage 3 Sub-tasks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 rounded-lg bg-[#0e172a] border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Step 3.1: Alignment Target</span>
            <p className="font-semibold text-slate-200">Mount 9-point quartz target grid onto galvo focal plane</p>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> VERIFIED
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#0e172a] border border-blue-900/60 space-y-1">
            <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">Step 3.2: Gain Realignment</span>
            <p className="font-semibold text-slate-100">Adjust X/Y galvo servo gain & trim latency &lt;12µs</p>
            <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
              • IN PROGRESS (AI Advisory Active)
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#0e172a] border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Step 3.3: Field Matrix Upload</span>
            <p className="font-semibold text-slate-400">Execute 81-point grid scan & upload 2D matrix</p>
            <span className="text-[10px] font-mono text-slate-500">
              PENDING STEP 3.2
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
