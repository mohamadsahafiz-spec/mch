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
  ChevronDown,
  Copy,
  Archive,
  MapPin,
  ShieldCheck,
  MoreVertical
} from 'lucide-react';
import { Machine, MHCRecord, ExecutiveReport, Customer } from '../../types';
import { INITIAL_CUSTOMERS } from '../../data/mockData';
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

  // Customer List State
  const [customerList, setCustomerList] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('fsos_customer_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to initial
      }
    }
    return INITIAL_CUSTOMERS;
  });

  // Persist Customer List to LocalStorage
  React.useEffect(() => {
    localStorage.setItem('fsos_customer_list', JSON.stringify(customerList));
  }, [customerList]);

  // Toast / System Alert Notice
  const [systemAlert, setSystemAlert] = useState<string | null>(null);

  const showAlert = (msg: string) => {
    setSystemAlert(msg);
    setTimeout(() => setSystemAlert(null), 4000);
  };

  // Derive aggregated Customer Workspace Accounts
  const customers = React.useMemo(() => {
    const map = new Map<string, {
      id: string;
      name: string;
      site: string;
      contactPerson?: string;
      email?: string;
      phone?: string;
      machineCount: number;
      avgHealth: number;
      pmDueCount: number;
      criticalAlerts: number;
      status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
    }>();

    // Seed customer records from customerList
    customerList.forEach((c) => {
      map.set(c.id, {
        id: c.id,
        name: c.name,
        site: c.industry || 'Global Cleanroom Operations',
        contactPerson: c.contactPerson,
        email: c.email,
        phone: c.phone,
        machineCount: 0,
        avgHealth: 0,
        pmDueCount: 0,
        criticalAlerts: 0,
        status: 'OPTIMAL'
      });
    });

    // Populate machine stats
    machines.forEach((m) => {
      let custId = m.customerId;
      if (!map.has(custId)) {
        const found = Array.from(map.values()).find((c) => c.name === m.customerName);
        if (found) {
          custId = found.id;
        } else {
          custId = m.customerId || `cust-${m.customerName.replace(/\s+/g, '-').toLowerCase()}`;
          map.set(custId, {
            id: custId,
            name: m.customerName,
            site: m.plantName || 'Primary Cleanroom Facility',
            machineCount: 0,
            avgHealth: 0,
            pmDueCount: 0,
            criticalAlerts: 0,
            status: 'OPTIMAL'
          });
        }
      }

      const item = map.get(custId)!;
      item.machineCount += 1;
      item.avgHealth += m.healthScore;
      if (m.status === 'NEEDS_CALIBRATION' || m.status === 'MAINTENANCE_DUE') {
        item.pmDueCount += 1;
      }
      if (m.status === 'OUT_OF_SERVICE' || m.healthScore < 70) {
        item.criticalAlerts += 1;
      }
      if (m.plantName && item.site === 'Global Cleanroom Operations') {
        item.site = m.plantName;
      }
    });

    // Normalize averages and statuses
    map.forEach((item) => {
      if (item.machineCount > 0) {
        item.avgHealth = Math.round(item.avgHealth / item.machineCount);
      } else {
        item.avgHealth = 100;
      }
      if (item.criticalAlerts > 0) {
        item.status = 'CRITICAL';
      } else if (item.pmDueCount > 0 || item.avgHealth < 85) {
        item.status = 'WARNING';
      } else {
        item.status = 'OPTIMAL';
      }
    });

    return Array.from(map.values());
  }, [customerList, machines]);

  // Active Selected Customer State
  const [activeCustomerId, setActiveCustomerId] = useState<string>(() => {
    return selectedMachine?.customerId || customerList[0]?.id || 'cust-1';
  });

  // Sync active customer if selectedMachine changes externally
  React.useEffect(() => {
    if (selectedMachine?.customerId && customerList.some(c => c.id === selectedMachine.customerId)) {
      setActiveCustomerId(selectedMachine.customerId);
    }
  }, [selectedMachine?.id, selectedMachine?.customerId, customerList]);

  const activeCustomer = customers.find((c) => c.id === activeCustomerId) || customers[0];

  // Filter machines for selected customer
  const filteredMachines = machines.filter(
    (m) => m.customerId === activeCustomerId || m.customerName === activeCustomer?.name
  );

  // Handle customer switching
  const handleSelectCustomer = (custId: string) => {
    setActiveCustomerId(custId);
    const targetCust = customers.find((c) => c.id === custId);
    const custMachines = machines.filter(
      (m) => m.customerId === custId || m.customerName === targetCust?.name
    );
    if (custMachines.length > 0) {
      if (!custMachines.some((m) => m.id === selectedMachine?.id)) {
        onSelectMachine(custMachines[0].id);
      }
    }
  };

  // Customer Card Action Dropdown State
  const [activeCustomerMenuId, setActiveCustomerMenuId] = useState<string | null>(null);

  // Customer CRUD Modals State
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);
  const [isRenameCustomerModalOpen, setIsRenameCustomerModalOpen] = useState(false);
  const [isDeleteCustomerModalOpen, setIsDeleteCustomerModalOpen] = useState(false);

  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  // Customer Form State
  const [custForm, setCustForm] = useState({
    name: '',
    industry: '',
    contactPerson: '',
    email: '',
    phone: ''
  });

  // Customer Actions Handlers
  const handleOpenAddCustomer = () => {
    setCustForm({
      name: '',
      industry: 'Semiconductor & Optics Facility',
      contactPerson: 'Lead Operations Engineer',
      email: 'ops@cleanroom.com',
      phone: '+1 (555) 019-2831'
    });
    setIsAddCustomerModalOpen(true);
  };

  const handleSaveAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custForm.name.trim()) return;
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: custForm.name.trim(),
      industry: custForm.industry.trim() || 'Precision Laser Cleanroom',
      contactPerson: custForm.contactPerson.trim() || 'Lead Operations Engineer',
      email: custForm.email.trim() || 'ops@cleanroom.com',
      phone: custForm.phone.trim() || '+1 (555) 019-2831',
      plantsCount: 1,
      activeContractsCount: 1
    };
    setCustomerList((prev) => [...prev, newCust]);
    setActiveCustomerId(newCust.id);
    setIsAddCustomerModalOpen(false);
    showAlert(`Customer account "${newCust.name}" created successfully.`);
  };

  const handleOpenEditCustomer = (c: Customer) => {
    setCustomerToEdit(c);
    setCustForm({
      name: c.name || '',
      industry: c.industry || '',
      contactPerson: c.contactPerson || '',
      email: c.email || '',
      phone: c.phone || ''
    });
    setIsEditCustomerModalOpen(true);
  };

  const handleSaveEditCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerToEdit || !custForm.name.trim()) return;
    const updatedName = custForm.name.trim();
    setCustomerList((prev) =>
      prev.map((c) =>
        c.id === customerToEdit.id
          ? {
              ...c,
              name: updatedName,
              industry: custForm.industry.trim(),
              contactPerson: custForm.contactPerson.trim(),
              email: custForm.email.trim(),
              phone: custForm.phone.trim()
            }
          : c
      )
    );
    setIsEditCustomerModalOpen(false);
    showAlert(`Customer account "${updatedName}" updated successfully.`);
  };

  const handleOpenRenameCustomer = (c: Customer) => {
    setCustomerToEdit(c);
    setCustForm((prev) => ({ ...prev, name: c.name }));
    setIsRenameCustomerModalOpen(true);
  };

  const handleSaveRenameCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerToEdit || !custForm.name.trim()) return;
    const updatedName = custForm.name.trim();
    setCustomerList((prev) =>
      prev.map((c) => (c.id === customerToEdit.id ? { ...c, name: updatedName } : c))
    );
    setIsRenameCustomerModalOpen(false);
    showAlert(`Customer account renamed to "${updatedName}".`);
  };

  const handleOpenDeleteCustomer = (c: Customer) => {
    setCustomerToDelete(c);
    setIsDeleteCustomerModalOpen(true);
  };

  const handleConfirmDeleteCustomer = () => {
    if (!customerToDelete) return;
    const deletedId = customerToDelete.id;
    const deletedName = customerToDelete.name;

    setCustomerList((prev) => prev.filter((c) => c.id !== deletedId));

    if (activeCustomerId === deletedId) {
      const remaining = customerList.filter((c) => c.id !== deletedId);
      if (remaining.length > 0) {
        setActiveCustomerId(remaining[0].id);
      }
    }
    setIsDeleteCustomerModalOpen(false);
    showAlert(`Customer account "${deletedName}" deleted.`);
  };

  const handleArchiveCustomer = (c: Customer) => {
    showAlert(`Customer account "${c.name}" marked as archived (placeholder).`);
  };

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
      {/* System Toast / Alert Banner */}
      {systemAlert && (
        <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-md ${
          isDark ? 'bg-indigo-950/80 border-[#8B9DFF]/40 text-[#8B9DFF]' : 'bg-indigo-50 border-indigo-200 text-indigo-900'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{systemAlert}</span>
          </div>
          <button
            onClick={() => setSystemAlert(null)}
            className="p-1 hover:opacity-75 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Layer 1 — Customer Workspace */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Building2 className={`w-5 h-5 ${isDark ? 'text-[#8B9DFF]' : 'text-indigo-600'}`} />
            <h2 className={`text-sm font-bold font-mono uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              Customer Workspace
            </h2>
            <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
              isDark ? 'bg-[#8B9DFF]/10 text-[#8B9DFF] border-[#8B9DFF]/30' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}>
              {customers.length} Accounts
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono hidden md:inline ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Select Customer Account to inspect plant equipment
            </span>
            <Button
              variant="outline"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={handleOpenAddCustomer}
            >
              Add Customer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {customers.map((c) => {
            const isSelected = c.id === activeCustomerId;
            const isMenuOpen = activeCustomerMenuId === c.id;
            return (
              <div
                key={c.id}
                onClick={() => handleSelectCustomer(c.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 relative group cursor-pointer ${
                  isSelected
                    ? isDark
                      ? 'bg-gradient-to-br from-[#1E2228] to-[#16181C] border-[#8B9DFF] shadow-lg shadow-[#8B9DFF]/10 ring-1 ring-[#8B9DFF]/50'
                      : 'bg-white border-indigo-600 shadow-md ring-1 ring-indigo-500/30'
                    : isDark
                      ? 'bg-[#14171A] border-[#2B323A] hover:bg-[#1A1D21] hover:border-slate-600'
                      : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                {isSelected && (
                  <div className={`absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-20 rounded-tr-2xl overflow-hidden ${
                    isDark ? 'bg-[#8B9DFF] blur-xl' : 'bg-indigo-500 blur-xl'
                  }`} />
                )}

                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1 pr-1">
                    <h3 className={`text-sm font-bold truncate ${
                      isSelected
                        ? isDark ? 'text-white' : 'text-slate-900'
                        : isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      {c.name}
                    </h3>
                    <p className={`text-xs flex items-center gap-1 font-medium mt-0.5 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{c.site}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md border ${
                      c.status === 'OPTIMAL'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                        : c.status === 'WARNING'
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                    }`}>
                      {c.status}
                    </span>

                    {/* Customer Overflow Menu Button (⋮) */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCustomerMenuId(isMenuOpen ? null : c.id);
                        }}
                        className={`p-1 rounded-lg border transition-colors ${
                          isDark
                            ? 'bg-[#1E2227] border-[#2B323A] text-slate-300 hover:text-white hover:bg-[#282E36]'
                            : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                        title="Customer Actions"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {/* Customer Actions Dropdown Menu */}
                      {isMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-20"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveCustomerMenuId(null);
                            }}
                          />
                          <div
                            className={`absolute right-0 top-8 w-48 rounded-xl border shadow-xl z-30 py-1 text-xs font-semibold ${
                              isDark
                                ? 'bg-[#1E2227] border-[#2B323A] text-slate-200 divide-y divide-[#2B323A]'
                                : 'bg-white border-slate-200 text-slate-800 divide-y divide-slate-100 shadow-xl'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="py-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveCustomerMenuId(null);
                                  handleOpenEditCustomer(c);
                                }}
                                className={`w-full px-3 py-2 text-left flex items-center gap-2 transition-colors ${
                                  isDark ? 'hover:bg-[#282E36] hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
                                }`}
                              >
                                <Edit3 className="w-3.5 h-3.5 text-[#8B9DFF]" />
                                Edit Customer
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveCustomerMenuId(null);
                                  handleOpenRenameCustomer(c);
                                }}
                                className={`w-full px-3 py-2 text-left flex items-center gap-2 transition-colors ${
                                  isDark ? 'hover:bg-[#282E36] hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
                                }`}
                              >
                                <Type className="w-3.5 h-3.5 text-[#8ECDF7]" />
                                Rename Customer
                              </button>
                            </div>
                            <div className="py-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveCustomerMenuId(null);
                                  handleArchiveCustomer(c);
                                }}
                                className={`w-full px-3 py-2 text-left flex items-center gap-2 transition-colors ${
                                  isDark ? 'hover:bg-[#282E36] hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
                                }`}
                              >
                                <Archive className="w-3.5 h-3.5 text-amber-500" />
                                Archive Account
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveCustomerMenuId(null);
                                  handleOpenDeleteCustomer(c);
                                }}
                                className={`w-full px-3 py-2 text-left flex items-center gap-2 text-rose-500 transition-colors ${
                                  isDark ? 'hover:bg-rose-500/10' : 'hover:bg-rose-50'
                                }`}
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                Delete Customer
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`pt-2.5 mt-2 border-t flex items-center justify-between text-xs font-mono ${
                  isDark ? 'border-[#2B323A]/60 text-slate-400' : 'border-slate-200 text-slate-600'
                }`}>
                  <span className="flex items-center gap-1 font-semibold">
                    <Cpu className="w-3.5 h-3.5 text-[#8B9DFF]" />
                    {c.machineCount} {c.machineCount === 1 ? 'Asset' : 'Assets'}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-500">{c.avgHealth}% Health</span>
                    {c.pmDueCount > 0 ? (
                      <span className="text-amber-500 font-bold">{c.pmDueCount} PM Due</span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">0 Alerts</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Part 4 — Add Customer Card */}
          <button
            type="button"
            onClick={handleOpenAddCustomer}
            className={`p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 min-h-[110px] transition-all group ${
              isDark
                ? 'border-[#2B323A] hover:border-[#8B9DFF] bg-[#14171A]/40 hover:bg-[#1A1D21]'
                : 'border-slate-300 hover:border-indigo-500 bg-slate-50/50 hover:bg-white'
            }`}
          >
            <div className={`p-2 rounded-full transition-transform group-hover:scale-110 ${
              isDark ? 'bg-[#8B9DFF]/10 text-[#8B9DFF]' : 'bg-indigo-50 text-indigo-600'
            }`}>
              <Plus className="w-4 h-4" />
            </div>
            <span className={`text-xs font-bold font-mono ${
              isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-indigo-600'
            }`}>
              + Add Customer
            </span>
          </button>
        </div>
      </div>

      {/* Layer 2 — Machine Workspace */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Cpu className={`w-4 h-4 ${isDark ? 'text-[#8B9DFF]' : 'text-indigo-600'}`} />
            <h3 className={`text-xs font-bold font-mono uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Managed Laser Fleet
            </h3>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
              isDark ? 'bg-[#8B9DFF]/10 text-[#8B9DFF] border-[#8B9DFF]/30' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}>
              {activeCustomer?.name}
            </span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
              isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              {filteredMachines.length} {filteredMachines.length === 1 ? 'Machine' : 'Machines'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${
              isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {filteredMachines.filter(m => m.status === 'OPERATIONAL').length}/{filteredMachines.length} Operational
            </span>
            <span className={`text-[11px] hidden md:inline ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {activeCustomer?.site || 'Cleanroom Site'}
            </span>
          </div>
        </div>

        {filteredMachines.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Card className="p-6 text-center col-span-full sm:col-span-1 lg:col-span-2">
              <Cpu className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                No laser machines assigned to {activeCustomer?.name}.
              </p>
            </Card>

            {/* Add Machine Card */}
            <button
              type="button"
              onClick={handleOpenAdd}
              className={`p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 min-h-[110px] transition-all group ${
                isDark
                  ? 'border-[#2B323A] hover:border-[#8B9DFF] bg-[#14171A]/40 hover:bg-[#1A1D21]'
                  : 'border-slate-300 hover:border-indigo-500 bg-slate-50/50 hover:bg-white'
              }`}
            >
              <div className={`p-2 rounded-full transition-transform group-hover:scale-110 ${
                isDark ? 'bg-[#8B9DFF]/10 text-[#8B9DFF]' : 'bg-indigo-50 text-indigo-600'
              }`}>
                <Plus className="w-4 h-4" />
              </div>
              <span className={`text-xs font-bold font-mono ${
                isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-indigo-600'
              }`}>
                + Add Machine
              </span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredMachines.map((m) => {
              const isSelected = m.id === selectedMachine?.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onSelectMachine(m.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 relative group cursor-pointer ${
                    isSelected
                      ? isDark
                        ? 'bg-gradient-to-br from-[#1E2228] to-[#16181C] border-[#8B9DFF] shadow-lg shadow-[#8B9DFF]/10 ring-1 ring-[#8B9DFF]/50'
                        : 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                      : isDark
                        ? 'bg-[#14171A] border-[#2B323A] hover:bg-[#1A1D21] hover:border-slate-600'
                        : 'bg-slate-50/80 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                      isSelected
                        ? isDark ? 'bg-[#8B9DFF]/20 text-[#8B9DFF] border-[#8B9DFF]/40' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {m.machineNumber}
                    </span>
                    <Badge
                      variant={
                        m.status === 'OPERATIONAL'
                          ? 'emerald'
                          : m.status === 'NEEDS_CALIBRATION'
                            ? 'amber'
                            : m.status === 'MAINTENANCE_DUE'
                              ? 'purple'
                              : 'rose'
                      }
                    >
                      {m.status}
                    </Badge>
                  </div>

                  <h4 className={`text-xs font-bold truncate ${
                    isSelected
                      ? isDark ? 'text-white' : 'text-slate-900'
                      : isDark ? 'text-slate-300' : 'text-slate-800'
                  }`}>
                    {m.model}
                  </h4>

                  <div className={`flex items-center justify-between mt-2.5 pt-2 border-t text-[11px] font-mono ${
                    isDark ? 'border-[#2B323A]/60' : 'border-slate-200'
                  }`}>
                    <span className={`font-medium truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {m.plantName}
                    </span>
                    <span className={`font-bold shrink-0 ${
                      m.healthScore >= 90 ? 'text-emerald-500' : m.healthScore >= 75 ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      {m.healthScore}% Health
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Part 1 — Add Machine Card */}
            <button
              type="button"
              onClick={handleOpenAdd}
              className={`p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 min-h-[110px] transition-all group ${
                isDark
                  ? 'border-[#2B323A] hover:border-[#8B9DFF] bg-[#14171A]/40 hover:bg-[#1A1D21]'
                  : 'border-slate-300 hover:border-indigo-500 bg-slate-50/50 hover:bg-white'
              }`}
            >
              <div className={`p-2 rounded-full transition-transform group-hover:scale-110 ${
                isDark ? 'bg-[#8B9DFF]/10 text-[#8B9DFF]' : 'bg-indigo-50 text-indigo-600'
              }`}>
                <Plus className="w-4 h-4" />
              </div>
              <span className={`text-xs font-bold font-mono ${
                isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-indigo-600'
              }`}>
                + Add Machine
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Layer 2 & 3 & 4 — Machine Hero Cockpit (MP-001 Clipping Fix: container uses relative without overflow-hidden) */}
      <div className={`p-6 rounded-2xl border relative transition-all ${
        isDark
          ? 'bg-gradient-to-br from-[#1A1D21] via-[#16181C] to-[#121417] border-[#2B323A] shadow-xl'
          : 'bg-gradient-to-br from-white via-slate-50/80 to-slate-100/60 border-slate-200/90 shadow-md'
      }`}>
        {/* Accent background mesh wrapper with overflow-hidden */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className={`absolute -right-12 -top-12 w-64 h-64 rounded-full blur-3xl ${
            isDark ? 'bg-[#8B9DFF]/5' : 'bg-indigo-500/5'
          }`} />
        </div>

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
                <span className={`font-mono font-bold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>{selectedMachine.laserHeads?.length || 0} Active Unit(s)</span>
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
              {(selectedMachine.laserHeads || []).map((lh) => {
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
              {(selectedMachine.consumables || []).map((con) => (
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
                {(selectedMachine.photos || []).map((url, i) => (
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

      {/* 5. Add Customer Modal */}
      <Modal
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        title="Create Customer Account"
        subtitle="Add a new customer account to FSOS Customer Workspace"
        maxWidth="md"
      >
        <form onSubmit={handleSaveAddCustomer} className="space-y-4 p-4">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Customer Account Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., TSMC Fab 21 Cleanroom"
              value={custForm.name}
              onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
              className={`w-full px-3 py-2 rounded-xl text-xs border ${
                isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Facility / Industry Site
            </label>
            <input
              type="text"
              placeholder="e.g., EUV Wafer Dicing Facility"
              value={custForm.industry}
              onChange={(e) => setCustForm({ ...custForm, industry: e.target.value })}
              className={`w-full px-3 py-2 rounded-xl text-xs border ${
                isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Contact Person
              </label>
              <input
                type="text"
                placeholder="Dr. Robert Chen"
                value={custForm.contactPerson}
                onChange={(e) => setCustForm({ ...custForm, contactPerson: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Contact Email
              </label>
              <input
                type="email"
                placeholder="a.rivera@fab.com"
                value={custForm.email}
                onChange={(e) => setCustForm({ ...custForm, email: e.target.value })}
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
              onClick={() => setIsAddCustomerModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* 6. Edit Customer Modal */}
      <Modal
        isOpen={isEditCustomerModalOpen}
        onClose={() => setIsEditCustomerModalOpen(false)}
        title="Edit Customer Details"
        subtitle={`Modify account information for ${customerToEdit?.name}`}
        maxWidth="md"
      >
        <form onSubmit={handleSaveEditCustomer} className="space-y-4 p-4">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Customer Account Name *
            </label>
            <input
              type="text"
              required
              value={custForm.name}
              onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
              className={`w-full px-3 py-2 rounded-xl text-xs border ${
                isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Facility / Industry Site
            </label>
            <input
              type="text"
              value={custForm.industry}
              onChange={(e) => setCustForm({ ...custForm, industry: e.target.value })}
              className={`w-full px-3 py-2 rounded-xl text-xs border ${
                isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Contact Person
              </label>
              <input
                type="text"
                value={custForm.contactPerson}
                onChange={(e) => setCustForm({ ...custForm, contactPerson: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Contact Email
              </label>
              <input
                type="email"
                value={custForm.email}
                onChange={(e) => setCustForm({ ...custForm, email: e.target.value })}
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
              onClick={() => setIsEditCustomerModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Edit3 className="w-4 h-4" />}
            >
              Save Details
            </Button>
          </div>
        </form>
      </Modal>

      {/* 7. Rename Customer Modal */}
      <Modal
        isOpen={isRenameCustomerModalOpen}
        onClose={() => setIsRenameCustomerModalOpen(false)}
        title="Rename Customer Account"
        subtitle={`Update account name for ${customerToEdit?.name}`}
        maxWidth="sm"
      >
        <form onSubmit={handleSaveRenameCustomer} className="space-y-4 p-4">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              New Customer Name
            </label>
            <input
              type="text"
              required
              value={custForm.name}
              onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
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
              onClick={() => setIsRenameCustomerModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Type className="w-4 h-4" />}
            >
              Rename Customer
            </Button>
          </div>
        </form>
      </Modal>

      {/* 8. Delete Customer Confirmation Modal */}
      <Modal
        isOpen={isDeleteCustomerModalOpen}
        onClose={() => setIsDeleteCustomerModalOpen(false)}
        title="Confirm Delete Customer Account"
        subtitle="This action will remove the customer account."
        maxWidth="md"
      >
        <div className="p-4 space-y-4">
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isDark ? 'bg-rose-950/20 border-rose-800/40 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
            <div className="text-xs space-y-1">
              <p className="font-bold">Are you sure you want to delete this customer account?</p>
              <p>
                Account: <strong className="font-mono">{customerToDelete?.name}</strong>
              </p>
              <p className="text-[11px] opacity-80 pt-1">
                Facility: {customerToDelete?.industry || 'Cleanroom Operations'}
              </p>
            </div>
          </div>

          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Deleting this customer account will remove it from the Customer Workspace navigation hierarchy.
          </p>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteCustomerModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={handleConfirmDeleteCustomer}
            >
              Confirm Delete Customer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
