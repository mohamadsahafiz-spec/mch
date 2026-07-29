import React from 'react';
import { SlidersHorizontal, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';
import { BaselineCheck, Machine } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface BaselineCheckProps {
  baselines: BaselineCheck[];
  machines: Machine[];
}

export const BaselineCheckModule: React.FC<BaselineCheckProps> = ({ baselines, machines }) => {
  return (
    <div className="space-y-6 pb-12">
      <Card title="Factory Baseline Verification & Operational Drift Tracking">
        <div className="space-y-4">
          {baselines.map((bl) => (
            <div key={bl.id} className="p-4 rounded-xl bg-[#090f1c] border border-[#1a2842] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{bl.machineName}</h3>
                  <p className="text-xs text-slate-400 font-mono">Captured: {bl.date} by {bl.engineerName}</p>
                </div>
                <Badge variant={bl.passed ? 'emerald' : 'rose'}>{bl.passed ? 'BASELINE PASSED' : 'DRIFT EXCEEDED'}</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-[#0d1424] text-xs font-mono">
                <div>
                  <span className="text-slate-500 block">Baseline Power</span>
                  <span className="font-bold text-slate-200">{bl.laserPowerBaselineWatts} W</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Beam Diameter</span>
                  <span className="font-bold text-slate-200">{bl.beamDiameterMm} mm</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Cooling Flow Rate</span>
                  <span className="font-bold text-slate-200">{bl.coolingFlowRateLpm} LPM</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Stage Repeatability</span>
                  <span className="font-bold text-slate-200">±{bl.stageRepeatabilityMm} mm</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 italic">"{bl.notes}"</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
