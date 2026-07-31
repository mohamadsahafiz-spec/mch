import React, { useState } from 'react';
import { 
  Cpu, 
  Zap, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Activity, 
  Activity as HeartIcon,
  Image as ImageIcon, 
  Wrench, 
  Plus, 
  Layers,
  Edit3,
  Type,
  Trash2,
  X,
  Settings,
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Copy,
  Archive,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { Machine, MHCRecord, ExecutiveReport } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { HealthGauge } from '../common/HealthGauge';
import { useTheme } from '../../context/ThemeContext';

interface MachinePassportProps {
  machines: Machine[];
  selectedMachineId: string;
  onSelectMachine: (id: string) => void;
  mhcRecords: MHCRecord[];
  reports: ExecutiveReport[];
  onOpenMhcForMachine: (machineId: string) => void;
  onAddMachine?: (machine: Machine) => void;
  onEditMachine?: (machine: Machine) => void;
  onDeleteMachine?: (machineId: string) => void;
}

export const MachinePassportModule: React.FC<MachinePassportProps> = ({
  machines,
  selectedMachineId,
  onSelectMachine,
  mhcRecords,
  reports,
  onOpenMhcForMachine,
  onAddMachine,
  onEditMachine,
  onDeleteMachine
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const selectedMachine = machines.find((m) => m.id === selectedMachineId) || machines[0];

  // Action Menu Dropdown State
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  // Modal Visibility States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form States
  const [addForm, setAddForm] = useState({
    model: '',
    machineNumber: '',
    serialNumber: '',
    customerName: 'TSMC Microelectronics Fab 18',
    plantName: 'Tainan Cleanroom Fab 18A',
    productionLineName: 'Line 4 - Sub-3nm Silicon Annealing',
    status: 'OPERATIONAL' as Machine['status'],
    healthScore: 98,
    installationDate: new Date().toISOString().split('T')[0],
    baselineDate: new Date().toISOString().split('T')[0],
    laserHeadModel: 'TruPulse 2000 Main Oscillator'
  });

  const [editForm, setEditForm] = useState({
    model: '',
    machineNumber: '',
    serialNumber: '',
    customerName: '',
    plantName: '',
    productionLineName: '',
    status: 'OPERATIONAL' as Machine['status'],
    healthScore: 100,
    installationDate: '',
    baselineDate: ''
  });

  const [renameForm, setRenameForm] = useState({
    model: '',
    machineNumber: '',
    serialNumber: ''
  });

  if (!selectedMachine) {
    return (
      <div className="p-8 text-center space-y-4">
        <Cpu className="w-12 h-12 mx-auto text-slate-400" />
        <h2 className="text-lg font-bold">No Machines Available in Passport</h2>
        <p className="text-sm text-slate-500">Create a machine to begin tracking passport telemetry.</p>
        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add First Machine
        </Button>
      </div>
    );
  }

  const machineMhcs = mhcRecords.filter((r) => r.machineId === selectedMachine.id);
  const machineReports = reports.filter((r) => r.serialNumber === selectedMachine.serialNumber);

  // Fleet Navigator Handlers
  const currentIndex = machines.findIndex((m) => m.id === selectedMachine.id);
  const handlePrevMachine = () => {
    if (machines.length === 0) return;
    const prevIdx = (currentIndex - 1 + machines.length) % machines.length;
    onSelectMachine(machines[prevIdx].id);
  };

  const handleNextMachine = () => {
    if (machines.length === 0) return;
    const nextIdx = (currentIndex + 1) % machines.length;
    onSelectMachine(machines[nextIdx].id);
  };

  const handleDuplicateMachine = () => {
    const duplicate: Machine = {
      ...selectedMachine,
      id: `mch-${Date.now()}`,
      machineNumber: `${selectedMachine.machineNumber}-COPY`,
      serialNumber: `SN-COPY-${Math.floor(100000 + Math.random() * 900000)}`,
      model: `${selectedMachine.model} (Copy)`
    };
    if (onAddMachine) {
      onAddMachine(duplicate);
    }
    onSelectMachine(duplicate.id);
    setIsActionMenuOpen(false);
  };

  const handleArchiveMachine = () => {
    const archived: Machine = {
      ...selectedMachine,
      status: 'OUT_OF_SERVICE'
    };
    if (onEditMachine) {
      onEditMachine(archived);
    }
    setIsActionMenuOpen(false);
  };

  // Handlers
  const handleOpenAdd = () => {
    setAddForm({
      model: '',
      machineNumber: `MCH-${Math.floor(100 + Math.random() * 900)}`,
      serialNumber: `SN-TRU-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: selectedMachine?.customerName || 'TSMC Microelectronics Fab 18',
      plantName: selectedMachine?.plantName || 'Tainan Cleanroom Fab 18A',
      productionLineName: selectedMachine?.productionLineName || 'Line 4 - Sub-3nm Silicon Annealing',
      status: 'OPERATIONAL',
      healthScore: 98,
      installationDate: new Date().toISOString().split('T')[0],
      baselineDate: new Date().toISOString().split('T')[0],
      laserHeadModel: 'TruPulse 2000 Main Oscillator'
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newMachine: Machine = {
      id: `mch-${Date.now()}`,
      customerId: 'cust-1',
      customerName: addForm.customerName || 'TSMC Microelectronics Fab 18',
      plantId: 'plant-1',
      plantName: addForm.plantName || 'Tainan Cleanroom Fab 18A',
      productionLineId: 'line-1',
      productionLineName: addForm.productionLineName || 'Line 4 - Sub-3nm Silicon Annealing',
      model: addForm.model || 'TRUMPF TruPulse 2000',
      machineNumber: addForm.machineNumber || `MCH-${Math.floor(100 + Math.random() * 900)}`,
      serialNumber: addForm.serialNumber || `SN-${Date.now().toString().slice(-8)}`,
      installationDate: addForm.installationDate,
      baselineDate: addForm.baselineDate,
      healthScore: Number(addForm.healthScore) || 98,
      status: addForm.status,
      photos: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'
      ],
      lastMhcDate: new Date().toISOString().split('T')[0],
      nextMhcDate: '2026-10-15',
      laserHeads: [
        {
          id: `lh-${Date.now()}-1`,
          model: addForm.laserHeadModel || 'TruPulse 2000 Main Oscillator',
          serialNumber: `LH-SN-${Math.floor(1000 + Math.random() * 9000)}`,
          runningHours: 120,
          maxRecommendedHours: 10000,
          remainingHours: 9880,
          healthScore: 98,
          ratedPowerWatts: 250,
          powerOutputWatts: 249.2,
          wavelengthNm: 1064,
          beamQualityM2: 1.08,
          estimatedReplacementDate: '2029-01-15'
        }
      ],
      consumables: [
        {
          id: `con-${Date.now()}-1`,
          name: 'Fused Silica Protective Window',
          partNumber: 'FS-OPT-9941',
          currentLifePercent: 95,
          lastReplacedDate: new Date().toISOString().split('T')[0],
          status: 'OPTIMAL',
          estimatedDaysRemaining: 180
        },
        {
          id: `con-${Date.now()}-2`,
          name: 'DI Water Cooling Ion Filter',
          partNumber: 'FLT-CW-302',
          currentLifePercent: 90,
          lastReplacedDate: new Date().toISOString().split('T')[0],
          status: 'OPTIMAL',
          estimatedDaysRemaining: 120
        }
      ]
    };

    if (onAddMachine) {
      onAddMachine(newMachine);
    }
    onSelectMachine(newMachine.id);
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = () => {
    setEditForm({
      model: selectedMachine.model,
      machineNumber: selectedMachine.machineNumber,
      serialNumber: selectedMachine.serialNumber,
      customerName: selectedMachine.customerName,
      plantName: selectedMachine.plantName,
      productionLineName: selectedMachine.productionLineName,
      status: selectedMachine.status,
      healthScore: selectedMachine.healthScore,
      installationDate: selectedMachine.installationDate,
      baselineDate: selectedMachine.baselineDate
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Machine = {
      ...selectedMachine,
      model: editForm.model,
      machineNumber: editForm.machineNumber,
      serialNumber: editForm.serialNumber,
      customerName: editForm.customerName,
      plantName: editForm.plantName,
      productionLineName: editForm.productionLineName,
      status: editForm.status,
      healthScore: Number(editForm.healthScore),
      installationDate: editForm.installationDate,
      baselineDate: editForm.baselineDate
    };

    if (onEditMachine) {
      onEditMachine(updated);
    }
    setIsEditModalOpen(false);
  };

  const handleOpenRename = () => {
    setRenameForm({
      model: selectedMachine.model,
      machineNumber: selectedMachine.machineNumber,
      serialNumber: selectedMachine.serialNumber
    });
    setIsRenameModalOpen(true);
  };

  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Machine = {
      ...selectedMachine,
      model: renameForm.model,
      machineNumber: renameForm.machineNumber,
      serialNumber: renameForm.serialNumber
    };

    if (onEditMachine) {
      onEditMachine(updated);
    }
    setIsRenameModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (onDeleteMachine) {
      onDeleteMachine(selectedMachine.id);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Layer 1 — Fleet Navigator Strip */}
      <div className={`px-4 py-2.5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isDark ? 'bg-[#14171A] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <Layers className="w-4 h-4 text-[#8B9DFF]" />
            Fleet Navigator
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
              isDark ? 'bg-[#8B9DFF]/10 border-[#8B9DFF]/30 text-[#8B9DFF]' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}>
              {machines.length} Machines
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={handlePrevMachine}
            title="Previous Machine"
            className={`p-2 rounded-xl border text-xs transition-all flex items-center gap-1 font-semibold ${
              isDark ? 'bg-[#1E2227] border-[#2B323A] text-slate-300 hover:text-white hover:bg-[#282E36]' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden md:inline">Prev</span>
          </button>

          <div className="relative flex-1 sm:w-64 md:w-72">
            <select
              value={selectedMachine.id}
              onChange={(e) => onSelectMachine(e.target.value)}
              className={`w-full appearance-none pl-3 pr-8 py-1.5 rounded-xl text-xs font-bold font-mono border transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#1E2227] border-[#2B323A] text-slate-100 hover:border-[#8B9DFF]/60'
                  : 'bg-white border-slate-300 text-slate-900 shadow-xs hover:border-indigo-400'
              }`}
            >
              {machines.map((m) => (
                <option key={m.id} value={m.id} className={isDark ? 'bg-[#1A1D21] text-slate-100' : 'bg-white text-slate-900'}>
                  {m.model} ({m.machineNumber}) — {m.status}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>

          <button
            onClick={handleNextMachine}
            title="Next Machine"
            className={`p-2 rounded-xl border text-xs transition-all flex items-center gap-1 font-semibold ${
              isDark ? 'bg-[#1E2227] border-[#2B323A] text-slate-300 hover:text-white hover:bg-[#282E36]' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="hidden md:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Layer 2 & 3 & 4 — Machine Hero Cockpit */}
      <div className={`p-6 rounded-2xl border relative overflow-hidden transition-all ${
        isDark
          ? 'bg-gradient-to-br from-[#1A1D21] via-[#16181C] to-[#121417] border-[#2B323A] shadow-xl'
          : 'bg-gradient-to-br from-white via-slate-50/80 to-slate-100/60 border-slate-200/90 shadow-md'
      }`}>
        {/* Accent background mesh */}
        <div className={`absolute -right-12 -top-12 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isDark ? 'bg-[#8B9DFF]/5' : 'bg-indigo-500/5'
        }`} />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Machine Core Identity (Layer 5 Rank 1 & 2) */}
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold border tracking-wide ${
                isDark ? 'bg-[#8ECDF7]/15 border-[#8ECDF7]/40 text-[#8ECDF7]' : 'bg-sky-50 border-sky-300 text-sky-800 font-bold'
              }`}>
                {selectedMachine.machineNumber}
              </span>
              <Badge
                variant={
                  selectedMachine.status === 'OPERATIONAL'
                    ? 'emerald'
                    : selectedMachine.status === 'NEEDS_CALIBRATION'
                    ? 'amber'
                    : 'rose'
                }
                size="md"
              >
                {selectedMachine.status}
              </Badge>
              <span className={`text-xs font-mono flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                SN: <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>{selectedMachine.serialNumber}</strong>
              </span>
            </div>

            <div>
              <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>
                {selectedMachine.model}
              </h1>
              <div className={`flex items-center gap-2 mt-1 text-xs font-medium flex-wrap ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#8B9DFF]" />
                  {selectedMachine.customerName}
                </span>
                <span className="opacity-40">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {selectedMachine.plantName}
                </span>
                <span className="opacity-40">•</span>
                <span className="font-mono text-[11px] opacity-90">{selectedMachine.productionLineName}</span>
              </div>
            </div>

            {/* Quick Machine Summary Telemetry Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className={`p-2.5 rounded-xl border text-xs ${
                isDark ? 'bg-[#111315]/80 border-[#2B323A]' : 'bg-white/80 border-slate-200 shadow-2xs'
              }`}>
                <span className={`text-[10px] uppercase font-mono block ${isDark ? 'text-slate-500' : 'text-slate-600 font-semibold'}`}>Installed</span>
                <span className={`font-mono font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{selectedMachine.installationDate}</span>
              </div>
              <div className={`p-2.5 rounded-xl border text-xs ${
                isDark ? 'bg-[#111315]/80 border-[#2B323A]' : 'bg-white/80 border-slate-200 shadow-2xs'
              }`}>
                <span className={`text-[10px] uppercase font-mono block ${isDark ? 'text-slate-500' : 'text-slate-600 font-semibold'}`}>Next MHC</span>
                <span className={`font-mono font-bold ${isDark ? 'text-[#8ECDF7]' : 'text-sky-800'}`}>{selectedMachine.nextMhcDate}</span>
              </div>
              <div className={`p-2.5 rounded-xl border text-xs ${
                isDark ? 'bg-[#111315]/80 border-[#2B323A]' : 'bg-white/80 border-slate-200 shadow-2xs'
              }`}>
                <span className={`text-[10px] uppercase font-mono block ${isDark ? 'text-slate-500' : 'text-slate-600 font-semibold'}`}>Laser Heads</span>
                <span className={`font-mono font-bold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>{selectedMachine.laserHeads.length} Active Unit(s)</span>
              </div>
              <div className={`p-2.5 rounded-xl border text-xs ${
                isDark ? 'bg-[#111315]/80 border-[#2B323A]' : 'bg-white/80 border-slate-200 shadow-2xs'
              }`}>
                <span className={`text-[10px] uppercase font-mono block ${isDark ? 'text-slate-500' : 'text-slate-600 font-semibold'}`}>MHC Logs</span>
                <span className={`font-mono font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>{machineMhcs.length} Recorded</span>
              </div>
            </div>
          </div>

          {/* Health Gauge & Primary Workflow Actions (Layer 5 Rank 3, 4, 5) */}
          <div className={`flex flex-col sm:flex-row lg:flex-col items-center lg:items-end justify-between gap-5 p-4 lg:p-0 rounded-2xl lg:bg-transparent ${
            isDark ? 'bg-[#111315]/50 border lg:border-0 border-[#2B323A]' : 'bg-white/60 border lg:border-0 border-slate-200'
          }`}>
            {/* Overall Health Score */}
            <div className="flex items-center gap-3">
              <HealthGauge score={selectedMachine.healthScore} label="Overall Health Score" size="lg" />
            </div>

            {/* Primary Actions & Professional Dropdown */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                icon={<Activity className="w-4 h-4" />}
                onClick={() => onOpenMhcForMachine(selectedMachine.id)}
              >
                Execute Health Check
              </Button>

              {/* Machine Actions Menu Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="md"
                  icon={<Settings className="w-4 h-4" />}
                  onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                >
                  Machine Actions
                  <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isActionMenuOpen ? 'rotate-180' : ''}`} />
                </Button>

                {isActionMenuOpen && (
                  <>
                    {/* Invisible backdrop to close dropdown on click outside */}
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setIsActionMenuOpen(false)}
                    />

                    {/* Dropdown Menu Popup */}
                    <div className={`absolute right-0 mt-2 w-56 rounded-2xl border shadow-xl z-30 py-1 overflow-hidden transition-all ${
                      isDark
                        ? 'bg-[#1E2227] border-[#2B323A] text-slate-200 divide-y divide-[#2B323A]'
                        : 'bg-white border-slate-200 text-slate-800 divide-y divide-slate-100 shadow-2xl'
                    }`}>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsActionMenuOpen(false);
                            handleOpenAdd();
                          }}
                          className={`w-full px-4 py-2 text-left text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                            isDark ? 'hover:bg-[#282E36] hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <Plus className="w-4 h-4 text-emerald-500" />
                          + Add New Machine
                        </button>

                        <button
                          onClick={() => {
                            setIsActionMenuOpen(false);
                            handleOpenEdit();
                          }}
                          className={`w-full px-4 py-2 text-left text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                            isDark ? 'hover:bg-[#282E36] hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <Edit3 className="w-4 h-4 text-[#8B9DFF]" />
                          Edit Specifications
                        </button>

                        <button
                          onClick={() => {
                            setIsActionMenuOpen(false);
                            handleOpenRename();
                          }}
                          className={`w-full px-4 py-2 text-left text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                            isDark ? 'hover:bg-[#282E36] hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <Type className="w-4 h-4 text-[#8ECDF7]" />
                          Rename Machine Code
                        </button>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            handleDuplicateMachine();
                          }}
                          className={`w-full px-4 py-2 text-left text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                            isDark ? 'hover:bg-[#282E36] hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <Copy className="w-4 h-4 text-amber-500" />
                          Duplicate Machine Profile
                        </button>

                        <button
                          onClick={() => {
                            handleArchiveMachine();
                          }}
                          className={`w-full px-4 py-2 text-left text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                            isDark ? 'hover:bg-[#282E36] hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <Archive className="w-4 h-4 text-slate-400" />
                          Archive Machine
                        </button>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsActionMenuOpen(false);
                            setIsDeleteModalOpen(true);
                          }}
                          className={`w-full px-4 py-2 text-left text-xs font-semibold flex items-center gap-2.5 text-rose-500 transition-colors ${
                            isDark ? 'hover:bg-rose-950/30' : 'hover:bg-rose-50'
                          }`}
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                          Delete Machine
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
        <div className="space-y-6">
          {/* Hardware & Installation Telemetry */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border ${
            isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <span className={`text-[11px] uppercase font-mono ${isDark ? 'text-slate-400' : 'text-slate-600 font-semibold'}`}>Production Line</span>
              <p className={`text-xs font-bold mt-0.5 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{selectedMachine.productionLineName}</p>
            </div>
            <div>
              <span className={`text-[11px] uppercase font-mono ${isDark ? 'text-slate-400' : 'text-slate-600 font-semibold'}`}>Installation Date</span>
              <p className={`text-xs font-bold mt-0.5 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{selectedMachine.installationDate}</p>
            </div>
            <div>
              <span className={`text-[11px] uppercase font-mono ${isDark ? 'text-slate-400' : 'text-slate-600 font-semibold'}`}>Factory Baseline Date</span>
              <p className={`text-xs font-bold mt-0.5 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{selectedMachine.baselineDate}</p>
            </div>
            <div>
              <span className={`text-[11px] uppercase font-mono ${isDark ? 'text-slate-400' : 'text-slate-600 font-semibold'}`}>Next MHC Target</span>
              <p className={`text-xs font-bold mt-0.5 ${isDark ? 'text-[#8ECDF7]' : 'text-sky-800'}`}>{selectedMachine.nextMhcDate}</p>
            </div>
          </div>

          {/* Laser Heads Telemetry Module */}
          <Card title="Laser Heads Runtime Telemetry & Lifecycle">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedMachine.laserHeads.map((lh) => {
                const percentUsed = Math.round((lh.runningHours / lh.maxRecommendedHours) * 100);
                return (
                  <div key={lh.id} className={`p-4 rounded-xl border space-y-3 ${
                    isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className={`w-4 h-4 ${isDark ? 'text-[#EFCB7A]' : 'text-amber-600'}`} />
                        <span className={`text-xs font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{lh.model}</span>
                      </div>
                      <Badge variant={lh.healthScore >= 90 ? 'emerald' : 'amber'} size="sm">
                        Health: {lh.healthScore}%
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs font-mono">
                      <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
                        <span>Running Hours:</span>
                        <span className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{lh.runningHours} / {lh.maxRecommendedHours} hrs</span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <div
                          className={`h-full rounded-full ${percentUsed > 85 ? (isDark ? 'bg-[#EFCB7A]' : 'bg-amber-500') : (isDark ? 'bg-[#8ECDF7]' : 'bg-sky-600')}`}
                          style={{ width: `${percentUsed}%` }}
                        />
                      </div>
                      <div className={`flex justify-between text-[10px] pt-1 ${isDark ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>
                        <span>Remaining: {lh.remainingHours} hrs</span>
                        <span>Est. Swap: {lh.estimatedReplacementDate}</span>
                      </div>
                    </div>

                    <div className={`grid grid-cols-2 gap-2 text-[11px] font-mono p-2 rounded border ${
                      isDark ? 'bg-[#111315] border-[#2B323A]' : 'bg-white border-slate-200'
                    }`}>
                      <div>
                        <span className={isDark ? 'text-slate-500' : 'text-slate-600 font-medium'}>Power:</span>
                        <span className={`font-bold ml-1 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{lh.powerOutputWatts}W / {lh.ratedPowerWatts}W</span>
                      </div>
                      <div>
                        <span className={isDark ? 'text-slate-500' : 'text-slate-600 font-medium'}>Beam M²:</span>
                        <span className={`font-bold ml-1 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{lh.beamQualityM2}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Consumables Telemetry */}
          <Card title="Active Consumables & Wear Items">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {selectedMachine.consumables.map((con) => (
                <div key={con.id} className={`p-3.5 rounded-xl border space-y-2 ${
                  isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{con.name}</span>
                    <Badge variant={con.status === 'OPTIMAL' ? 'emerald' : con.status === 'WARNING' ? 'amber' : 'rose'} size="sm">
                      {con.status}
                    </Badge>
                  </div>
                  <p className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>P/N: {con.partNumber}</p>

                  <div className="space-y-1 pt-1">
                    <div className={`flex justify-between text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>
                      <span>Life Remaining:</span>
                      <span className={`font-bold ${isDark ? 'text-[#8ECDF7]' : 'text-sky-800'}`}>{con.currentLifePercent}%</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                      <div
                        className={`h-full rounded-full ${con.currentLifePercent < 25 ? (isDark ? 'bg-[#E98A8A]' : 'bg-rose-600') : (isDark ? 'bg-[#8ECDF7]' : 'bg-sky-600')}`}
                        style={{ width: `${con.currentLifePercent}%` }}
                      />
                    </div>
                    <p className={`text-[10px] text-right ${isDark ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>{con.estimatedDaysRemaining} days remaining</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Maintenance & Report History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Machine Health Check Log">
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {machineMhcs.length === 0 ? (
                  <p className={`text-xs py-4 text-center ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>No past MHC records.</p>
                ) : (
                  machineMhcs.map((rec) => (
                    <div key={rec.id} className={`p-2.5 rounded-lg border flex justify-between items-center text-xs ${
                      isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div>
                        <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{rec.date}</span>
                        <p className={`text-[10px] truncate max-w-xs ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>{rec.engineerRemarks}</p>
                      </div>
                      <Badge variant="cyan" size="sm">{rec.healthScores.overallScore}/100</Badge>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card title="Machine Photos & Visual Records">
              <div className="grid grid-cols-2 gap-3">
                {selectedMachine.photos.map((url, i) => (
                  <div key={i} className={`aspect-video rounded-xl overflow-hidden border relative group ${
                    isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-slate-100'
                  }`}>
                    <img src={url} alt={`Machine Photo ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

      {/* 1. Add Machine Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Machine to Fleet Passport"
        subtitle="Register a new machine asset with hardware baseline and customer allocation."
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Machine Model / Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. TRUMPF TruLaser Cell 7040"
                value={addForm.model}
                onChange={(e) => setAddForm({ ...addForm, model: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Machine ID / Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MCH-105"
                value={addForm.machineNumber}
                onChange={(e) => setAddForm({ ...addForm, machineNumber: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Serial Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SN-TRU-904128"
                value={addForm.serialNumber}
                onChange={(e) => setAddForm({ ...addForm, serialNumber: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Customer Allocation
              </label>
              <input
                type="text"
                value={addForm.customerName}
                onChange={(e) => setAddForm({ ...addForm, customerName: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Plant / Facility Name
              </label>
              <input
                type="text"
                value={addForm.plantName}
                onChange={(e) => setAddForm({ ...addForm, plantName: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Production Line
              </label>
              <input
                type="text"
                value={addForm.productionLineName}
                onChange={(e) => setAddForm({ ...addForm, productionLineName: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Initial Status
              </label>
              <select
                value={addForm.status}
                onChange={(e) => setAddForm({ ...addForm, status: e.target.value as Machine['status'] })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="OPERATIONAL">OPERATIONAL</option>
                <option value="NEEDS_CALIBRATION">NEEDS_CALIBRATION</option>
                <option value="MAINTENANCE_DUE">MAINTENANCE_DUE</option>
                <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Initial Health Score (0-100)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={addForm.healthScore}
                onChange={(e) => setAddForm({ ...addForm, healthScore: Number(e.target.value) })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Installation Date
              </label>
              <input
                type="date"
                value={addForm.installationDate}
                onChange={(e) => setAddForm({ ...addForm, installationDate: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Laser Oscillator / Head Model
              </label>
              <input
                type="text"
                value={addForm.laserHeadModel}
                onChange={(e) => setAddForm({ ...addForm, laserHeadModel: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
            >
              Create Machine
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. Edit Machine Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Machine: ${selectedMachine.model}`}
        subtitle={`Update operational parameters and specs for ${selectedMachine.machineNumber}`}
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Machine Model
              </label>
              <input
                type="text"
                required
                value={editForm.model}
                onChange={(e) => setEditForm({ ...editForm, model: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Machine Number
              </label>
              <input
                type="text"
                required
                value={editForm.machineNumber}
                onChange={(e) => setEditForm({ ...editForm, machineNumber: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Serial Number
              </label>
              <input
                type="text"
                required
                value={editForm.serialNumber}
                onChange={(e) => setEditForm({ ...editForm, serialNumber: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Customer Name
              </label>
              <input
                type="text"
                value={editForm.customerName}
                onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Plant Name
              </label>
              <input
                type="text"
                value={editForm.plantName}
                onChange={(e) => setEditForm({ ...editForm, plantName: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Production Line Name
              </label>
              <input
                type="text"
                value={editForm.productionLineName}
                onChange={(e) => setEditForm({ ...editForm, productionLineName: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Status
              </label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Machine['status'] })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="OPERATIONAL">OPERATIONAL</option>
                <option value="NEEDS_CALIBRATION">NEEDS_CALIBRATION</option>
                <option value="MAINTENANCE_DUE">MAINTENANCE_DUE</option>
                <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Health Score (0-100)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={editForm.healthScore}
                onChange={(e) => setEditForm({ ...editForm, healthScore: Number(e.target.value) })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Edit3 className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* 3. Rename Machine Modal */}
      <Modal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        title="Quick Rename Machine"
        subtitle={`Update model designation or machine code for ${selectedMachine.machineNumber}`}
        maxWidth="md"
      >
        <form onSubmit={handleSaveRename} className="space-y-4 p-4">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Machine Model Name
            </label>
            <input
              type="text"
              required
              value={renameForm.model}
              onChange={(e) => setRenameForm({ ...renameForm, model: e.target.value })}
              className={`w-full px-3 py-2 rounded-xl text-xs border ${
                isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Machine Number / Code
            </label>
            <input
              type="text"
              required
              value={renameForm.machineNumber}
              onChange={(e) => setRenameForm({ ...renameForm, machineNumber: e.target.value })}
              className={`w-full px-3 py-2 rounded-xl text-xs border ${
                isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Serial Number
            </label>
            <input
              type="text"
              required
              value={renameForm.serialNumber}
              onChange={(e) => setRenameForm({ ...renameForm, serialNumber: e.target.value })}
              className={`w-full px-3 py-2 rounded-xl text-xs border ${
                isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsRenameModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Type className="w-4 h-4" />}
            >
              Rename Machine
            </Button>
          </div>
        </form>
      </Modal>

      {/* 4. Delete Machine Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Machine"
        subtitle="This action is permanent and cannot be undone."
        maxWidth="md"
      >
        <div className="p-4 space-y-4">
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isDark ? 'bg-rose-950/20 border-rose-800/40 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
            <div className="text-xs space-y-1">
              <p className="font-bold">Are you sure you want to delete this machine?</p>
              <p>
                Target: <strong className="font-mono">{selectedMachine.model} ({selectedMachine.machineNumber})</strong>
              </p>
              <p className="text-[11px] opacity-80 pt-1">
                SN: {selectedMachine.serialNumber} • {selectedMachine.customerName}
              </p>
            </div>
          </div>

          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Deleting this machine will remove its telemetry, active laser head specifications, and consumable records from the active fleet passport.
          </p>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={handleConfirmDelete}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
