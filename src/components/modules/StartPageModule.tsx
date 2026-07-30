import React, { useState } from 'react';
import { 
  Play, 
  Calendar, 
  PlusCircle, 
  Search, 
  FileBarChart2, 
  Sparkles, 
  ArrowRight,
  Send,
  Sliders
} from 'lucide-react';
import { NavigationTab, Machine, ExecutionScheduleItem, FieldEngineerTask } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../common/Button';

interface StartPageModuleProps {
  onNavigate: (tab: NavigationTab) => void;
  schedule?: ExecutionScheduleItem[];
  machines?: Machine[];
  tasks?: FieldEngineerTask[];
  onSelectMachine?: (id: string) => void;
}

export const StartPageModule: React.FC<StartPageModuleProps> = ({
  onNavigate
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  // State for optional toggle to test "No Mission Scheduled" empty state for demonstration
  const [hasTodayMission, setHasTodayMission] = useState<boolean>(true);
  const [aiPrompt, setAiPrompt] = useState<string>('');

  // Get current formatted date
  const todayDateString = 'Thursday, 30 July 2026';

  return (
    <div className="max-w-4xl mx-auto py-2 md:py-6 space-y-10 animate-in fade-in duration-300">
      
      {/* 1. Simplified Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Good Morning, Alex
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-1 font-normal">
            Ready to start your work?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-mono">
            {todayDateString}
          </span>
          {/* Subtle simulation toggle for testing 'No Mission' state */}
          <button
            onClick={() => setHasTodayMission(!hasTodayMission)}
            title="Toggle mission state for testing"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-[#2B323A] text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Visual Hero Focus: ▶ Start Today's Mission */}
      <div className={`p-8 md:p-12 rounded-3xl border transition-all relative overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-b from-[#252B33] to-[#1C2026] border-[#8B9DFF]/40 text-[#F3F4F6] shadow-xl ring-1 ring-[#8B9DFF]/20' 
          : 'bg-gradient-to-b from-indigo-50/90 via-white to-white border-indigo-200 text-slate-900 shadow-md'
      }`}>
        {hasTodayMission ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-mono font-semibold tracking-wider text-[#8B9DFF] uppercase block">
                Today's Action
              </span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Today's mission is ready.
              </h2>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={<Play className="w-6 h-6 fill-current" />}
              onClick={() => onNavigate('mission_control')}
              className="shrink-0 text-base font-bold px-8 py-4 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Start Today's Mission
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-xl">
              <span className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase block">
                Schedule Clear
              </span>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                No missions scheduled for today.
              </h2>
            </div>
            <Button
              variant="secondary"
              size="lg"
              icon={<Calendar className="w-5 h-5" />}
              onClick={() => onNavigate('planner')}
              className="shrink-0 font-medium px-6 py-3"
            >
              Plan Future Work
            </Button>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200 dark:border-[#2B323A]/60" />

      {/* 3. Secondary Actions (Short, concise descriptions) */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold px-1">
          Other Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Plan This Week */}
          <div 
            onClick={() => onNavigate('planner')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between ${
              isDark 
                ? 'bg-[#20252B] border-[#2B323A]/80 hover:border-[#8B9DFF]/50 hover:bg-[#252B33]' 
                : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isDark ? 'bg-[#8B9DFF]/15 text-[#8B9DFF]' : 'bg-indigo-50 text-indigo-600'
              }`}>
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#8B9DFF] transition-colors">
                  Plan This Week
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Plan future work.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#8B9DFF] group-hover:translate-x-1 transition-all" />
          </div>

          {/* Card 2: Register Machine */}
          <div 
            onClick={() => onNavigate('machines')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between ${
              isDark 
                ? 'bg-[#20252B] border-[#2B323A]/80 hover:border-[#7FD4A6]/50 hover:bg-[#252B33]' 
                : 'bg-white border-slate-200/80 hover:border-emerald-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isDark ? 'bg-[#7FD4A6]/15 text-[#7FD4A6]' : 'bg-emerald-50 text-emerald-600'
              }`}>
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#7FD4A6] transition-colors">
                  Register Machine
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Register a new machine.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#7FD4A6] group-hover:translate-x-1 transition-all" />
          </div>

          {/* Card 3: Open Machine Passport */}
          <div 
            onClick={() => onNavigate('machines')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between ${
              isDark 
                ? 'bg-[#20252B] border-[#2B323A]/80 hover:border-[#8ECDF7]/50 hover:bg-[#252B33]' 
                : 'bg-white border-slate-200/80 hover:border-sky-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isDark ? 'bg-[#8ECDF7]/15 text-[#8ECDF7]' : 'bg-sky-50 text-sky-600'
              }`}>
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#8ECDF7] transition-colors">
                  Open Machine Passport
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Open existing machines.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#8ECDF7] group-hover:translate-x-1 transition-all" />
          </div>

          {/* Card 4: Reports */}
          <div 
            onClick={() => onNavigate('reports')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between ${
              isDark 
                ? 'bg-[#20252B] border-[#2B323A]/80 hover:border-[#EFCB7A]/50 hover:bg-[#252B33]' 
                : 'bg-white border-slate-200/80 hover:border-amber-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isDark ? 'bg-[#EFCB7A]/15 text-[#EFCB7A]' : 'bg-amber-50 text-amber-600'
              }`}>
                <FileBarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#EFCB7A] transition-colors">
                  Reports
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  View reports and analytics.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#EFCB7A] group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>

      {/* 4. AI Copilot Placeholder (Minimal) */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDark 
          ? 'bg-[#1A1D21] border-[#2B323A]/80 text-[#F3F4F6]' 
          : 'bg-slate-50 border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#8B9DFF]" />
          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Need help planning today?
          </h4>
        </div>
        <div className="relative">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Ask AI..."
            className={`w-full text-xs rounded-xl pl-3.5 pr-10 py-2 border transition-all ${
              isDark 
                ? 'bg-[#20252B] text-slate-200 border-[#2B323A] placeholder-slate-500 focus:border-[#8B9DFF]' 
                : 'bg-white text-slate-900 border-slate-200 placeholder-slate-400 focus:border-indigo-500'
            }`}
          />
          <button
            onClick={() => {
              if (aiPrompt.trim()) {
                onNavigate('mission_control');
              }
            }}
            className="absolute right-2 top-1.5 p-1 rounded-lg text-[#8B9DFF] hover:bg-[#8B9DFF]/20 transition-colors"
            title="Ask AI"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
