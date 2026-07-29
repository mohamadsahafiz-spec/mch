import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  FileCheck, 
  Zap, 
  TrendingUp, 
  Bot, 
  ArrowRight, 
  ShieldAlert, 
  Activity, 
  Cpu, 
  Layers, 
  PlusCircle, 
  FileText 
} from 'lucide-react';
import { 
  FieldEngineerTask, 
  AlertItem, 
  Contract, 
  Machine, 
  ExecutionScheduleItem, 
  MHCRecord, 
  NavigationTab 
} from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { HealthGauge } from '../common/HealthGauge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';

interface MissionControlProps {
  tasks: FieldEngineerTask[];
  onToggleTask: (taskId: string) => void;
  alerts: AlertItem[];
  contracts: Contract[];
  machines: Machine[];
  schedule: ExecutionScheduleItem[];
  recentMhcs: MHCRecord[];
  onNavigate: (tab: NavigationTab) => void;
  onOpenQuickMhc: () => void;
  onSelectMachine: (machineId: string) => void;
}

export const MissionControl: React.FC<MissionControlProps> = ({
  tasks,
  onToggleTask,
  alerts,
  contracts,
  machines,
  schedule,
  recentMhcs,
  onNavigate,
  onOpenQuickMhc,
  onSelectMachine
}) => {
  // Urgent items
  const pendingTasks = tasks.filter((t) => !t.completed);
  const laserRuntimeAlerts = alerts.filter((a) => a.type === 'LASER_RUNTIME');
  const consumableAlerts = alerts.filter((a) => a.type === 'CONSUMABLE');
  const upcomingSchedule = schedule.filter((s) => s.status === 'SCHEDULED');

  // Chart data: Machine Health Distribution
  const healthDistributionData = machines.map((m) => ({
    name: m.machineNumber,
    model: m.model,
    health: m.healthScore,
    runningHours: m.laserHeads[0]?.runningHours || 0
  }));

  // Chart data: Laser Runtime Trend
  const runtimeTrendData = [
    { month: 'Jan', hours: 7800, targetMax: 10000 },
    { month: 'Feb', hours: 8050, targetMax: 10000 },
    { month: 'Mar', hours: 8210, targetMax: 10000 },
    { month: 'Apr', hours: 8420, targetMax: 10000 },
    { month: 'May', hours: 8650, targetMax: 10000 },
    { month: 'Jun', hours: 8900, targetMax: 10000 },
    { month: 'Jul', hours: 9120, targetMax: 10000 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* DIRECTIVE PROMPT HERO CARD: "What should the engineer do next?" */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1e3d] via-[#10254c] to-[#0c1933] border border-blue-600/40 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/40 uppercase tracking-wider">
                PRIMARY OPERATIONAL DIRECTIVE
              </span>
              <span className="text-xs text-slate-400 font-mono">System Time: 08:08 AM UTC</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              Replace DI Water Filter on TSMC TruMicro 7000 (MCH-TSMC-01)
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
               DI Water filter capacity is at <strong className="text-amber-400">18%</strong> (12 days left). Cooling flow delta will drop below 14 LPM if not serviced today before the Q3 MHC execution.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="lg"
              icon={<Zap className="w-4 h-4" />}
              onClick={onOpenQuickMhc}
            >
              Start Machine Health Check
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={<FileText className="w-4 h-4" />}
              onClick={() => onNavigate('mhc')}
            >
              View Inspection Worksheet
            </Button>
          </div>
        </div>
      </div>

      {/* TOP SECTION: Today's Tasks & Urgent Priorities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Engineer Tasks */}
        <Card
          title={
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Today's Engineer Tasks ({pendingTasks.length} Pending)
              </span>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('planner')}>
                Full Planner
              </Button>
            </div>
          }
          className="lg:col-span-2"
        >
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  task.completed
                    ? 'bg-slate-900/40 border-slate-800 text-slate-500 line-through'
                    : task.priority === 'URGENT'
                    ? 'bg-rose-950/20 border-rose-800/50 hover:bg-rose-950/30 text-slate-100'
                    : 'bg-[#111c30] border-[#1f2f4d] hover:bg-[#16243d] text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-600 bg-slate-900/80'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold truncate">{task.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {task.customerName} • {task.machineName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-slate-400">{task.dueDate}</span>
                  <Badge
                    variant={
                      task.completed
                        ? 'gray'
                        : task.priority === 'URGENT'
                        ? 'rose'
                        : task.priority === 'HIGH'
                        ? 'amber'
                        : 'cyan'
                    }
                    size="sm"
                  >
                    {task.completed ? 'COMPLETED' : task.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions & AI Summary Placeholder */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card title="Quick Operational Actions">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={onOpenQuickMhc}
                className="p-3 rounded-xl bg-[#121c30] hover:bg-cyan-950/50 border border-[#203254] hover:border-cyan-500/50 text-left transition-all group"
              >
                <Activity className="w-5 h-5 text-cyan-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-200">New MHC</p>
                <p className="text-[10px] text-slate-400">Laser & optics health</p>
              </button>

              <button
                onClick={() => onNavigate('contracts')}
                className="p-3 rounded-xl bg-[#121c30] hover:bg-indigo-950/50 border border-[#203254] hover:border-indigo-500/50 text-left transition-all group"
              >
                <FileText className="w-5 h-5 text-indigo-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-200">Contracts</p>
                <p className="text-[10px] text-slate-400">2-Year execution</p>
              </button>

              <button
                onClick={() => onNavigate('laser_calibration')}
                className="p-3 rounded-xl bg-[#121c30] hover:bg-amber-950/50 border border-[#203254] hover:border-amber-500/50 text-left transition-all group"
              >
                <Zap className="w-5 h-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-200">Calibration</p>
                <p className="text-[10px] text-slate-400">Power offset & beam</p>
              </button>

              <button
                onClick={() => onNavigate('reports')}
                className="p-3 rounded-xl bg-[#121c30] hover:bg-emerald-950/50 border border-[#203254] hover:border-emerald-500/50 text-left transition-all group"
              >
                <FileCheck className="w-5 h-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-200">Reports</p>
                <p className="text-[10px] text-slate-400">Executive PDF export</p>
              </button>
            </div>
          </Card>

          {/* AI Summary Placeholder (AI Ready Architecture) */}
          <Card
            title={
              <span className="flex items-center gap-2 text-indigo-300">
                <Bot className="w-4 h-4 text-indigo-400" />
                AI Assistant Insight (Ready)
              </span>
            }
            className="bg-gradient-to-b from-[#10192e] to-[#0d1424] border-indigo-900/40"
          >
            <div className="space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                "Laser Head B on TSMC Fab 18A has logged 9,680 hours. Historical decay models predict diode degradation at 9,920 hours. Scheduling replacement before end of Q3 will eliminate unplanned downtime risk during 3nm wafer annealing runs."
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-indigo-950">
                <span className="text-[10px] text-slate-400 font-mono">Model: Gemini 2.5 Flash (AI Architecture Ready)</span>
                <span className="text-[10px] text-indigo-400 font-mono font-semibold">98.2% Confidence</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* MIDDLE SECTION: Upcoming MHC, Contract Progress, Laser Runtime & Consumable Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Contract Execution Progress */}
        <Card title="Contract Progress">
          <div className="space-y-3">
            {contracts.map((cnt) => (
              <div key={cnt.id} className="space-y-1.5 p-2.5 rounded-lg bg-[#111b2e] border border-[#1d2d4a]">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-200 truncate">{cnt.customerName}</span>
                  <span className="font-mono text-cyan-400">{cnt.progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${cnt.progressPercent}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{cnt.remainingWorkingDays} Days Remaining</span>
                  <span>{cnt.quarterlyScheduleCount} MHCs</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming MHC & Customer Visits */}
        <Card title="Upcoming Customer Visits">
          <div className="space-y-2.5">
            {upcomingSchedule.slice(0, 3).map((item) => (
              <div key={item.id} className="p-2.5 rounded-lg bg-[#111b2e] border border-[#1d2d4a]">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1">
                  <span className="truncate">{item.customerName}</span>
                  <Badge variant="cyan" size="sm">{item.quarter}</Badge>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-slate-500">
                  <Calendar className="w-3 h-3 text-cyan-400" />
                  <span>{item.scheduledDate}</span>
                  <span>•</span>
                  <span>{item.engineerName}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Laser Runtime Alerts */}
        <Card title="Laser Runtime Alerts">
          <div className="space-y-2">
            {laserRuntimeAlerts.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">All laser heads operating normal runtime.</p>
            ) : (
              laserRuntimeAlerts.map((alt) => (
                <div key={alt.id} className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-amber-200">
                  <p className="text-xs font-semibold mb-0.5">{alt.machineName}</p>
                  <p className="text-[11px] text-amber-300/80 leading-snug">{alt.message}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Consumables Alerts */}
        <Card title="Consumable Replacement Alerts">
          <div className="space-y-2">
            {consumableAlerts.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">Consumable life cycles optimal.</p>
            ) : (
              consumableAlerts.map((alt) => (
                <div key={alt.id} className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-800/40 text-rose-200">
                  <p className="text-xs font-semibold mb-0.5">{alt.machineName}</p>
                  <p className="text-[11px] text-rose-300/80 leading-snug">{alt.message}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* LOWER SECTION: Recent Field Activities & Modern Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Health Bar Chart */}
        <Card
          title="Fleet Machine Health Distribution"
          subtitle="Real-time Subsystem Quality Scores"
          className="lg:col-span-2"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1424', borderColor: '#1f2e4d', borderRadius: '8px', color: '#f8fafc' }}
                  formatter={(val: any) => [`${val}%`, 'Health Score']}
                />
                <Bar dataKey="health" radius={[6, 6, 0, 0]}>
                  {healthDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.health >= 90 ? '#10b981' : entry.health >= 75 ? '#f59e0b' : '#f43f5e'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Laser Head Runtime Trend Area Chart */}
        <Card title="Laser Head Hours Accumulation" subtitle="TruMicro 7070 Head B (SN-9041-B)">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={runtimeTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} domain={[7000, 10500]} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1424', borderColor: '#1f2e4d', borderRadius: '8px', color: '#f8fafc' }}
                  formatter={(val: any) => [`${val} hrs`, 'Running Hours']}
                />
                <Area type="monotone" dataKey="hours" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#hoursGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* RECENT ACTIVITIES TIMELINE */}
      <Card title="Recent Field Activities & Audit History">
        <div className="space-y-3">
          {recentMhcs.map((rec) => (
            <div key={rec.id} className="p-3 rounded-xl bg-[#111c30] border border-[#1f2f4d] flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 shrink-0 mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-100">{rec.machineName}</h4>
                    <Badge variant="emerald" size="sm">{rec.productionReleaseStatus}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {rec.customerName} • {rec.plantName} • Engineer {rec.engineerName}
                  </p>
                  <p className="text-[11px] text-slate-300 italic mt-1">"{rec.engineerRemarks}"</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <div className="text-right font-mono">
                  <span className="text-xs font-bold text-cyan-400">{rec.healthScores.overallScore}/100</span>
                  <p className="text-[10px] text-slate-500">{rec.date}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => onNavigate('reports')}>
                  Executive Report
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
