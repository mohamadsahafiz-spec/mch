/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  NavigationTab, 
  Customer, 
  Plant, 
  ProductionLine, 
  Machine, 
  Contract, 
  ExecutionScheduleItem, 
  MHCRecord, 
  ExecutiveReport, 
  FieldEngineerTask, 
  AlertItem, 
  QualityInvestigation, 
  BaselineCheck 
} from './types';
import { StorageService } from './utils/persistence';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Modules
import { StartPageModule } from './components/modules/StartPageModule';
import { WorkflowGuideModule } from './components/modules/WorkflowGuideModule';
import { MissionControl } from './components/modules/MissionControl';
import { ContractsModule } from './components/modules/ContractsModule';
import { ExecutionPlannerModule } from './components/modules/ExecutionPlannerModule';
import { CustomersPlantsModule } from './components/modules/CustomersPlantsModule';
import { MachinePassportModule } from './components/modules/MachinePassportModule';
import { MachineHealthCheckModule } from './components/modules/MachineHealthCheckModule';
import { LaserCalibrationModule } from './components/modules/LaserCalibrationModule';
import { BaselineCheckModule } from './components/modules/BaselineCheckModule';
import { QualityInvestigationModule } from './components/modules/QualityInvestigationModule';
import { ReportsModule } from './components/modules/ReportsModule';
import { AnalyticsModule } from './components/modules/AnalyticsModule';
import { KnowledgeBaseModule } from './components/modules/KnowledgeBaseModule';
import { SettingsModule } from './components/modules/SettingsModule';

