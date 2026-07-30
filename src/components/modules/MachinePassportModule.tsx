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
import { useTheme } from '../../context/ThemeContext';

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
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
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
                ? isDark ? 'bg-[#8B9DFF]/20 text-[#8B9DFF] border-[#8B9DFF]/60 font-bold' : 'bg-indigo-50 text-indigo-800 border-indigo-300 shadow-xs font-bold'
                : isDark ? 'bg-[#1A1D21] border-[#2B323A] text-slate-400 hover:text-slate-200' : 'bg-slate-50 border-slate-300/80 text-slate-700 hover:bg-slate-100 font-semibold'
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
              <div className={`p-3 rounded-2xl border font-bold ${
                isDark ? 'bg-[#8ECDF7]/15 border-[#8ECDF7]/30 text-[#8ECDF7]' : 'bg-sky-50 border-sky-200 text-sky-700 shadow-xs'
              }`}>
                <Cpu className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold ${isDark ? 'text-[#8ECDF7]' : 'text-sky-800'}`}>{selectedMachine.machineNumber}</span>
                  <Badge variant={selectedMachine.status === 'OPERATIONAL' ? 'emerald' : 'amber'}>
                    {selectedMachine.status}
                  </Badge>
                </div>
                <h1 className={`text-2xl font-extrabold mt-0.5 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{selectedMachine.model}</h1>
                <p className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
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
      </Card>
    </div>
  );
};
