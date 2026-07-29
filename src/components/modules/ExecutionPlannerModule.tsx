import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Cpu, 
  Sliders, 
  Trash2, 
  Edit2, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Filter, 
  Briefcase 
} from 'lucide-react';
import { ExecutionScheduleItem, Contract, Machine } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

interface ExecutionPlannerProps {
  schedule: ExecutionScheduleItem[];
  contracts: Contract[];
  machines: Machine[];
  onAddScheduleItem: (item: ExecutionScheduleItem) => void;
  onUpdateScheduleItem: (item: ExecutionScheduleItem) => void;
  onDeleteScheduleItem: (itemId: string) => void;
}

export const ExecutionPlannerModule: React.FC<ExecutionPlannerProps> = ({
  schedule,
  contracts,
  machines,
  onAddScheduleItem,
  onUpdateScheduleItem,
  onDeleteScheduleItem
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar' | 'quarters'>('timeline');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('ALL');
  const [selectedEngineerFilter, setSelectedEngineerFilter] = useState<string>('ALL');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExecutionScheduleItem | null>(null);

  // New item form state
  const [newItemForm, setNewItemForm] = useState<Partial<ExecutionScheduleItem>>({
    title: 'Quarterly Machine Health Check & Calibration',
    quarter: 'Q7',
    type: 'QUARTERLY_MHC',
    status: 'SCHEDULED',
    scheduledDate: '2026-08-25',
    engineerName: 'Alex Mercer',
    estimatedHours: 6
  });

  // Calculate stats
  const totalItems = schedule.length;
  const completedItems = schedule.filter((s) => s.status === 'COMPLETED').length;
  const pendingItems = schedule.filter((s) => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS').length;
  const totalWorkloadHours = schedule.reduce((sum, item) => sum + item.estimatedHours, 0);

  // M-F Working Day Check helper
  const isWeekend = (dateStr: string) => {
    const day = new Date(dateStr).getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  };

  const filteredSchedule = schedule.filter((item) => {
    if (selectedQuarter !== 'ALL' && item.quarter !== selectedQuarter) return false;
    if (selectedEngineerFilter !== 'ALL' && item.engineerName !== selectedEngineerFilter) return false;
    return true;
  });

  const quartersList = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'];

  const handleCreateNewItem = () => {
    if (isWeekend(newItemForm.scheduledDate || '')) {
      alert('Note: Field operations planner enforces Monday-Friday working days. Weekends excluded.');
      return;
    }

    const item: ExecutionScheduleItem = {
      id: `sch-${Date.now()}`,
      contractId: contracts[0]?.id || 'cnt-2026-01',
      customerName: newItemForm.customerName || contracts[0]?.customerName || 'TSMC Fab 18',
      plantName: newItemForm.plantName || contracts[0]?.plantName || 'Fab 18A Cleanroom',
      machineId: newItemForm.machineId || machines[0]?.id || 'mch-101',
      machineName: newItemForm.machineName || machines[0]?.model || 'TRUMPF TruMicro 7000',
      engineerName: newItemForm.engineerName || 'Alex Mercer',
      title: newItemForm.title || 'Quarterly MHC',
      scheduledDate: newItemForm.scheduledDate || '2026-08-25',
      quarter: (newItemForm.quarter as any) || 'Q7',
      type: (newItemForm.type as any) || 'QUARTERLY_MHC',
      status: (newItemForm.status as any) || 'SCHEDULED',
      estimatedHours: newItemForm.estimatedHours || 6
    };

    onAddScheduleItem(item);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      if (isWeekend(editingItem.scheduledDate)) {
        alert('Note: Field operations planner enforces Monday-Friday working days. Weekends excluded.');
        return;
      }
      onUpdateScheduleItem(editingItem);
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Planner Metric Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#0b1324] border border-[#1d2d4a]">
        <div>
          <span className="text-xs text-slate-400 font-mono uppercase">2-Year Operations Window</span>
          <p className="text-xl font-bold text-slate-100 mt-0.5">8 Quarters (24 Mos)</p>
          <p className="text-[10px] font-mono text-cyan-400">522 M-F Working Days</p>
        </div>
        <div>
          <span className="text-xs text-slate-400 font-mono uppercase">Total Field MHC Workload</span>
          <p className="text-xl font-bold text-slate-100 mt-0.5">{totalWorkloadHours} Hours</p>
          <p className="text-[10px] font-mono text-slate-400">{totalItems} Total Operations</p>
        </div>
        <div>
          <span className="text-xs text-slate-400 font-mono uppercase">Execution Progress</span>
          <p className="text-xl font-bold text-emerald-400 mt-0.5">
            {totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0}%
          </p>
          <p className="text-[10px] font-mono text-slate-400">{completedItems} / {totalItems} Completed</p>
        </div>
        <div>
          <span className="text-xs text-slate-400 font-mono uppercase">Pending MHC Interventions</span>
          <p className="text-xl font-bold text-amber-400 mt-0.5">{pendingItems} Scheduled</p>
          <p className="text-[10px] font-mono text-slate-400">Weekend Excluded (M-F)</p>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#0d1424] border border-[#1f2e4d]">
        {/* View Switcher */}
        <div className="flex items-center p-1 rounded-lg bg-[#080d18] border border-[#1a263d]">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'timeline' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Timeline View
          </button>
          <button
            onClick={() => setViewMode('quarters')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'quarters' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Quarterly Grid
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'calendar' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            M-F Calendar View
          </button>
        </div>

        {/* Filters & Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#11192b] px-2.5 py-1.5 rounded-lg border border-[#223252] text-xs">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Quarters (Q1-Q8)</option>
              {quartersList.map((q) => (
                <option key={q} value={q}>{q} Target</option>
              ))}
            </select>
          </div>

          <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsAddModalOpen(true)}>
            Schedule Intervention
          </Button>
        </div>
      </div>

      {/* TIMELINE VIEW */}
      {viewMode === 'timeline' && (
        <Card title="Full Two-Year Field Execution Timeline (M-F Working Days)">
          <div className="space-y-4">
            {filteredSchedule.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#111c30] border border-[#1f2f4d] hover:border-cyan-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 shrink-0">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="cyan" size="sm">{item.quarter}</Badge>
                      <Badge variant={item.type === 'QUARTERLY_MHC' ? 'indigo' : 'amber'} size="sm">
                        {item.type}
                      </Badge>
                      <span className="text-xs font-mono text-slate-400">({item.estimatedHours} hrs)</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 mt-1">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.customerName} • {item.plantName} • Machine: <span className="text-slate-300 font-semibold">{item.machineName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-slate-800">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-cyan-400 block">{item.scheduledDate}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {isWeekend(item.scheduledDate) ? '⚠️ Weekend' : 'Engineer: ' + item.engineerName}
                    </span>
                  </div>

                  <Badge
                    variant={item.status === 'COMPLETED' ? 'emerald' : item.status === 'IN_PROGRESS' ? 'amber' : 'gray'}
                  >
                    {item.status}
                  </Badge>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteScheduleItem(item.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* QUARTERLY GRID VIEW */}
      {viewMode === 'quarters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quartersList.map((q) => {
            const qItems = schedule.filter((s) => s.quarter === q);
            return (
              <Card key={q} title={`${q} Execution Plan`} subtitle={`${qItems.length} Interventions`}>
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {qItems.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center italic">No events scheduled for {q}.</p>
                  ) : (
                    qItems.map((item) => (
                      <div key={item.id} className="p-2.5 rounded-lg bg-[#090f1c] border border-[#1a2842] text-xs">
                        <div className="flex items-center justify-between font-semibold text-slate-200 mb-1">
                          <span className="truncate">{item.customerName}</span>
                          <span className="text-[10px] font-mono text-cyan-400">{item.scheduledDate}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{item.title}</p>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* M-F CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <Card title="August 2026 M-F Working Days Calendar (Weekends Excluded)">
          <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono mb-2 text-slate-400">
            <div className="p-2 bg-[#0a101d] rounded">Monday</div>
            <div className="p-2 bg-[#0a101d] rounded">Tuesday</div>
            <div className="p-2 bg-[#0a101d] rounded">Wednesday</div>
            <div className="p-2 bg-[#0a101d] rounded">Thursday</div>
            <div className="p-2 bg-[#0a101d] rounded">Friday</div>
          </div>
          <div className="grid grid-cols-5 gap-2 text-xs">
            {Array.from({ length: 20 }).map((_, i) => {
              const dayNum = i + 3; // Aug 3 - Aug 28 M-F
              const dateStr = `2026-08-${dayNum < 10 ? '0' + dayNum : dayNum}`;
              const dayEvents = schedule.filter((s) => s.scheduledDate === dateStr);
              return (
                <div
                  key={i}
                  className="min-h-24 p-2 rounded-xl bg-[#111a2d] border border-[#1e2d4a] flex flex-col justify-between"
                >
                  <span className="font-mono text-[10px] text-slate-400 font-bold">{dateStr}</span>
                  <div className="space-y-1 my-1">
                    {dayEvents.map((ev) => (
                      <div key={ev.id} className="p-1 rounded bg-cyan-950/80 border border-cyan-800 text-[10px] text-cyan-200 truncate">
                        {ev.title}
                      </div>
                    ))}
                  </div>
                  <span className="text-[9px] text-slate-600 text-right">M-F Valid</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Add Intervention Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Schedule New Field Operation">
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Intervention Title</label>
            <input
              type="text"
              value={newItemForm.title}
              onChange={(e) => setNewItemForm({ ...newItemForm, title: e.target.value })}
              className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Scheduled Date (M-F strictly)</label>
              <input
                type="date"
                value={newItemForm.scheduledDate}
                onChange={(e) => setNewItemForm({ ...newItemForm, scheduledDate: e.target.value })}
                className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Target Quarter</label>
              <select
                value={newItemForm.quarter}
                onChange={(e) => setNewItemForm({ ...newItemForm, quarter: e.target.value as any })}
                className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
              >
                {quartersList.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Engineer Assigned</label>
              <input
                type="text"
                value={newItemForm.engineerName}
                onChange={(e) => setNewItemForm({ ...newItemForm, engineerName: e.target.value })}
                className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Estimated Duration (Hours)</label>
              <input
                type="number"
                value={newItemForm.estimatedHours}
                onChange={(e) => setNewItemForm({ ...newItemForm, estimatedHours: parseInt(e.target.value) || 4 })}
                className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button variant="primary" icon={<Save className="w-4 h-4" />} onClick={handleCreateNewItem}>
              Schedule Intervention
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Item Modal */}
      {editingItem && (
        <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title="Reschedule Field Operation">
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Intervention Title</label>
              <input
                type="text"
                value={editingItem.title}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Scheduled Date (M-F strictly)</label>
                <input
                  type="date"
                  value={editingItem.scheduledDate}
                  onChange={(e) => setEditingItem({ ...editingItem, scheduledDate: e.target.value })}
                  className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Target Quarter</label>
                <select
                  value={editingItem.quarter}
                  onChange={(e) => setEditingItem({ ...editingItem, quarter: e.target.value as any })}
                  className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
                >
                  {quartersList.map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
              <Button variant="ghost" onClick={() => setEditingItem(null)}>Cancel</Button>
              <Button variant="primary" icon={<Save className="w-4 h-4" />} onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
