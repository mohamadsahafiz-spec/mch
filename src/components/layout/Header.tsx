import React, { useState } from 'react';
import { Search, Bell, AlertTriangle, Plus, Sparkles, Moon, Sun, Monitor } from 'lucide-react';
import { NavigationTab, AlertItem } from '../../types';
import { Button } from '../common/Button';
import { useTheme } from '../../context/ThemeContext';
import { getThemeClasses } from '../../theme/tokens';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  alerts: AlertItem[];
  onOpenQuickMhc: () => void;
  nextPriorityAction: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  alerts,
  onOpenQuickMhc,
  nextPriorityAction
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const { theme, setTheme, effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const themeCls = getThemeClasses(isDark);

  const getTabTitle = (tab: NavigationTab) => {
    switch (tab) {
      case 'start_page': return 'Start Page & Dispatch Lobby';
      case 'mission_control': return 'Mission Control & Directives';
      case 'contracts': return 'Contract Management';
      case 'planner': return 'Execution Planner';
      case 'customers': return 'Customers & Plants';
      case 'machines': return 'Machine Passport';
      case 'mhc': return 'Health Check (MHC)';
      case 'laser_calibration': return 'Laser Calibration';
      case 'baseline_check': return 'Baseline Verification';
      case 'quality_investigation': return 'Quality Investigation';
      case 'reports': return 'Executive Reports';
      case 'analytics': return 'Operational Analytics';
      case 'knowledge_base': return 'Knowledge Base';
      case 'settings': return 'System Settings';
      default: return 'Field Operations System';
    }
  };

  const criticalAlertsCount = alerts.filter(a => a.severity === 'CRITICAL').length;

  return (
    <header className={`px-6 py-3 border-b sticky top-0 z-20 backdrop-blur-md transition-colors duration-250 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
      isDark 
        ? 'bg-[#111315]/90 border-[#2B323A]/80 text-[#F3F4F6]' 
        : 'bg-white/90 border-slate-200/80 text-slate-900 shadow-xs'
    }`}>
      {/* Title & Next Action Directive */}
      <div>
        <h1 className="text-base font-semibold tracking-tight flex items-center gap-2">
          {getTabTitle(activeTab)}
        </h1>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded border uppercase tracking-wider flex items-center gap-1 ${
            isDark 
              ? 'bg-[#8B9DFF]/15 text-[#8B9DFF] border-[#8B9DFF]/30' 
              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
          }`}>
            <Sparkles className="w-2.5 h-2.5 text-[#8B9DFF]" />
            DIRECTIVE
          </span>
          <p className="text-xs text-slate-400 font-normal truncate max-w-xl">
            {nextPriorityAction || "Execute scheduled Q3 MHC on TRUMPF TruMicro Fab 18A."}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Theme Selector Controls */}
        <div className={`p-1 rounded-lg border flex items-center gap-0.5 ${
          isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setTheme('dark')}
            title="Dark Theme"
            className={`p-1 rounded transition-all ${
              theme === 'dark' 
                ? 'bg-[#20252B] text-[#8B9DFF] shadow-xs' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTheme('light')}
            title="Light Theme"
            className={`p-1 rounded transition-all ${
              theme === 'light' 
                ? 'bg-white text-indigo-600 shadow-xs' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTheme('system')}
            title="System Theme"
            className={`p-1 rounded transition-all ${
              theme === 'system' 
                ? isDark ? 'bg-[#20252B] text-[#8B9DFF]' : 'bg-white text-indigo-600' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden lg:block w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Serial, Contract..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full text-xs rounded-lg pl-8 pr-3 py-1.5 border transition-all ${
              isDark 
                ? 'bg-[#1A1D21] text-slate-200 border-[#2B323A] placeholder-slate-500 focus:border-[#8B9DFF]' 
                : 'bg-slate-50 text-slate-900 border-slate-200 placeholder-slate-400 focus:border-indigo-500'
            }`}
          />
        </div>

        {/* Quick Action Button */}
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={onOpenQuickMhc}
        >
          New Health Check
        </Button>

        {/* Alerts Bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
            className={`p-1.5 rounded-lg border transition-colors relative ${
              isDark 
                ? 'bg-[#1A1D21] border-[#2B323A] text-slate-300 hover:text-slate-100 hover:bg-[#20252B]' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[9px] font-bold font-mono flex items-center justify-center text-white ${criticalAlertsCount > 0 ? 'bg-[#E98A8A]' : 'bg-[#EFCB7A]'}`}>
                {alerts.length}
              </span>
            )}
          </button>

          {/* Alerts Dropdown Panel */}
          {showAlertsDropdown && (
            <div className={`absolute right-0 mt-2 w-80 border rounded-xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 ${
              isDark ? 'bg-[#20252B] border-[#2B323A] text-slate-200' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-[#2B323A]/60 mb-2">
                <span className="text-xs font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#EFCB7A]" />
                  Active System Alerts ({alerts.length})
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Live Sync</span>
              </div>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {alerts.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No active system alerts.</p>
                ) : (
                  alerts.map((alt) => (
                    <div
                      key={alt.id}
                      className={`p-2 rounded-lg border text-xs ${
                        alt.severity === 'CRITICAL'
                          ? 'bg-[#E98A8A]/10 border-[#E98A8A]/30 text-[#E98A8A]'
                          : 'bg-[#EFCB7A]/10 border-[#EFCB7A]/30 text-[#EFCB7A]'
                      }`}
                    >
                      <div className="flex items-center justify-between font-medium mb-0.5">
                        <span className="truncate">{alt.machineName}</span>
                        <span className="text-[9px] font-mono opacity-80">{alt.timestamp}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed opacity-90">{alt.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

