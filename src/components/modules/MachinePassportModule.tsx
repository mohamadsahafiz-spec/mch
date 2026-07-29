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
  Layers 
} from 'lucide-react';
import { Machine, MHCRecord, ExecutiveReport } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { HealthGauge } from '../common/HealthGauge';

interface MachinePassportProps {
  machines: Machine[];
  selectedMachineId: string;
  onSelectMachine: (id: string) => void;
  mhcRecords: MHCRecord[];
  reports: ExecutiveReport[];
  onOpenMhcForMachine: (machineId: string) => void;
}

export const MachinePassportModule: React.FC<MachinePassportProps> = ({
  machines,
  selectedMachineId,
  onSelectMachine,
  mhcRecords,
  reports,
  onOpenMhcForMachine
}) => {
  const selectedMachine = machines.find((m) => m.id === selectedMachineId) || machines[0];

  if (!selectedMachine) return null;

  const machineMhcs = mhcRecords.filter((r) => r.machineId === selectedMachine.id);
  const machineReports = reports.filter((r) => r.serialNumber === selectedMachine.serialNumber);

  return (
    <div className="space-y-6 pb-12">
      {/* Selector pills across fleet */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {machines.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelectMachine(m.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
              m.id === selectedMachine.id
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow'
                : 'bg-[#0d1424] border-[#1e2d4a] text-slate-400 hover:text-slate-200'
            }`}
          >
            {m.model} ({m.machineNumber})
          </button>
        ))}
      </div>

      {/* Main Passport Header */}
      <Card
        title={
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-800 text-cyan-400 shadow-lg">
                <Cpu className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">{selectedMachine.machineNumber}</span>
                  <Badge variant={selectedMachine.status === 'OPERATIONAL' ? 'emerald' : 'amber'}>
                    {selectedMachine.status}
                  </Badge>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-100 mt-0.5">{selectedMachine.model}</h1>
                <p className="text-xs text-slate-400 font-mono">
                  SN: {selectedMachine.serialNumber} • {selectedMachine.customerName} ({selectedMachine.plantName})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <HealthGauge score={selectedMachine.healthScore} label="Overall Health Score" size="lg" />
              <Button
                variant="primary"
                size="md"
                icon={<Activity className="w-4 h-4" />}
                onClick={() => onOpenMhcForMachine(selectedMachine.id)}
              >
                Execute Health Check
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Hardware & Installation Telemetry */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#090f1c] border border-[#1a2842]">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-mono">Production Line</span>
              <p className="text-xs font-bold text-slate-100 mt-0.5">{selectedMachine.productionLineName}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-mono">Installation Date</span>
              <p className="text-xs font-bold text-slate-100 mt-0.5">{selectedMachine.installationDate}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-mono">Factory Baseline Date</span>
              <p className="text-xs font-bold text-slate-100 mt-0.5">{selectedMachine.baselineDate}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-mono">Next MHC Target</span>
              <p className="text-xs font-bold text-cyan-400 mt-0.5">{selectedMachine.nextMhcDate}</p>
            </div>
          </div>

          {/* Laser Heads Telemetry Module */}
          <Card title="Laser Heads Runtime Telemetry & Lifecycle">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedMachine.laserHeads.map((lh) => {
                const percentUsed = Math.round((lh.runningHours / lh.maxRecommendedHours) * 100);
                return (
                  <div key={lh.id} className="p-4 rounded-xl bg-[#0a101d] border border-[#1d2d4a] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-slate-100">{lh.model}</span>
                      </div>
                      <Badge variant={lh.healthScore >= 90 ? 'emerald' : 'amber'} size="sm">
                        Health: {lh.healthScore}%
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>Running Hours:</span>
                        <span className="text-slate-100 font-bold">{lh.runningHours} / {lh.maxRecommendedHours} hrs</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${percentUsed > 85 ? 'bg-amber-400' : 'bg-cyan-400'}`}
                          style={{ width: `${percentUsed}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                        <span>Remaining: {lh.remainingHours} hrs</span>
                        <span>Est. Swap: {lh.estimatedReplacementDate}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono p-2 bg-[#101728] rounded border border-slate-800">
                      <div>
                        <span className="text-slate-500">Power:</span>
                        <span className="text-slate-200 font-bold ml-1">{lh.powerOutputWatts}W / {lh.ratedPowerWatts}W</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Beam M²:</span>
                        <span className="text-slate-200 font-bold ml-1">{lh.beamQualityM2}</span>
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
                <div key={con.id} className="p-3.5 rounded-xl bg-[#0a101d] border border-[#1d2d4a] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 truncate">{con.name}</span>
                    <Badge variant={con.status === 'OPTIMAL' ? 'emerald' : con.status === 'WARNING' ? 'amber' : 'rose'} size="sm">
                      {con.status}
                    </Badge>
                  </div>
                  <p className="text-[10px] font-mono text-slate-500">P/N: {con.partNumber}</p>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Life Remaining:</span>
                      <span className="text-cyan-400 font-bold">{con.currentLifePercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${con.currentLifePercent < 25 ? 'bg-rose-500' : 'bg-cyan-400'}`}
                        style={{ width: `${con.currentLifePercent}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 text-right">{con.estimatedDaysRemaining} days remaining</p>
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
                  <p className="text-xs text-slate-500 py-4 text-center">No past MHC records.</p>
                ) : (
                  machineMhcs.map((rec) => (
                    <div key={rec.id} className="p-2.5 rounded-lg bg-[#090f1c] border border-[#1a2842] flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-200">{rec.date}</span>
                        <p className="text-[10px] text-slate-400 truncate max-w-xs">{rec.engineerRemarks}</p>
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
                  <div key={i} className="aspect-video rounded-xl overflow-hidden border border-slate-700 bg-slate-900 relative group">
                    <img src={url} alt={`Machine Photo ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};
