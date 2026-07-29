import React, { useState } from 'react';
import { Zap, Activity, Gauge, Sliders, CheckCircle2, RotateCcw } from 'lucide-react';
import { Machine } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface LaserCalibrationProps {
  machines: Machine[];
}

export const LaserCalibrationModule: React.FC<LaserCalibrationProps> = ({ machines }) => {
  const [selectedMachineId, setSelectedMachineId] = useState<string>(machines[0]?.id || '');
  const selectedMachine = machines.find((m) => m.id === selectedMachineId) || machines[0];

  const [currentWatts, setCurrentWatts] = useState(248);
  const [targetWatts, setTargetWatts] = useState(250);
  const [galvoGainX, setGalvoGainX] = useState(1.002);
  const [galvoGainY, setGalvoGainY] = useState(0.998);
  const [calibrated, setCalibrated] = useState(false);

  const handleCalibrate = () => {
    setCurrentWatts(targetWatts);
    setCalibrated(true);
    setTimeout(() => setCalibrated(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Machine Selector */}
      <div className="p-4 rounded-xl bg-[#0d1424] border border-[#1f2e4d] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Laser Calibration Workbench</span>
          <h2 className="text-lg font-bold text-slate-100">{selectedMachine.model} ({selectedMachine.serialNumber})</h2>
        </div>

        <select
          value={selectedMachineId}
          onChange={(e) => setSelectedMachineId(e.target.value)}
          className="bg-[#11192b] text-slate-100 text-xs rounded-lg p-2 border border-[#223252]"
        >
          {machines.map((m) => (
            <option key={m.id} value={m.id}>{m.model} ({m.machineNumber})</option>
          ))}
        </select>
      </div>

      {/* Interactive Calibration Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Laser Power Output & Offset Recalibration">
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#090f1c] border border-slate-800">
              <div>
                <span className="text-slate-400 block font-mono">Current Measured:</span>
                <span className="text-lg font-bold font-mono text-cyan-400">{currentWatts} W</span>
              </div>
              <div>
                <span className="text-slate-400 block font-mono">Target Nominal:</span>
                <span className="text-lg font-bold font-mono text-slate-100">{targetWatts} W</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Adjust Laser Driver Power Offset Target (W)</label>
              <input
                type="number"
                value={targetWatts}
                onChange={(e) => setTargetWatts(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono font-bold"
              />
            </div>

            <Button
              variant="primary"
              size="md"
              icon={<Zap className="w-4 h-4" />}
              onClick={handleCalibrate}
              className="w-full"
            >
              Execute Power Offset Calibration
            </Button>

            {calibrated && (
              <p className="text-xs text-emerald-400 font-mono font-bold text-center bg-emerald-950/40 p-2 rounded border border-emerald-800/60">
                ✓ Laser power offset calibrated to {targetWatts}W!
              </p>
            )}
          </div>
        </Card>

        <Card title="Galvo Scanning Motor Gains & Beam Alignment">
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-slate-400">Galvo X Motor Gain Offset:</span>
                <span className="text-cyan-400 font-bold">{galvoGainX}</span>
              </div>
              <input
                type="range"
                min="0.95"
                max="1.05"
                step="0.001"
                value={galvoGainX}
                onChange={(e) => setGalvoGainX(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-slate-400">Galvo Y Motor Gain Offset:</span>
                <span className="text-cyan-400 font-bold">{galvoGainY}</span>
              </div>
              <input
                type="range"
                min="0.95"
                max="1.05"
                step="0.001"
                value={galvoGainY}
                onChange={(e) => setGalvoGainY(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-lg bg-[#090f1c] border border-slate-800 space-y-1 font-mono text-[11px]">
              <p className="text-slate-400">Calculated Beam Spot Symmetry Ratio: <strong className="text-emerald-400">0.982 (TEM00)</strong></p>
              <p className="text-slate-400">Galvanometer Response Latency: <strong className="text-slate-100">12 µs</strong></p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
