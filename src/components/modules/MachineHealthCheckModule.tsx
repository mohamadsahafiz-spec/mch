import React, { useState } from 'react';
import { 
  Activity, 
  Zap, 
  Thermometer, 
  Eye, 
  Sliders, 
  Crosshair, 
  Gauge, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  FileCheck, 
  Upload, 
  Camera, 
  Sparkles 
} from 'lucide-react';
import { Machine, MHCRecord, SubsystemHealth, ProductionReleaseStatus } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { HealthGauge } from '../common/HealthGauge';

interface MachineHealthCheckProps {
  machines: Machine[];
  initialMachineId?: string;
  onSaveMhcRecord: (record: MHCRecord) => void;
  onGenerateReport: (mhcRecord: MHCRecord) => void;
}

export const MachineHealthCheckModule: React.FC<MachineHealthCheckProps> = ({
  machines,
  initialMachineId,
  onSaveMhcRecord,
  onGenerateReport
}) => {
  const [selectedMachineId, setSelectedMachineId] = useState<string>(initialMachineId || machines[0]?.id || '');
  const selectedMachine = machines.find((m) => m.id === selectedMachineId) || machines[0];

  // Subsystem scores state
  const [scores, setScores] = useState<SubsystemHealth>({
    laserHead1: 94,
    laserHead2: 82,
    cooling: 88,
    optics: 95,
    stage: 98,
    agc: 96,
    powerStability: 94,
    beamQuality: 93,
    overallScore: 92
  });

  // Inspection measurements
  const [laserNote, setLaserNote] = useState('All diode laser bars operating within normal drive currents.');
  const [cleanliness, setCleanliness] = useState(96);
  const [opticsNote, setOpticsNote] = useState('Protective window clean. Slight purge gas nozzle particulate.');
  const [coolingFlow, setCoolingFlow] = useState(14.8);
  const [coolingTemp, setCoolingTemp] = useState(21.5);
  const [coolingNote, setCoolingNote] = useState('Chiller flow stable. DI filter cartridge lifecycle nominal.');
  const [measuredWatts, setMeasuredWatts] = useState(248);
  const [targetWatts, setTargetWatts] = useState(250);
  const [beamSizeMm, setBeamSizeMm] = useState(1.12);
  const [focusOffsetMm, setFocusOffsetMm] = useState(0.01);
  const [engineerRemarks, setEngineerRemarks] = useState(
    'Executed full 8-Point Machine Health Check. Laser power stability is within 0.8% of target 250W output. Production release approved.'
  );
  const [recommendations, setRecommendations] = useState<string>(
    '1. Swap DI Water Cooling Filter Cartridge during next planned stop\n2. Re-verify beam focus alignment after 500 runtime hours'
  );
  const [releaseStatus, setReleaseStatus] = useState<ProductionReleaseStatus>('APPROVED');

  // Recalculate overall score whenever subsystem scores change
  const handleScoreChange = (key: keyof SubsystemHealth, val: number) => {
    const updated = { ...scores, [key]: val };
    const values = [
      updated.laserHead1,
      updated.laserHead2,
      updated.cooling,
      updated.optics,
      updated.stage,
      updated.agc,
      updated.powerStability,
      updated.beamQuality
    ];
    const overall = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    setScores({ ...updated, overallScore: overall });
  };

  const handleSaveAndGenerate = () => {
    if (!selectedMachine) return;

    const newRecord: MHCRecord = {
      id: `mhc-rec-${Date.now()}`,
      machineId: selectedMachine.id,
      machineName: selectedMachine.model,
      machineSerialNumber: selectedMachine.serialNumber,
      customerName: selectedMachine.customerName,
      plantName: selectedMachine.plantName,
      engineerName: 'Alex Mercer (Lead Field Engineer)',
      date: new Date().toISOString().split('T')[0],
      healthScores: scores,
      inspectionData: {
        laserInspection: { status: 'PASS', note: laserNote },
        opticsInspection: { status: 'PASS', cleanlinessPercent: cleanliness, note: opticsNote },
        coolingInspection: { status: 'PASS', flowRateLpm: coolingFlow, tempCelsius: coolingTemp, note: coolingNote },
        powerCheck: { measuredWatts, targetWatts, stabilityPercent: Math.round((measuredWatts / targetWatts) * 1000) / 10 },
        beamProfile: { beamSizeMm, focusOffsetMm, symmetryRatio: 0.98 },
        stageCalibration: { xAccuracymm: 0.0011, yAccuracymm: 0.0010, zAccuracymm: 0.0008 },
        agcCalibration: { responseTimeMs: 12, errorMarginPercent: 0.3 },
        beforePhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        afterPhotoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'
      },
      engineerRemarks,
      recommendations: recommendations.split('\n').filter((r) => r.trim().length > 0),
      productionReleaseStatus: releaseStatus,
      isReportGenerated: true
    };

    onSaveMhcRecord(newRecord);
    onGenerateReport(newRecord);
  };

  if (!selectedMachine) return null;

  return (
    <div className="space-y-6 pb-12">
      {/* Target Machine Selection Header */}
      <div className="p-4 rounded-xl bg-[#0d1424] border border-[#1f2e4d] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Active MHC Target Machine</span>
          <select
            value={selectedMachineId}
            onChange={(e) => setSelectedMachineId(e.target.value)}
            className="w-full md:w-auto bg-[#11192b] text-slate-100 text-sm font-bold rounded-lg p-2 border border-[#223252] mt-1"
          >
            {machines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.model} ({m.serialNumber}) — {m.customerName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-400 font-mono">Calculated Health Score</span>
            <p className="text-xl font-extrabold font-mono text-cyan-400">{scores.overallScore} / 100</p>
          </div>
          <Button
            variant="primary"
            size="md"
            icon={<FileCheck className="w-4 h-4" />}
            onClick={handleSaveAndGenerate}
          >
            Save & Generate Executive Report
          </Button>
        </div>
      </div>

      {/* SUBSYSTEM HEALTH SCORE SLIDERS & GAUGES */}
      <Card title="1. Subsystem Health Scoring Grid (0 - 100%)">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: 'laserHead1', label: 'Laser Head 1 Diode Health' },
            { key: 'laserHead2', label: 'Laser Head 2 Diode Health' },
            { key: 'cooling', label: 'Cooling & Thermal Circuit' },
            { key: 'optics', label: 'Optics & Delivery Windows' },
            { key: 'stage', label: 'Galvo & Stage Repeatability' },
            { key: 'agc', label: 'Automatic Gain Control (AGC)' },
            { key: 'powerStability', label: 'Laser Power Output Stability' },
            { key: 'beamQuality', label: 'Beam Profile TEM00 Quality' }
          ].map((item) => {
            const scoreVal = (scores as any)[item.key];
            return (
              <div key={item.key} className="p-3.5 rounded-xl bg-[#090f1c] border border-[#1a2842] space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-300 truncate">{item.label}</span>
                  <span className="font-mono text-cyan-400 font-bold">{scoreVal}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scoreVal}
                  onChange={(e) => handleScoreChange(item.key as any, parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* 8-POINT FIELD INSPECTION ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Laser & Power Check */}
        <Card title="2. Laser Output & Power Check">
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Measured Laser Output (Watts)</label>
                <input
                  type="number"
                  value={measuredWatts}
                  onChange={(e) => setMeasuredWatts(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Rated Target Power (Watts)</label>
                <input
                  type="number"
                  value={targetWatts}
                  onChange={(e) => setTargetWatts(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Laser Inspection Remarks</label>
              <textarea
                value={laserNote}
                onChange={(e) => setLaserNote(e.target.value)}
                rows={2}
                className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
              />
            </div>
          </div>
        </Card>

        {/* Optics & Beam Profiling */}
        <Card title="3. Optics Cleanliness & Beam Profiling">
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Optics Cleanliness (%)</label>
                <input
                  type="number"
                  value={cleanliness}
                  onChange={(e) => setCleanliness(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Beam Waist Size (mm)</label>
                <input
                  type="number"
                  step="0.01"
                  value={beamSizeMm}
                  onChange={(e) => setBeamSizeMm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Optics Diagnostics Notes</label>
              <textarea
                value={opticsNote}
                onChange={(e) => setOpticsNote(e.target.value)}
                rows={2}
                className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
              />
            </div>
          </div>
        </Card>

        {/* Cooling Circuit */}
        <Card title="4. Chiller & Thermal Cooling Circuit">
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Cooling Flow Rate (L/min)</label>
                <input
                  type="number"
                  step="0.1"
                  value={coolingFlow}
                  onChange={(e) => setCoolingFlow(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Coolant Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={coolingTemp}
                  onChange={(e) => setCoolingTemp(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Cooling Circuit Notes</label>
              <textarea
                value={coolingNote}
                onChange={(e) => setCoolingNote(e.target.value)}
                rows={2}
                className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
              />
            </div>
          </div>
        </Card>

        {/* Engineer Remarks & Release Decision */}
        <Card title="5. Engineer Remarks & Production Release Status">
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Production Release Status Decision</label>
              <select
                value={releaseStatus}
                onChange={(e) => setReleaseStatus(e.target.value as ProductionReleaseStatus)}
                className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100 font-bold"
              >
                <option value="APPROVED">APPROVED (Full Operational Release)</option>
                <option value="CONDITIONAL">CONDITIONAL (Conditional Release - Follow Up Required)</option>
                <option value="HALTED">HALTED (Production Line Halted - Critical Defect)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Executive Engineer Remarks</label>
              <textarea
                value={engineerRemarks}
                onChange={(e) => setEngineerRemarks(e.target.value)}
                rows={3}
                className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Action Recommendations (One per line)</label>
              <textarea
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                rows={3}
                className="w-full bg-[#111a2d] border border-slate-700 rounded-lg p-2.5 text-slate-100"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Before / After Photo Comparison */}
      <Card title="6. Before & After Optical Inspection Visual Verification">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-[#090f1c] border border-slate-800 space-y-2">
            <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
              <Camera className="w-4 h-4" /> Before Inspection / Servicing
            </span>
            <div className="aspect-video rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                alt="Before"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#090f1c] border border-slate-800 space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <Camera className="w-4 h-4" /> After Calibration / Service Completion
            </span>
            <div className="aspect-video rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
                alt="After"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
