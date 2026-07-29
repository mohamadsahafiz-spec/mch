import React from 'react';
import { 
  FieldEngineerTask, 
  AlertItem, 
  Contract, 
  Machine, 
  ExecutionScheduleItem, 
  MHCRecord, 
  NavigationTab 
} from '../../types';
import { ActiveWorkOrderHeader } from '../mission/ActiveWorkOrderHeader';
import { InspectionStageStepper } from '../mission/InspectionStageStepper';
import { OperationalPrerequisites } from '../mission/OperationalPrerequisites';
import { WorkOrderChecklist } from '../mission/WorkOrderChecklist';
import { TodayActivityLog } from '../mission/TodayActivityLog';

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
  return (
    <div className="space-y-6 pb-12 transition-all duration-300">
      {/* 1. Today's Primary Active Work Order Header (Customer, Machine, Purpose, Current Stage, Direct Next Action) */}
      <ActiveWorkOrderHeader 
        onNavigate={onNavigate}
        onOpenQuickMhc={onOpenQuickMhc}
      />

      {/* 2. Sequential 5-Stage Inspection Stepper with Embedded Contextual AI Guidance */}
      <InspectionStageStepper 
        onNavigate={onNavigate}
        onOpenQuickMhc={onOpenQuickMhc}
      />

      {/* 3. Operational & Cleanroom Prerequisites + Active Machine Telemetry Risks */}
      <OperationalPrerequisites 
        alerts={alerts}
      />

      {/* 4. Today's Work Order Sequential Execution Checklist */}
      <WorkOrderChecklist 
        tasks={tasks}
        onToggleTask={onToggleTask}
        onNavigate={onNavigate}
      />

      {/* 5. Today's On-Site Activity Audit Trace */}
      <TodayActivityLog 
        recentMhcs={recentMhcs}
        onNavigate={onNavigate}
      />
    </div>
  );
};
