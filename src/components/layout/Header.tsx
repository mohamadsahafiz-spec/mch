import React, { useState } from 'react';
import { Search, Bell, Clock, ChevronDown, CheckCircle2, AlertTriangle, Plus, Sparkles } from 'lucide-react';
import { NavigationTab, AlertItem } from '../../types';
import { Button } from '../common/Button';

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

  const getTabTitle = (tab: NavigationTab) => {
    switch (tab) {
      case 'mission_control': return 'Mission Control & Operational Directives';
      case 'contracts': return 'Contract Management & Deliverables';
      case 'planner': return 'Full Two-Year Execution Planner';
      case 'customers': return 'Customers, Plants & Production Lines';
      case 'machines': return 'Machine Passport & Asset Records';
      case 'mhc': return 'Machine Health Check (MHC)';
      case 'laser_calibration': return 'Laser Calibration & Optics Diagnostics';
      case 'baseline_check': return 'Baseline Verification & Drift Tracking';
      case 'quality_investigation': return 'Quality Investigation & Failure RCA';
      case 'reports': return 'Executive Engineering Reports';
      case 'analytics': return 'Operational & Reliability Analytics';
      case 'knowledge_base': return 'Field Engineering Knowledge Base & Manuals';
      case 'settings': return 'System Settings & Engineer Configuration';
      default: return 'Field Operations System';
    }
  };

  const criticalAlertsCount = alerts.filter(a => a.severity === 'CRITICAL').length;

  return (
    <header className="bg-[#090d16]/90 border-b border-slate-800/80 px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-md">
      {/* Title & Next Action Prompt */}
      <div>
        <h1 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
          {getTabTitle(activeTab)}
        </h1>
        {/* Core Directive Banner: "What should the engineer do next?" */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] font-mono font-semibold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-400" />
            DIRECTIVE
          </span>
          <p className="text-xs text-slate-300 font-medium truncate max-w-xl">
            {nextPriorityAction || "Execute scheduled Q3 MHC on TRUMPF TruMicro Fab 18A."}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <div className="relative hidden lg:block w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Serial, Contract, Machine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0e172a] text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 border border-slate-700/80 focus:outline-none focus:border-blue-500 placeholder-slate-500 transition-all"
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
            className="p-2 rounded-lg bg-[#11192b] border border-[#223252] text-slate-300 hover:text-slate-100 hover:bg-[#18243c] transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold font-mono flex items-center justify-center text-white ${criticalAlertsCount > 0 ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'}`}>
                {alerts.length}
              </span>
            )}
          </button>

          {/* Alerts Dropdown Panel */}
          {showAlertsDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0d1424] border border-[#1f2e4d] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Active Operational Alerts ({alerts.length})
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Live Sync</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {alerts.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No active system alerts.</p>
                ) : (
                  alerts.map((alt) => (
                    <div
                      key={alt.id}
                      className={`p-2.5 rounded-lg border text-xs ${
                        alt.severity === 'CRITICAL'
                          ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                          : 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <span className="truncate">{alt.machineName}</span>
                        <span className="text-[10px] font-mono opacity-80">{alt.timestamp}</span>
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
