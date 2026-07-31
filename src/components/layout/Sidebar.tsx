import React, { useState, useEffect } from 'react';
import { 
  Compass,
  BookOpenCheck,
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
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  urgentAlertsCount: number;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavGroup {
  key: string;
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  urgentAlertsCount
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const navGroups: NavGroup[] = [
    {
      key: 'daily_work',
      title: 'DAILY WORK',
      items: [
        { id: 'start_page', label: 'Start Page', icon: <Compass className="w-4 h-4" /> },
        { id: 'mission_control', label: 'Mission Control', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'workflow_guide', label: 'Workflow Guide (SOP)', icon: <BookOpenCheck className="w-4 h-4" /> },
      ]
    },
    {
      key: 'service_execution',
      title: 'SERVICE EXECUTION',
      items: [
        { id: 'machines', label: 'Machine Passport', icon: <Cpu className="w-4 h-4" /> },
        { id: 'mhc', label: 'Health Check (MHC)', icon: <Activity className="w-4 h-4" /> },
        { id: 'laser_calibration', label: 'Laser Calibration', icon: <Zap className="w-4 h-4" /> },
        { id: 'baseline_check', label: 'Baseline Checks', icon: <SlidersHorizontal className="w-4 h-4" /> },
        { id: 'quality_investigation', label: 'Quality Investigation', icon: <AlertOctagon className="w-4 h-4" />, badge: urgentAlertsCount },
        { id: 'planner', label: 'Execution Planner', icon: <CalendarDays className="w-4 h-4" /> },
        { id: 'reports', label: 'Executive Reports', icon: <FileBarChart className="w-4 h-4" /> },
      ]
    },
    {
      key: 'operations',
      title: 'OPERATIONS',
      items: [
        { id: 'customers', label: 'Customers & Plants', icon: <Building2 className="w-4 h-4" /> },
        { id: 'contracts', label: 'Contracts', icon: <FileText className="w-4 h-4" /> },
        { id: 'analytics', label: 'Analytics', icon: <LineChart className="w-4 h-4" /> },
      ]
    },
    {
      key: 'smart_tools',
      title: 'SMART TOOLS',
      items: [
        { id: 'knowledge_base', label: 'Knowledge Base', icon: <BookOpen className="w-4 h-4" /> },
      ]
    },
    {
      key: 'system',
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
      ]
    }
  ];

  // Collapsible Groups State — Only group containing activeTab is expanded by default
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const activeGroup = navGroups.find(g => g.items.some(i => i.id === activeTab));
    const initialState: Record<string, boolean> = {
      daily_work: false,
      service_execution: false,
      operations: false,
      smart_tools: false,
      system: false
    };
    if (activeGroup) {
      initialState[activeGroup.key] = true;
    } else {
      initialState.daily_work = true;
    }
    return initialState;
  });

  // Automatically expand group whenever activeTab changes
  useEffect(() => {
    const activeGroup = navGroups.find(g => g.items.some(i => i.id === activeTab));
    if (activeGroup) {
      setOpenGroups(prev => ({
        ...prev,
        [activeGroup.key]: true
      }));
    }
  }, [activeTab]);

  const toggleGroup = (groupKey: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  return (
    <aside className={`w-60 border-r flex flex-col h-screen sticky top-0 shrink-0 select-none z-30 transition-colors duration-250 ${
      isDark 
        ? 'bg-[#111315] border-[#2B323A]/80 text-slate-300' 
        : 'bg-white border-slate-300/80 text-slate-900 shadow-xs'
    }`}>
      {/* Brand Header */}
      <div className={`p-3.5 border-b ${isDark ? 'bg-[#111315] border-[#2B323A]/60' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
            isDark ? 'bg-[#8B9DFF]/20 text-[#8B9DFF] border border-[#8B9DFF]/30' : 'bg-indigo-600 text-white shadow-xs'
          }`}>
            <Zap className="w-3.5 h-3.5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold tracking-tight ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>FIELD OPS</span>
              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold ${
                isDark ? 'bg-[#8B9DFF]/10 text-[#8B9DFF] border-[#8B9DFF]/30' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                v0.5.2
              </span>
            </div>
            <p className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Precision Laser Eng</p>
          </div>
        </div>
      </div>

      {/* Engineer Status Pill */}
      <div className={`px-3 py-2 border-b ${isDark ? 'border-[#2B323A]/40' : 'border-slate-100'}`}>
        <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs ${
          isDark ? 'bg-[#1A1D21]/60 border-[#2B323A]/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}>
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <div className="truncate">
              <p className="text-[11px] font-semibold truncate">Alex Mercer</p>
              <p className={`text-[9px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500 font-medium'}`}>Lead Engineer</p>
            </div>
          </div>
          <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#8B9DFF]' : 'text-indigo-600'}`} />
        </div>
      </div>

      {/* Grouped Workflow Nav List */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-3">
        {navGroups.map((group) => {
          const isOpen = !!openGroups[group.key];
          const hasActiveChild = group.items.some(i => i.id === activeTab);
          const groupBadgeCount = group.items.reduce((sum, item) => sum + (item.badge || 0), 0);

          return (
            <div key={group.key} className="space-y-1">
              {/* Group Header Button */}
              <button
                onClick={() => toggleGroup(group.key)}
                className={`w-full flex items-center justify-between px-2 py-1 rounded text-[10px] font-mono font-bold tracking-wider uppercase transition-colors ${
                  hasActiveChild
                    ? isDark ? 'text-[#8B9DFF]' : 'text-indigo-700 font-bold'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900 font-bold'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {isOpen ? (
                    <ChevronDown className="w-3 h-3 opacity-70" />
                  ) : (
                    <ChevronRight className="w-3 h-3 opacity-70" />
                  )}
                  <span>{group.title}</span>
                </div>

                {!isOpen && groupBadgeCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-full bg-[#E98A8A]/20 text-[#E98A8A] border border-[#E98A8A]/40">
                    {groupBadgeCount}
                  </span>
                )}
              </button>

              {/* Group Items Container */}
              {isOpen && (
                <div className="space-y-0.5 pl-2 border-l border-slate-200 dark:border-[#2B323A]/50 ml-2 animate-in fade-in duration-150">
                  {group.items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 group ${
                          isActive
                            ? isDark
                              ? 'bg-[#8B9DFF]/15 text-[#8B9DFF] font-medium border border-[#8B9DFF]/30'
                              : 'bg-indigo-50 text-indigo-800 font-semibold border border-indigo-200/90 shadow-2xs'
                            : isDark
                            ? 'text-slate-400 hover:text-slate-200 hover:bg-[#1A1D21]/60'
                            : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`shrink-0 ${isActive ? (isDark ? 'text-[#8B9DFF]' : 'text-indigo-700') : 'text-slate-400 opacity-80 group-hover:opacity-100'}`}>
                            {item.icon}
                          </span>
                          <span className="truncate text-left">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          {item.badge && item.badge > 0 ? (
                            <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                              {item.badge}
                            </span>
                          ) : null}
                          {isActive && <ChevronRight className={`w-3 h-3 ${isDark ? 'text-[#8B9DFF]' : 'text-indigo-700'}`} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer System Indicator */}
      <div className={`p-2.5 border-t text-[10px] font-mono flex items-center justify-between ${
        isDark ? 'bg-[#111315] border-[#2B323A]/60 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>FSO Engine Online</span>
        </div>
        <span className="font-semibold">v0.5.2</span>
      </div>
    </aside>
  );
};
