import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  CalendarDays, 
  Building2, 
  Cpu, 
  Activity, 
  Zap, 
  SlidersHorizontal, 
  AlertOctagon, 
  FileBarChart, 
  LineChart, 
  BookOpen, 
  Settings, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  urgentAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  urgentAlertsCount
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'mission_control', label: 'Mission Control', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'contracts', label: 'Contracts', icon: <FileText className="w-4 h-4" /> },
    { id: 'planner', label: 'Execution Planner', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers & Plants', icon: <Building2 className="w-4 h-4" /> },
    { id: 'machines', label: 'Machine Passport', icon: <Cpu className="w-4 h-4" /> },
    { id: 'mhc', label: 'Health Check (MHC)', icon: <Activity className="w-4 h-4" /> },
    { id: 'laser_calibration', label: 'Laser Calibration', icon: <Zap className="w-4 h-4" /> },
    { id: 'baseline_check', label: 'Baseline Checks', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: 'quality_investigation', label: 'Quality Investigation', icon: <AlertOctagon className="w-4 h-4" />, badge: urgentAlertsCount },
    { id: 'reports', label: 'Executive Reports', icon: <FileBarChart className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <LineChart className="w-4 h-4" /> },
    { id: 'knowledge_base', label: 'Knowledge Base', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <aside className={`w-64 border-r flex flex-col h-screen sticky top-0 shrink-0 select-none z-30 transition-colors duration-200 ${
      isDark 
        ? 'bg-[#111315] border-[#2B323A] text-slate-200' 
        : 'bg-white border-slate-200 text-slate-900 shadow-xs'
    }`}>
      {/* Brand Header */}
      <div className={`p-4 border-b ${isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#8B9DFF] flex items-center justify-center text-slate-950 font-bold shadow-xs">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight">FIELD OPS</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                isDark ? 'bg-[#8B9DFF]/10 text-[#8B9DFF] border-[#8B9DFF]/30' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                v0.2.5
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Laser & Precision Eng</p>
          </div>
        </div>
      </div>

      {/* Engineer Status Pill */}
      <div className={`px-3 py-2 border-b ${isDark ? 'border-[#2B323A]/60' : 'border-slate-200'}`}>
        <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border ${
          isDark ? 'bg-[#20252B] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-[#7FD4A6] animate-pulse shrink-0" />
            <div className="truncate">
              <p className="text-xs font-semibold truncate">Alex Mercer</p>
              <p className="text-[10px] text-slate-400 truncate">Lead Field Engineer</p>
            </div>
          </div>
          <ShieldCheck className="w-4 h-4 text-[#8B9DFF] shrink-0" />
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 group ${
                isActive
                  ? isDark
                    ? 'bg-[#8B9DFF]/15 text-[#8B9DFF] border border-[#8B9DFF]/30 shadow-xs font-semibold'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-[#1A1D21]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? (isDark ? 'text-[#8B9DFF]' : 'text-indigo-600') : 'text-slate-400 group-hover:text-slate-200'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge && item.badge > 0 ? (
                  <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-full bg-[#E98A8A]/20 text-[#E98A8A] border border-[#E98A8A]/40">
                    {item.badge}
                  </span>
                ) : null}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#8B9DFF]" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer System Indicator */}
      <div className={`p-3 border-t text-[11px] text-slate-400 font-mono flex items-center justify-between ${
        isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7FD4A6]" />
          <span>FSO Engine Online</span>
        </div>
        <span className="text-slate-500">v0.2.5</span>
      </div>
    </aside>
  );
};
