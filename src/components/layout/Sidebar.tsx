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
    <aside className="w-64 bg-[#090d16] border-r border-slate-800/80 flex flex-col h-screen sticky top-0 shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 bg-[#0c1322]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/20 border border-blue-400/30">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-100 tracking-tight">FIELD OPS</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-950/80 text-blue-400 border border-blue-800/50">v0.2.1</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Laser & Precision Eng</p>
          </div>
        </div>
      </div>

      {/* Engineer Status Pill */}
      <div className="px-3 py-2 border-b border-slate-800/60 bg-[#0c1322]/60">
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#0e172a] border border-slate-800">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">Alex Mercer</p>
              <p className="text-[10px] text-slate-400 truncate">Lead Field Engineer</p>
            </div>
          </div>
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
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
                  ? 'bg-blue-600/15 text-blue-300 border border-blue-500/30 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0e172a]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge && item.badge > 0 ? (
                  <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {item.badge}
                  </span>
                ) : null}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer System Indicator */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0a0f1d] text-[11px] text-slate-500 font-mono flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span>FSO Engine Online</span>
        </div>
        <span className="text-slate-600">v0.2.1</span>
      </div>
    </aside>
  );
};