function AppLayout() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('start_page');
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  // Operational State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [lines, setLines] = useState<ProductionLine[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [schedule, setSchedule] = useState<ExecutionScheduleItem[]>([]);
  const [mhcRecords, setMhcRecords] = useState<MHCRecord[]>([]);
  const [reports, setReports] = useState<ExecutiveReport[]>([]);
  const [tasks, setTasks] = useState<FieldEngineerTask[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [investigations, setInvestigations] = useState<QualityInvestigation[]>([]);
  const [baselines, setBaselines] = useState<BaselineCheck[]>([]);

  // Selected Machine context
  const [selectedMachineId, setSelectedMachineId] = useState<string>('mch-101');

  // Load state from StorageService on mount
  useEffect(() => {
    setCustomers(StorageService.getCustomers());
    setPlants(StorageService.getPlants());
    setLines(StorageService.getLines());
    setMachines(StorageService.getMachines());
    setContracts(StorageService.getContracts());
    setSchedule(StorageService.getSchedule());
    setMhcRecords(StorageService.getMhcRecords());
    setReports(StorageService.getReports());
    setTasks(StorageService.getTasks());
    setAlerts(StorageService.getAlerts());
    setInvestigations(StorageService.getInvestigations());
    setBaselines(StorageService.getBaselines());
  }, []);

  // Sync to persistence helpers
  const handleUpdateContract = (updatedContract: Contract) => {
    const updated = contracts.map((c) => (c.id === updatedContract.id ? updatedContract : c));
    setContracts(updated);
    StorageService.saveContracts(updated);
  };

  const handleAddScheduleItem = (newItem: ExecutionScheduleItem) => {
    const updated = [newItem, ...schedule];
    setSchedule(updated);
    StorageService.saveSchedule(updated);
  };

  const handleUpdateScheduleItem = (updatedItem: ExecutionScheduleItem) => {
    const updated = schedule.map((s) => (s.id === updatedItem.id ? updatedItem : s));
    setSchedule(updated);
    StorageService.saveSchedule(updated);
  };

  const handleDeleteScheduleItem = (itemId: string) => {
    const updated = schedule.filter((s) => s.id !== itemId);
    setSchedule(updated);
    StorageService.saveSchedule(updated);
  };

  const handleSaveMhcRecord = (record: MHCRecord) => {
    const updated = [record, ...mhcRecords];
    setMhcRecords(updated);
    StorageService.saveMhcRecords(updated);
  };

  const handleGenerateExecutiveReport = (report: ExecutiveReport) => {
    const updated = [report, ...reports];
    setReports(updated);
    StorageService.saveReports(updated);
  };

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  const handleAddInvestigation = (inv: QualityInvestigation) => {
    const updated = [inv, ...investigations];
    setInvestigations(updated);
    StorageService.saveInvestigations(updated);
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all operational data to factory defaults?")) {
      StorageService.resetToDefaults();
      window.location.reload();
    }
  };

  const nextPriorityAction = "Execute DI Water Cooling Filter replacement & Q3 MHC on TRUMPF TruMicro 7000 (MCH-TSMC-01) at TSMC Fab 18A Cleanroom.";

  return (
    <div className={`min-h-screen flex transition-colors duration-250 ${
      isDark ? 'bg-[#111315] text-[#F3F4F6]' : 'bg-[#F8F9FA] text-[#0F172A]'
    }`}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        urgentAlertsCount={alerts.filter((a) => a.severity === 'CRITICAL').length}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          alerts={alerts}
          onOpenQuickMhc={() => setActiveTab('mhc')}
          nextPriorityAction={nextPriorityAction}
        />

        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === 'start_page' && (
            <StartPageModule
              onNavigate={setActiveTab}
              schedule={schedule}
              machines={machines}
              tasks={tasks}
              onSelectMachine={(id) => {
                setSelectedMachineId(id);
                setActiveTab('machines');
              }}
            />
          )}

          {activeTab === 'workflow_guide' && (
            <WorkflowGuideModule
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'mission_control' && (
            <MissionControl
              tasks={tasks}
              onToggleTask={handleToggleTask}
              alerts={alerts}
              contracts={contracts}
              machines={machines}
              schedule={schedule}
              recentMhcs={mhcRecords}
              onNavigate={setActiveTab}
              onOpenQuickMhc={() => setActiveTab('mhc')}
              onSelectMachine={(id) => {
                setSelectedMachineId(id);
                setActiveTab('machines');
              }}
            />
          )}

          {activeTab === 'contracts' && (
            <ContractsModule
              contracts={contracts}
              onUpdateContract={handleUpdateContract}
              onOpenPlannerForContract={() => setActiveTab('planner')}
            />
          )}

          {activeTab === 'planner' && (
            <ExecutionPlannerModule
              schedule={schedule}
              contracts={contracts}
              machines={machines}
              onAddScheduleItem={handleAddScheduleItem}
              onUpdateScheduleItem={handleUpdateScheduleItem}
              onDeleteScheduleItem={handleDeleteScheduleItem}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersPlantsModule
              customers={customers}
              plants={plants}
              lines={lines}
              machines={machines}
              onSelectMachine={(id) => {
                setSelectedMachineId(id);
                setActiveTab('machines');
              }}
            />
          )}

          {activeTab === 'machines' && (
            <MachinePassportModule
              machines={machines}
              selectedMachineId={selectedMachineId}
              onSelectMachine={setSelectedMachineId}
              mhcRecords={mhcRecords}
              reports={reports}
              onOpenMhcForMachine={(id) => {
                setSelectedMachineId(id);
                setActiveTab('mhc');
              }}
            />
          )}

          {activeTab === 'mhc' && (
            <MachineHealthCheckModule
              machines={machines}
              initialMachineId={selectedMachineId}
              onSaveMhcRecord={handleSaveMhcRecord}
              onGenerateReport={handleGenerateExecutiveReport}
            />
          )}

          {activeTab === 'laser_calibration' && (
            <LaserCalibrationModule machines={machines} />
          )}

          {activeTab === 'baseline_check' && (
            <BaselineCheckModule baselines={baselines} machines={machines} />
          )}

          {activeTab === 'quality_investigation' && (
            <QualityInvestigationModule
              investigations={investigations}
              machines={machines}
              onAddInvestigation={handleAddInvestigation}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsModule reports={reports} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsModule machines={machines} />
          )}

          {activeTab === 'knowledge_base' && (
            <KnowledgeBaseModule />
          )}

          {activeTab === 'settings' && (
            <SettingsModule onResetData={handleResetData} />
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}
