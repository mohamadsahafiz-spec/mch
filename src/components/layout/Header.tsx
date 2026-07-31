import React, { useState } from 'react';
import { Search, Bell, AlertTriangle, Plus, Sparkles, Moon, Sun, Monitor } from 'lucide-react';
import { NavigationTab, AlertItem, NotificationItem } from '../../types';
import { Button } from '../common/Button';
import { useTheme } from '../../context/ThemeContext';
import { getThemeClasses } from '../../theme/tokens';
import { NotificationPanel } from '../notifications/NotificationPanel';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  alerts: AlertItem[];
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAllNotifications: () => void;
  onOpenQuickMhc: () => void;
  nextPriorityAction: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  alerts,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAllNotifications,
  onOpenQuickMhc,
  nextPriorityAction
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const { theme, setTheme, effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTabTitle = (tab: NavigationTab) => {
    switch (tab) {
      case 'start_page': return 'Daily Work — Operational Home';
      case 'workflow_guide': return 'Workflow Guide (SOP Manual)';
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

  return (
    <header className={`px-6 py-3 border-b sticky top-0 z-20 backdrop-blur-md transition-colors duration-250 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
      isDark 
        ? 'bg-[#111315]/90 border-[#2B323A]/80 text-[#F3F4F6]' 
        : 'bg-white/95 border-slate-300/80 text-slate-900 shadow-xs'
    }`}>
      {/* Title & Next Action Directive */}
      <div>
        <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
          {getTabTitle(activeTab)}
        </h1>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider flex items-center gap-1 ${
            isDark 
              ? 'bg-[#8B9DFF]/15 text-[#8B9DFF] border-[#8B9DFF]/30' 
              : 'bg-indigo-50 text-indigo-800 border-indigo-200'
          }`}>
            <Sparkles className={`w-2.5 h-2.5 ${isDark ? 'text-[#8B9DFF]' : 'text-indigo-600'}`} />
            DIRECTIVE
          </span>
          <p className={`text-xs font-medium truncate max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
            {nextPriorityAction || "Execute scheduled Q3 MHC on TRUMPF TruMicro Fab 18A."}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Theme Selector Controls */}
        <div className={`p-1 rounded-lg border flex items-center gap-0.5 ${
          isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-100 border-slate-300/80'
        }`}>
          <button
            onClick={() => setTheme('dark')}
            title="Dark Theme"
            className={`p-1 rounded transition-all ${
              theme === 'dark' 
                ? 'bg-[#20252B] text-[#8B9DFF] shadow-xs' 
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTheme('light')}
            title="Light Theme"
            className={`p-1 rounded transition-all ${
              theme === 'light' 
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200' 
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTheme('system')}
            title="System Theme"
            className={`p-1 rounded transition-all ${
              theme === 'system' 
                ? isDark ? 'bg-[#20252B] text-[#8B9DFF]' : 'bg-white text-indigo-700 border border-slate-200 shadow-xs' 
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden lg:block w-56">
          <Search className={`w-3.5 h-3.5 absolute left-3 top-2.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            placeholder="Search Serial, Contract..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full text-xs rounded-lg pl-8 pr-3 py-1.5 border transition-all ${
              isDark 
                ? 'bg-[#1A1D21] text-slate-200 border-[#2B323A] placeholder-slate-500 focus:border-[#8B9DFF]' 
                : 'bg-slate-50 text-slate-900 border-slate-300 placeholder-slate-500 focus:border-indigo-600'
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

        {/* Notification Bell Icon & Center Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationPanel(!showNotificationPanel)}
            title="Notification Center"
            className={`p-1.5 rounded-lg border transition-all relative ${
              showNotificationPanel
                ? isDark 
                  ? 'bg-[#20252B] border-[#8B9DFF] text-[#8B9DFF]' 
                  : 'bg-indigo-50 border-indigo-300 text-indigo-700'
                : isDark 
                  ? 'bg-[#1A1D21] border-[#2B323A] text-slate-300 hover:text-slate-100 hover:bg-[#20252B]' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold font-mono flex items-center justify-center bg-indigo-600 text-white ring-2 ring-[#111315] animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Panel Popover */}
          <NotificationPanel
            isOpen={showNotificationPanel}
            onClose={() => setShowNotificationPanel(false)}
            notifications={notifications}
            onMarkAsRead={onMarkAsRead}
            onMarkAllAsRead={onMarkAllAsRead}
            onClearAll={onClearAllNotifications}
            onNavigateTab={setActiveTab}
            isDark={isDark}
          />
        </div>
      </div>
    </header>
  );
};

