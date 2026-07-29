import React from 'react';
import { CheckCircle2, Clock, CheckSquare, ArrowRight } from 'lucide-react';
import { FieldEngineerTask, NavigationTab } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface WorkOrderChecklistProps {
  tasks: FieldEngineerTask[];
  onToggleTask: (taskId: string) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const WorkOrderChecklist: React.FC<WorkOrderChecklistProps> = ({
  tasks,
  onToggleTask,
  onNavigate
}) => {
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="p-6 rounded-2xl bg-[#0e172a] border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">
            WORK ORDER CHECKLIST
          </span>
          <h3 className="text-base font-bold text-slate-100">
            Field Execution Checklist (#WO-20260729-TSMC)
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">
            Progress: <strong className="text-blue-400 font-bold">{completedCount} / {tasks.length} Done</strong>
          </span>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('planner')}>
            Full Planner
          </Button>
        </div>
      </div>

      {/* Checklist Action Items */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onToggleTask(task.id)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              task.completed
                ? 'bg-slate-900/40 border-slate-800/80 text-slate-500 line-through'
                : task.priority === 'URGENT'
                ? 'bg-rose-950/20 border-rose-800/50 text-slate-100 hover:bg-rose-950/30'
                : 'bg-[#090f1d] border-slate-800 text-slate-200 hover:bg-slate-800/50'
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
              <span className="text-[10px] font-mono text-slate-500">{task.dueDate}</span>
              <Badge
                variant={
                  task.completed
                    ? 'gray'
                    : task.priority === 'URGENT'
                    ? 'rose'
                    : task.priority === 'HIGH'
                    ? 'amber'
                    : 'blue'
                }
                size="sm"
              >
                {task.completed ? 'DONE' : task.priority}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
