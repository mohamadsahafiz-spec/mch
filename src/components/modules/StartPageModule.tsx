import React, { useState } from 'react';
import { 
  Play, 
  Calendar, 
  PlusCircle, 
  Search, 
  FileBarChart2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Cpu, 
  Building2, 
  ArrowRight,
  Send,
  Sliders
} from 'lucide-react';
import { NavigationTab, Machine, ExecutionScheduleItem, FieldEngineerTask } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { getThemeClasses } from '../../theme/tokens';
import { Button } from '../common/Button';

interface StartPageModuleProps {
  onNavigate: (tab: NavigationTab) => void;
  schedule?: ExecutionScheduleItem[];
  machines?: Machine[];
  tasks?: FieldEngineerTask[];
  onSelectMachine?: (id: string) => void;
}

export const StartPageModule: React.FC<StartPageModuleProps> = ({
  onNavigate,
  schedule = [],
  machines = [],
  tasks = [],
  onSelectMachine
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const themeCls = getThemeClasses(isDark);

  // State for optional toggle to test "No Mission Scheduled" empty state for demonstration
  const [hasTodayMission, setHasTodayMission] = useState<boolean>(true);
  const [aiPrompt, setAiPrompt] = useState<string>('');

  // Get current formatted date
  const todayDateString = 'Thursday, 30 July 2026';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Greeting & Welcome Section */}
      <div className={`p-6 md:p-8 rounded-2xl border transition-all duration-250 ${
        isDark 
          ? 'bg-[#1A1D21] border-[#2B323A]/80 text-[#F3F4F6]' 
          : 'bg-white border-slate-200/80 text-slate-900 shadow-xs'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${
                isDark 
                  ? 'bg-[#8B9DFF]/15 text-[#8B9DFF] border-[#8B9DFF]/30' 
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                FIELD OPERATIONS SYSTEM • DISPATCH LOBBY
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                v0.2.7 (Arrival Experience)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Good Morning, Alex
            </h1>
            <p className="text-sm text-slate-400 mt-1 font-normal">
              Ready to start your work? Below is your operational overview for today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-4 py-2.5 rounded-xl border text-right font-mono ${
              isDark ? 'bg-[#20252B] border-[#2B323A]/60' : 'bg-slate-50 border-slate-200/60'
            }`}>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">CURRENT DATE</div>
              <div className="text-xs font-semibold text-[#8B9DFF]">{todayDateString}</div>
            </div>

            {/* Quick Demo Toggle for No Mission State */}
            <button
              onClick={() => setHasTodayMission(!hasTodayMission)}
              title="Toggle Today's Mission state for demo evaluation"
              className={`p-2 rounded-xl border text-xs font-mono transition-colors flex items-center gap-1.5 ${
                isDark 
                  ? 'bg-[#20252B] border-[#2B323A] text-slate-400 hover:text-slate-200' 
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{hasTodayMission ? 'Simulate No Mission' : 'Restore Today Mission'}</span>
            </button>
          </div>
        </div>

        {/* 2. Today's Summary (3 minimal summary items) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#2B323A]/40">
          <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${
            isDark ? 'bg-[#20252B] border-[#2B323A]/60' : 'bg-slate-50 border-slate-200/60'
          }`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              isDark ? 'bg-[#7FD4A6]/15 text-[#7FD4A6]' : 'bg-emerald-100 text-emerald-700'
            }`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100">
                {hasTodayMission ? '2 Planned Missions' : '0 Planned Missions'}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {hasTodayMission ? 'TSMC Fab 18A & ASML Line' : 'Schedule clear for today'}
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${
            isDark ? 'bg-[#20252B] border-[#2B323A]/60' : 'bg-slate-50 border-slate-200/60'
          }`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              isDark ? 'bg-[#EFCB7A]/15 text-[#EFCB7A]' : 'bg-amber-100 text-amber-700'
            }`}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100">
                1 Pending Machine Registration
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Applied Materials Endura 5500
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${
            isDark ? 'bg-[#20252B] border-[#2B323A]/60' : 'bg-slate-50 border-slate-200/60'
          }`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              isDark ? 'bg-[#8ECDF7]/15 text-[#8ECDF7]' : 'bg-sky-100 text-sky-700'
            }`}>
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100">
                5 Active Machine Passports
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                TRUMPF, Coherent, IPG, Cymer
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight">What would you like to do today?</h2>
        <p className="text-xs text-slate-400 mt-0.5">Select a directive below to enter your workspace.</p>
      </div>

      {/* 3. Primary Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: ▶ Start Today's Mission (Featured / Primary Priority) */}
        <div className={`md:col-span-2 p-6 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
          isDark 
            ? 'bg-[#20252B] border-[#8B9DFF]/40 text-[#F3F4F6] ring-1 ring-[#8B9DFF]/20 shadow-md' 
            : 'bg-gradient-to-r from-indigo-50/90 via-white to-white border-indigo-200 text-slate-900 shadow-sm'
        }`}>
          {/* Subtle Top Accent Badge */}
          <div className="flex items-center justify-between pb-4 border-b border-[#2B323A]/50">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${hasTodayMission ? 'bg-[#8B9DFF] animate-pulse' : 'bg-slate-400'}`} />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B9DFF]">
                1. PRIMARY DIRECTIVE
              </span>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
              hasTodayMission 
                ? 'bg-[#7FD4A6]/15 text-[#7FD4A6] border-[#7FD4A6]/30 font-semibold' 
                : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
            }`}>
              {hasTodayMission ? 'HIGH PRIORITY' : 'SCHEDULE CLEAR'}
            </span>
          </div>

          {hasTodayMission ? (
            /* Active Scheduled Mission Content */
            <div className="pt-5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
                    ▶ Start Today's Mission
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Resume today's scheduled work order and execute on-site machine diagnostics.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Play className="w-5 h-5 fill-current" />}
                  onClick={() => onNavigate('mission_control')}
                  className="shrink-0 font-bold px-6 py-3 shadow-md"
                >
                  Start Today's Mission
                </Button>
              </div>

              {/* Today's Scheduled Mission Card Summary Details */}
              <div className={`p-4 rounded-xl border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${
                isDark ? 'bg-[#1A1D21] border-[#2B323A]/80' : 'bg-white border-slate-200/80'
              }`}>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">CUSTOMER</span>
                  <p className="text-xs font-semibold text-[#8ECDF7] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    TSMC Fab 18A
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">TARGET MACHINE</span>
                  <p className="text-xs font-semibold text-[#8B9DFF] flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 shrink-0" />
                    TRUMPF TruMicro 7000
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">PLANNED ACTIVITY</span>
                  <p className="text-xs font-medium text-slate-200 truncate">
                    Q3 SLA Maintenance & DI Filter Swap
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">SCHEDULED TIME</span>
                  <p className="text-xs font-semibold text-[#7FD4A6] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    08:00 AM UTC (2.5h)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* No Mission Scheduled Empty State */
            <div className="pt-5 pb-2 text-center space-y-3">
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-semibold text-slate-200">
                  Looks like you don't have any planned work today.
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Your field schedule is clear. You can create a new mission or schedule upcoming machine calibrations in the Execution Planner.
                </p>
              </div>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  icon={<Calendar className="w-4 h-4" />}
                  onClick={() => onNavigate('planner')}
                >
                  Create Today's Mission
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: 📅 Plan This Week */}
        <div 
          onClick={() => onNavigate('planner')}
          className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between ${
            isDark 
              ? 'bg-[#20252B] border-[#2B323A]/80 hover:border-[#8B9DFF]/60 hover:bg-[#252B33]' 
              : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-[#8B9DFF]/15 text-[#8B9DFF]' : 'bg-indigo-50 text-indigo-600'
              }`}>
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-slate-400 group-hover:text-[#8B9DFF] flex items-center gap-1 transition-colors">
                2. OPTION
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
            <h3 className="text-base font-semibold tracking-tight text-slate-100 group-hover:text-[#8B9DFF] transition-colors">
              📅 Plan This Week
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Prepare upcoming inspections, schedule engineer dispatches, and manage machine service contracts across all customer plants.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#2B323A]/40 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>2-Year Planner Grid</span>
            <span className="text-[#8B9DFF] font-medium">Open Planner →</span>
          </div>
        </div>

        {/* Card 3: ➕ Register Machine */}
        <div 
          onClick={() => onNavigate('machines')}
          className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between ${
            isDark 
              ? 'bg-[#20252B] border-[#2B323A]/80 hover:border-[#7FD4A6]/60 hover:bg-[#252B33]' 
              : 'bg-white border-slate-200/80 hover:border-emerald-300 hover:shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-[#7FD4A6]/15 text-[#7FD4A6]' : 'bg-emerald-50 text-emerald-600'
              }`}>
                <PlusCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-slate-400 group-hover:text-[#7FD4A6] flex items-center gap-1 transition-colors">
                3. OPTION
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
            <h3 className="text-base font-semibold tracking-tight text-slate-100 group-hover:text-[#7FD4A6] transition-colors">
              ➕ Register Machine
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Create a new Machine Passport, register laser hardware specifications, and record serial numbers for new cleanroom deployments.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#2B323A]/40 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Passport Registry</span>
            <span className="text-[#7FD4A6] font-medium">New Passport →</span>
          </div>
        </div>

        {/* Card 4: 📂 Open Machine Passport */}
        <div 
          onClick={() => onNavigate('machines')}
          className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between ${
            isDark 
              ? 'bg-[#20252B] border-[#2B323A]/80 hover:border-[#8ECDF7]/60 hover:bg-[#252B33]' 
              : 'bg-white border-slate-200/80 hover:border-sky-300 hover:shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-[#8ECDF7]/15 text-[#8ECDF7]' : 'bg-sky-50 text-sky-600'
              }`}>
                <Search className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-slate-400 group-hover:text-[#8ECDF7] flex items-center gap-1 transition-colors">
                4. OPTION
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
            <h3 className="text-base font-semibold tracking-tight text-slate-100 group-hover:text-[#8ECDF7] transition-colors">
              📂 Open Machine Passport
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Search existing machine passports, inspect laser head remaining hours, galvo diagnostic histories, and baseline verification logs.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#2B323A]/40 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>5 Active Passports</span>
            <span className="text-[#8ECDF7] font-medium">Search Records →</span>
          </div>
        </div>

        {/* Card 5: 📈 Reports */}
        <div 
          onClick={() => onNavigate('reports')}
          className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between ${
            isDark 
              ? 'bg-[#20252B] border-[#2B323A]/80 hover:border-[#EFCB7A]/60 hover:bg-[#252B33]' 
              : 'bg-white border-slate-200/80 hover:border-amber-300 hover:shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-[#EFCB7A]/15 text-[#EFCB7A]' : 'bg-amber-50 text-amber-600'
              }`}>
                <FileBarChart2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-slate-400 group-hover:text-[#EFCB7A] flex items-center gap-1 transition-colors">
                5. OPTION
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
            <h3 className="text-base font-semibold tracking-tight text-slate-100 group-hover:text-[#EFCB7A] transition-colors">
              📈 Reports
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Access executive engineering PDF reports, baseline drift trend analytics, and SLA compliance audit histories.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#2B323A]/40 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>SLA & Audit Reports</span>
            <span className="text-[#EFCB7A] font-medium">View Reports →</span>
          </div>
        </div>
      </div>

      {/* 4. AI Planning Assistant Placeholder Section */}
      <div className={`p-5 rounded-2xl border transition-all duration-200 ${
        isDark 
          ? 'bg-[#1A1D21] border-[#8B9DFF]/30 text-[#F3F4F6]' 
          : 'bg-slate-50 border-indigo-200 text-slate-900'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8B9DFF]" />
            <h3 className="text-sm font-semibold tracking-tight">Need help planning today?</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#8B9DFF]/10 text-[#8B9DFF] border border-[#8B9DFF]/30 font-medium">
            GEMINI AI COPILOT (PREVIEW)
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-3">
          Ask AI to analyze your active customer SLAs, optimize transit routes between fab cleanrooms, or summarize technical manuals.
        </p>

        <div className="relative">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Ask AI to plan today's work (e.g. 'Optimize route for TSMC Fab 18A MHC and filter swap')..."
            className={`w-full text-xs rounded-xl pl-4 pr-10 py-2.5 border transition-all ${
              isDark 
                ? 'bg-[#20252B] text-slate-200 border-[#2B323A] placeholder-slate-500 focus:border-[#8B9DFF]' 
                : 'bg-white text-slate-900 border-slate-200 placeholder-slate-400 focus:border-indigo-500'
            }`}
          />
          <button
            onClick={() => {
              if (aiPrompt.trim()) {
                alert(`AI Assistant Prompt Received: "${aiPrompt}". Navigating to Mission Control.`);
                onNavigate('mission_control');
              }
            }}
            className="absolute right-2 top-2 p-1 rounded-lg text-[#8B9DFF] hover:bg-[#8B9DFF]/20 transition-colors"
            title="Ask AI"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
