import React, { useState } from 'react';
import { CheckCircle2, Clock, Wrench, Play, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { NavigationTab } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface InspectionStageStepperProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenQuickMhc: () => void;
}

export const InspectionStageStepper: React.FC<InspectionStageStepperProps> = ({
  onNavigate,
  onOpenQuickMhc
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const [activeStageId, setActiveStageId] = useState<number>(3);

  const stages = [
    {
      id: 1,
      title: 'ISO 4 Gowning & Safety Check',
      time: '08:10 AM',
      status: 'completed' as const,
      description: 'ESD wristband grounded, particulate count <10/m³, laser safety curtains verified.'
    },
    {
      id: 2,
      title: 'DI Filter Swap & De-aeration',
      time: '08:35 AM',
      status: 'completed' as const,
      description: 'Spent 0.2µm cartridge replaced. Chiller loop pressure re-established at 3.2 bar.'
    },
    {
      id: 3,
      title: 'Galvo Realignment & Beam Profiling',
      time: '08:50 AM (Active)',
      status: 'active' as const,
      description: 'Dual-axis galvo motor servo gain check & focal plane grid matrix mapping.'
    },
    {
      id: 4,
      title: '8-Point MHC Health Scan',
      time: 'Pending Stage 3',
      status: 'pending' as const,
      description: 'Automated laser power output, AGC circuit, and beam waist quality scoring.'
    },
    {
      id: 5,
      title: 'Executive Report & Customer Sign-off',
      time: 'Pending Stage 4',
      status: 'pending' as const,
      description: 'Generate PDF report and request TSMC Fab 18A manager digital signature.'
    }
  ];

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-200 space-y-6 ${
      isDark 
        ? 'bg-[#20252B] border-[#2B323A] text-[#F3F4F6]' 
        : 'bg-white border-slate-200 text-slate-900 shadow-xs'
    }`}>
      {/* Title & Sequential Stepper Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#2B323A]/60 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#8B9DFF] uppercase tracking-wider block mb-0.5">
            WORKFLOW SEQUENCE
          </span>
          <h3 className="text-base font-bold tracking-tight">Today's Sequential Inspection Stages</h3>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Progress: <span className="text-[#8B9DFF] font-bold">2 / 5 Completed</span>
        </div>
      </div>

      {/* Sequential Stepper Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {stages.map((stage) => {
          const isCompleted = stage.status === 'completed';
          const isActive = stage.status === 'active';

          return (
            <button
              key={stage.id}
              onClick={() => setActiveStageId(stage.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                isActive
                  ? isDark 
                    ? 'bg-[#1A1D21] border-[#8B9DFF] text-slate-100 shadow-sm ring-1 ring-[#8B9DFF]/40' 
                    : 'bg-indigo-50 border-indigo-500 text-indigo-950 ring-1 ring-indigo-300'
                  : isCompleted
                  ? isDark 
                    ? 'bg-[#1A1D21]/70 border-[#2B323A] text-slate-300 hover:border-[#8B9DFF]/50' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  : isDark 
                    ? 'bg-[#1A1D21]/40 border-[#2B323A]/60 text-slate-500 hover:border-slate-700' 
                    : 'bg-slate-50/50 border-slate-200/80 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isActive 
                    ? 'bg-[#8B9DFF] text-slate-950 font-extrabold' 
                    : isCompleted 
                    ? 'bg-[#7FD4A6]/20 text-[#7FD4A6] border border-[#7FD4A6]/30' 
                    : 'bg-[#2B323A]/60 text-slate-400'
                }`}>
                  STAGE {stage.id}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7FD4A6]" />
                ) : isActive ? (
                  <span className="w-2 h-2 rounded-full bg-[#8B9DFF] animate-ping" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                )}
              </div>
              <p className="text-xs font-semibold truncate leading-snug">{stage.title}</p>
              <p className="text-[10px] font-mono text-slate-400 mt-1">{stage.time}</p>
            </button>
          );
        })}
      </div>

      {/* Active Stage Focus Detail Panel */}
      <div className={`p-5 rounded-xl border space-y-4 ${
        isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2B323A]/60">
          <div>
            <span className="text-[10px] font-mono text-[#8B9DFF] font-bold uppercase block mb-0.5">ACTIVE STAGE DETAIL</span>
            <h4 className="text-sm font-bold">
              Stage 3: Galvo Scanner Realignment & Beam Profiling
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Wrench className="w-3.5 h-3.5" />}
              onClick={() => onNavigate('laser_calibration')}
            >
              Calibration Studio
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Play className="w-3.5 h-3.5 fill-current" />}
              onClick={onOpenQuickMhc}
            >
              Proceed to Stage 4 MHC
            </Button>
          </div>
        </div>

        {/* Contextual AI Workflow Advisory */}
        <div className={`p-4 rounded-xl border space-y-2 ${
          isDark 
            ? 'bg-[#8B9DFF]/10 border-[#8B9DFF]/30 text-slate-200' 
            : 'bg-indigo-50/80 border-indigo-200 text-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#8B9DFF]">
              <Sparkles className="w-3.5 h-3.5" />
              CONTEXTUAL AI WORKFLOW ADVISORY (GEMINI AI)
            </span>
            <span className="text-[10px] font-mono opacity-80">98.4% Model Precision</span>
          </div>
          <p className="text-xs leading-relaxed font-sans opacity-95">
            "Galvo X-Axis step response latency changed by <strong className="text-[#EFCB7A]">2.1 microseconds</strong> following DI filter replacement. Recommended action: Trim X-galvo motor servo gain pot until step response latency drops below 12µs before starting Stage 4 Automated MHC Scan."
          </p>
        </div>

        {/* Stage 3 Sub-tasks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
          <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#20252B] border-[#2B323A]' : 'bg-white border-slate-200'}`}>
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Step 3.1: Alignment Target</span>
            <p className="font-semibold">Mount 9-point quartz target grid onto galvo focal plane</p>
            <span className="text-[10px] font-mono text-[#7FD4A6] flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" /> VERIFIED
            </span>
          </div>

          <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#20252B] border-[#8B9DFF]/60' : 'bg-indigo-50 border-indigo-200'}`}>
            <span className="text-[10px] font-mono text-[#8B9DFF] uppercase font-bold block mb-1">Step 3.2: Gain Realignment</span>
            <p className="font-semibold">Adjust X/Y galvo servo gain & trim latency &lt;12µs</p>
            <span className="text-[10px] font-mono text-[#EFCB7A] flex items-center gap-1 mt-1 font-semibold">
              • IN PROGRESS (AI Advisory Active)
            </span>
          </div>

          <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#20252B] border-[#2B323A]' : 'bg-white border-slate-200'}`}>
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Step 3.3: Field Matrix Upload</span>
            <p className="font-semibold text-slate-400">Execute 81-point grid scan & upload 2D matrix</p>
            <span className="text-[10px] font-mono text-slate-500 block mt-1">
              PENDING STEP 3.2
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
