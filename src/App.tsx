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
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Modules
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

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('mission_control');

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

  const handleSaveMhcRecord = (newMhc: MHCRecord) => {
    const updatedRecords = [newMhc, ...mhcRecords];
    setMhcRecords(updatedRecords);
    StorageService.saveMhcRecords(updatedRecords);

    // Update machine health score
    const updatedMachines = machines.map((m) => {
      if (m.id === newMhc.machineId) {
        return {
          ...m,
          healthScore: newMhc.healthScores.overallScore,
          lastMhcDate: newMhc.date
        };
      }
      return m;
    });
    setMachines(updatedMachines);
    StorageService.saveMachines(updatedMachines);
  };

  const handleGenerateExecutiveReport = (mhcRecord: MHCRecord) => {
    const newReport: ExecutiveReport = {
      id: `rpt-${Date.now()}`,
      reportNumber: `EXECUTIVE-RPT-2026-${Math.floor(100 + Math.random() * 900)}`,
      mhcId: mhcRecord.id,
      customerName: mhcRecord.customerName,
      plantName: mhcRecord.plantName,
      machineModel: mhcRecord.machineName,
      serialNumber: mhcRecord.machineSerialNumber,
      date: mhcRecord.date,
      engineerName: mhcRecord.engineerName,
      executiveSummary: `The ${mhcRecord.machineName} system underwent comprehensive 8-Point Machine Health Check inspection. The machine scored an overall health index of ${mhcRecord.healthScores.overallScore}/100 and has been granted ${mhcRecord.productionReleaseStatus} status for high-precision wafer annealing/welding operations.`,
      overallHealthScore: mhcRecord.healthScores.overallScore,
      productionReleaseStatus: mhcRecord.productionReleaseStatus,
      subsystemHealth: mhcRecord.healthScores,
      laserRuntimeSummary: {
        runningHours: 8420,
        maxHours: 10000,
        head1Health: mhcRecord.healthScores.laserHead1,
        head2Health: mhcRecord.healthScores.laserHead2
      },
      coolingStatus: `Flow rate: ${mhcRecord.inspectionData.coolingInspection.flowRateLpm} LPM, Temp: ${mhcRecord.inspectionData.coolingInspection.tempCelsius}°C. Nominal thermal control.`,
      powerStability: `Measured output ${mhcRecord.inspectionData.powerCheck.measuredWatts}W vs Target ${mhcRecord.inspectionData.powerCheck.targetWatts}W.`,
      beamProfileSummary: `Waist diameter: ${mhcRecord.inspectionData.beamProfile.beamSizeMm}mm, Focus Offset: ${mhcRecord.inspectionData.beamProfile.focusOffsetMm}mm.`,
      powerComparison: {
        baselinePowerWatts: mhcRecord.inspectionData.powerCheck.targetWatts,
        currentPowerWatts: mhcRecord.inspectionData.powerCheck.measuredWatts,
        deltaPercent: Math.round(((mhcRecord.inspectionData.powerCheck.measuredWatts - mhcRecord.inspectionData.powerCheck.targetWatts) / mhcRecord.inspectionData.powerCheck.targetWatts) * 1000) / 10
      },
      engineerRemarks: mhcRecord.engineerRemarks,
      recommendations: mhcRecord.recommendations,
      signatureName: 'Alex Mercer',
      signatureTitle: 'Lead Field Service Engineer',
      signedDate: mhcRecord.date
    };

    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    StorageService.saveReports(updatedReports);

    // Navigate to Reports view
    setActiveTab('reports');
  };

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  const handleAddInvestigation = (newItem: QualityInvestigation) => {
    const updated = [newItem, ...investigations];
    setInvestigations(updated);
    StorageService.saveInvestigations(updated);
  };

  const handleResetData = () => {
    if (confirm('Reset operational system data to initial factory defaults?')) {
      StorageService.resetToDefaults();
      window.location.reload();
    }
  };

  const nextPriorityAction = "Execute DI Water Cooling Filter replacement & Q3 MHC on TRUMPF TruMicro 7000 (MCH-TSMC-01) at TSMC Fab 18A Cleanroom.";

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex">
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
