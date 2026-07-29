import React from 'react';
import { FileText } from 'lucide-react';
import { MHCRecord, NavigationTab } from '../../types';
import { Button } from '../common/Button';
import { useTheme } from '../../context/ThemeContext';

interface TodayActivityLogProps {
  recentMhcs: MHCRecord[];
  onNavigate: (tab: NavigationTab) => void;
}

export const TodayActivityLog: React.FC<TodayActivityLogProps> = ({
  recentMhcs,
  onNavigate
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const todayLogs = [
    {
      time: '08:50 AM UTC',
      title: 'Galvo Servo Gain Test Diode Fired (635nm @ 1% Power)',
      engineer: 'Alex Mercer',
      details: 'Mounted 9-point quartz target grid. Detected 2.1µs step latency delta on X-galvo motor.',
      type: 'CALIBRATION'
    },
    {
      time: '08:35 AM UTC',
      title: 'DI Water Cooling Filter Cartridge Swapped & System Bled',
      engineer: 'Alex Mercer',
      details: 'Replaced spent 0.2µm filter. De-aerated laser head cooling jacket. Pressure stable at 3.2 bar.',
      type: 'MAINTENANCE'
    },
    {
      time: '08:10 AM UTC',
      title: 'ISO Class 4 Cleanroom Gowning & Safety Interlock Verified',
      engineer: 'Alex Mercer',
      details: 'Air shower cycle complete. Particle count 4/m³. Class 4 laser safety curtains secured.',
      type: 'SAFETY'
    }
  ];

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-200 space-y-4 ${
      isDark 
        ? 'bg-[#20252B] border-[#2B323A] text-[#F3F4F6]' 
        : 'bg-white border-slate-200 text-slate-900 shadow-xs'
    }`}>
      <div className="flex items-center justify-between border-b border-[#2B323A]/60 pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#8B9DFF] uppercase tracking-wider block mb-0.5">
            AUDIT & ACTIVITY LOG
          </span>
          <h3 className="text-base font-bold">
            Today's On-Site Operational Trace (2026-07-29)
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">3 Logs Today</span>
      </div>

      {/* Chronological Timeline */}
      <div className="space-y-4 pl-2 border-l-2 border-[#2B323A]">
        {todayLogs.map((log, index) => (
          <div key={index} className="relative pl-5 space-y-1">
            <span className="absolute -left-[13px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#8B9DFF] ring-4 ring-[#20252B]" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">{log.title}</span>
              <span className="text-[10px] font-mono text-slate-400">{log.time}</span>
            </div>
            <p className="text-xs text-slate-400 font-sans">{log.details}</p>
            <p className="text-[10px] font-mono text-slate-500">Engineer: {log.engineer}</p>
          </div>
        ))}
      </div>

      {/* Historical MHC Reports Link */}
      <div className="pt-3 border-t border-[#2B323A]/60 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400">Previous Q2 MHC Audit Score: <strong className="text-[#7FD4A6] font-bold">96/100</strong></span>
        <Button variant="ghost" size="sm" icon={<FileText className="w-3.5 h-3.5" />} onClick={() => onNavigate('reports')}>
          View Archived Reports
        </Button>
      </div>
    </div>
  );
};
