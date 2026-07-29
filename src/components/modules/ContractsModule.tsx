import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  Edit3, 
  Plus, 
  Building2, 
  Layers, 
  ShieldCheck, 
  ChevronRight, 
  Save 
} from 'lucide-react';
import { Contract } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

interface ContractsModuleProps {
  contracts: Contract[];
  onUpdateContract: (updatedContract: Contract) => void;
  onOpenPlannerForContract: (contractId: string) => void;
}

export const ContractsModule: React.FC<ContractsModuleProps> = ({
  contracts,
  onUpdateContract,
  onOpenPlannerForContract
}) => {
  const [selectedContractId, setSelectedContractId] = useState<string>(contracts[0]?.id || '');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);

  const selectedContract = contracts.find((c) => c.id === selectedContractId) || contracts[0];

  const handleEditClick = () => {
    if (selectedContract) {
      setEditingContract({ ...selectedContract });
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = () => {
    if (editingContract) {
      onUpdateContract(editingContract);
      setIsEditModalOpen(false);
    }
  };

  const toggleMilestone = (milestoneId: string) => {
    if (!selectedContract) return;
    const updatedMilestones = selectedContract.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const progressPercent = Math.round((completedCount / updatedMilestones.length) * 100);

    const updated = {
      ...selectedContract,
      milestones: updatedMilestones,
      progressPercent
    };
    onUpdateContract(updated);
  };

  if (!selectedContract) return null;

  return (
    <div className="space-y-6 pb-12">
      {/* Contract Selector Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contracts.map((cnt) => {
          const isSelected = cnt.id === selectedContract.id;
          return (
            <div
              key={cnt.id}
              onClick={() => setSelectedContractId(cnt.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#111e36] border-cyan-500/60 shadow-lg shadow-cyan-950/40'
                  : 'bg-[#0d1424] border-[#1e2d4a] hover:bg-[#131d33]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400">{cnt.contractNumber}</span>
                <Badge variant={cnt.riskLevel === 'LOW' ? 'emerald' : 'amber'} size="sm">
                  {cnt.status}
                </Badge>
              </div>
              <h3 className="text-sm font-bold text-slate-100 truncate">{cnt.customerName}</h3>
              <p className="text-xs text-slate-400 truncate mt-0.5">{cnt.plantName}</p>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Progress: {cnt.progressPercent}%</span>
                <span>{cnt.remainingWorkingDays} Days Left</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Selected Contract Detail View */}
      <Card
        title={
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-cyan-400 font-bold">{selectedContract.contractNumber}</span>
                <Badge variant={selectedContract.riskLevel === 'LOW' ? 'emerald' : 'amber'}>
                  Risk Level: {selectedContract.riskLevel}
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-slate-100 mt-1">{selectedContract.customerName}</h2>
              <p className="text-xs text-slate-400">{selectedContract.plantName}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" icon={<Edit3 className="w-3.5 h-3.5" />} onClick={handleEditClick}>
                Edit Contract
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Calendar className="w-3.5 h-3.5" />}
                onClick={() => onOpenPlannerForContract(selectedContract.id)}
              >
                Open 2-Year Planner
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#090f1c] border border-[#1a2842]">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-mono">Duration</span>
              <p className="text-base font-bold text-slate-100 mt-0.5">{selectedContract.durationMonths} Months</p>
              <p className="text-[10px] text-slate-500">{selectedContract.startDate} to {selectedContract.endDate}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-mono">Total Working Days</span>
              <p className="text-base font-bold text-slate-100 mt-0.5">{selectedContract.totalWorkingDays} Days</p>
              <p className="text-[10px] text-slate-500">M-F Working Calendar</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-mono">Remaining Days</span>
              <p className="text-base font-bold text-cyan-400 mt-0.5">{selectedContract.remainingWorkingDays} Days</p>
              <p className="text-[10px] text-slate-500">Active Execution Window</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-mono">Lead Engineer</span>
              <p className="text-xs font-semibold text-slate-100 truncate mt-0.5">{selectedContract.engineerAssigned}</p>
              <p className="text-[10px] text-slate-500">{selectedContract.quarterlyScheduleCount} Quarterly MHCs</p>
            </div>
          </div>

          {/* Deliverables & Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Contract Deliverables & Scope">
              <ul className="space-y-2">
                {selectedContract.deliverables.map((del, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Terms, SLA & Custom Notes">
              <div className="space-y-3 text-xs text-slate-300">
                <div>
                  <span className="font-semibold text-slate-400 block mb-1">Service Level Agreement:</span>
                  <p className="p-2.5 rounded-lg bg-[#090f1c] border border-[#1a2842]">{selectedContract.terms}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-400 block mb-1">Site Protocol Notes:</span>
                  <p className="p-2.5 rounded-lg bg-[#090f1c] border border-[#1a2842] text-amber-200">
                    {selectedContract.customNotes}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Milestones & Execution Timeline */}
          <Card title="2-Year Contract Milestones & Progress Tracking">
            <div className="space-y-3">
              {selectedContract.milestones.map((ms) => (
                <div
                  key={ms.id}
                  onClick={() => toggleMilestone(ms.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    ms.completed
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-300'
                      : 'bg-[#111c30] border-[#1f2f4d] hover:bg-[#16243d] text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        ms.completed
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'border-slate-600 bg-slate-900/80'
                      }`}
                    >
                      {ms.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{ms.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Due Target: {ms.dueDate}</p>
                    </div>
                  </div>

                  <Badge variant={ms.completed ? 'emerald' : 'amber'} size="sm">
                    {ms.completed ? 'COMPLETED' : 'PENDING'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Card>

      {/* Edit Contract Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Contract Specifications"
        subtitle={editingContract?.contractNumber}
      >
        {editingContract && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Customer Name</label>
              <input
                type="text"
                value={editingContract.customerName}
                onChange={(e) => setEditingContract({ ...editingContract, customerName: e.target.value })}
                className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Plant Name</label>
              <input
                type="text"
                value={editingContract.plantName}
                onChange={(e) => setEditingContract({ ...editingContract, plantName: e.target.value })}
                className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Start Date</label>
                <input
                  type="date"
                  value={editingContract.startDate}
                  onChange={(e) => setEditingContract({ ...editingContract, startDate: e.target.value })}
                  className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">End Date</label>
                <input
                  type="date"
                  value={editingContract.endDate}
                  onChange={(e) => setEditingContract({ ...editingContract, endDate: e.target.value })}
                  className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Total Working Days</label>
                <input
                  type="number"
                  value={editingContract.totalWorkingDays}
                  onChange={(e) =>
                    setEditingContract({ ...editingContract, totalWorkingDays: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Remaining Working Days</label>
                <input
                  type="number"
                  value={editingContract.remainingWorkingDays}
                  onChange={(e) =>
                    setEditingContract({ ...editingContract, remainingWorkingDays: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Assigned Lead Engineer</label>
              <input
                type="text"
                value={editingContract.engineerAssigned}
                onChange={(e) => setEditingContract({ ...editingContract, engineerAssigned: e.target.value })}
                className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Terms & Conditions</label>
              <textarea
                value={editingContract.terms}
                onChange={(e) => setEditingContract({ ...editingContract, terms: e.target.value })}
                rows={3}
                className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
              <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" icon={<Save className="w-4 h-4" />} onClick={handleSaveEdit}>
                Save Contract Details
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
