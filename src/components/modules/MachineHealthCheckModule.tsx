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
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Clock,
  Printer,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  FileText,
  X,
  Check
} from 'lucide-react';
import { Machine, MHCRecord, ExecutiveReport, Customer } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { HealthGauge } from '../common/HealthGauge';
import { useTheme } from '../../context/ThemeContext';

interface LaserHeadReading {
  id: string;
  name: string;
  serialNumber: string;
  ratedWatts: number;
  measuredWatts: number;
  stabilityPercent: number;
  status: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  notes: string;
}

interface MachineHealthCheckProps {
  machines: Machine[];
  initialMachineId?: string;
  onSaveMhcRecord: (record: MHCRecord) => void;
  onGenerateReport: (report: ExecutiveReport) => void;
}

export const MachineHealthCheckModule: React.FC<MachineHealthCheckProps> = ({
  machines,
  initialMachineId,
  onSaveMhcRecord,
  onGenerateReport
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  // Selected Machine state
  const [selectedMachineId, setSelectedMachineId] = useState<string>(
    initialMachineId || machines[0]?.id || ''
  );
  const selectedMachine = machines.find((m) => m.id === selectedMachineId) || machines[0];

  // System Toast / Notification
  const [systemAlert, setSystemAlert] = useState<string | null>(null);
  const showAlert = (msg: string) => {
    setSystemAlert(msg);
    setTimeout(() => setSystemAlert(null), 4000);
  };

  // View state: 'editor' | 'report_preview'
  const [activeView, setActiveView] = useState<'editor' | 'report_preview'>('editor');
  const [generatedReport, setGeneratedReport] = useState<ExecutiveReport | null>(null);

  // Machine Filter & Search
  const [machineSearch, setMachineSearch] = useState('');

  // 1. Laser Hour Monitoring State
  const [laserHourData, setLaserHourData] = useState({
    baselineRecordedHours: 10250,
    recordedDateTime: '2026-07-01 08:30',
    currentReadingHours: 11480,
    lifetimeMaxHours: 20000,
    warningThresholdHours: 15000,
    criticalThresholdHours: 18000
  });

  // Calculate runtime hours
  const runtimeHours = Math.max(0, laserHourData.currentReadingHours - laserHourData.baselineRecordedHours);

  // Derive laser hour health status
  const hourStatus = 
    laserHourData.currentReadingHours >= laserHourData.criticalThresholdHours
      ? 'CRITICAL'
      : laserHourData.currentReadingHours >= laserHourData.warningThresholdHours
        ? 'WARNING'
        : 'NOMINAL';

  // 2. Dynamic Laser List State
  const [lasers, setLasers] = useState<LaserHeadReading[]>([
    {
      id: 'lhr-1',
      name: 'Laser Head #1 (Main Oscillator)',
      serialNumber: 'LH-SN-9941',
      ratedWatts: 250,
      measuredWatts: 249.2,
      stabilityPercent: 99.6,
      status: 'NOMINAL',
      notes: 'Beam profile uniform, TEM00 mode optimal.'
    },
    {
      id: 'lhr-2',
      name: 'Laser Head #2 (Auxiliary Amplifier)',
      serialNumber: 'LH-SN-9942',
      ratedWatts: 250,
      measuredWatts: 241.5,
      stabilityPercent: 96.6,
      status: 'WARNING',
      notes: 'Minor power drop detected, alignment recommended.'
    }
  ]);

  // Laser Modal State
  const [isLaserModalOpen, setIsLaserModalOpen] = useState(false);
  const [editingLaserId, setEditingLaserId] = useState<string | null>(null);
  const [laserForm, setLaserForm] = useState({
    name: '',
    serialNumber: '',
    ratedWatts: 250,
    measuredWatts: 248,
    stabilityPercent: 99.2,
    notes: ''
  });

  // 3. Optic Cleanliness & Beam Profiling State
  const [opticsData, setOpticsData] = useState({
    cleanlinessScore: 96,
    beamWaistMm: 1.08,
    focusOffsetMm: 0.02,
    opticsStatus: 'OPTIMAL',
    remarks: 'Protective window clear, zero contamination on optical surfaces.'
  });

  // 4. Chiller & Thermal Cooling State
  const [coolingData, setCoolingData] = useState({
    flowRateLpm: 12.4,
    coolantTempC: 21.2,
    pressurePsi: 48.5,
    coolingStatus: 'OPTIMAL',
    remarks: 'DI water conductivity 0.8 uS/cm, chiller loop steady.'
  });

  // 5. Executive Remarks & Release Verdict
  const [releaseVerdict, setReleaseVerdict] = useState<'APPROVED_FOR_PRODUCTION' | 'CONDITIONAL_RELEASE' | 'HALTED_FOR_MAINTENANCE'>('APPROVED_FOR_PRODUCTION');
  const [executiveRemarks, setExecutiveRemarks] = useState(
    'All critical subsystems inspected. Laser power output within 1.5% tolerance. Chiller thermal loop nominal. Approved for full production throughput.'
  );
  const [recommendations, setRecommendations] = useState<string[]>([
    'Schedule routine DI water ion filter replacement within 30 days.',
    'Perform optic cleaning prior to next 200-hour annealing cycle.'
  ]);
  const [newRecommendation, setNewRecommendation] = useState('');

  // 6. Before & After Photos
  const [inspectionPhotos, setInspectionPhotos] = useState({
    beforePhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    afterPhoto: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'
  });

  // Photo handlers
  const handlePhotoUpload = (field: 'beforePhoto' | 'afterPhoto', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setInspectionPhotos((prev) => ({ ...prev, [field]: result }));
        showAlert(`Inspection photo updated (${field === 'beforePhoto' ? 'Before' : 'After'}).`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Laser CRUD Handlers
  const handleOpenAddLaser = () => {
    setEditingLaserId(null);
    setLaserForm({
      name: `Laser Head #${lasers.length + 1}`,
      serialNumber: `LH-SN-${Math.floor(1000 + Math.random() * 9000)}`,
      ratedWatts: 250,
      measuredWatts: 248,
      stabilityPercent: 99.2,
      notes: 'Operational reading.'
    });
    setIsLaserModalOpen(true);
  };

  const handleOpenEditLaser = (laser: LaserHeadReading) => {
    setEditingLaserId(laser.id);
    setLaserForm({
      name: laser.name,
      serialNumber: laser.serialNumber,
      ratedWatts: laser.ratedWatts,
      measuredWatts: laser.measuredWatts,
      stabilityPercent: laser.stabilityPercent,
      notes: laser.notes
    });
    setIsLaserModalOpen(true);
  };

  const handleSaveLaser = (e: React.FormEvent) => {
    e.preventDefault();
    const stability = Number(((laserForm.measuredWatts / laserForm.ratedWatts) * 100).toFixed(1));
    const status: 'NOMINAL' | 'WARNING' | 'CRITICAL' = 
      stability >= 98 ? 'NOMINAL' : stability >= 92 ? 'WARNING' : 'CRITICAL';

    if (editingLaserId) {
      setLasers((prev) =>
        prev.map((l) =>
          l.id === editingLaserId
            ? {
                ...l,
                name: laserForm.name,
                serialNumber: laserForm.serialNumber,
                ratedWatts: laserForm.ratedWatts,
                measuredWatts: laserForm.measuredWatts,
                stabilityPercent: stability,
                status,
                notes: laserForm.notes
              }
            : l
        )
      );
      showAlert(`Updated ${laserForm.name}.`);
    } else {
      const newLaser: LaserHeadReading = {
        id: `lhr-${Date.now()}`,
        name: laserForm.name,
        serialNumber: laserForm.serialNumber,
        ratedWatts: laserForm.ratedWatts,
        measuredWatts: laserForm.measuredWatts,
        stabilityPercent: stability,
        status,
        notes: laserForm.notes
      };
      setLasers((prev) => [...prev, newLaser]);
      showAlert(`Added ${laserForm.name}.`);
    }
    setIsLaserModalOpen(false);
  };

  const handleDeleteLaser = (id: string) => {
    setLasers((prev) => prev.filter((l) => l.id !== id));
    showAlert('Laser head removed from inspection checklist.');
  };

  // Recommendation Handlers
  const handleAddRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecommendation.trim()) return;
    setRecommendations((prev) => [...prev, newRecommendation.trim()]);
    setNewRecommendation('');
  };

  const handleRemoveRecommendation = (index: number) => {
    setRecommendations((prev) => prev.filter((_, i) => i !== index));
  };

  // Overall Health Score Calculation
  const avgLaserStability = lasers.length > 0 
    ? lasers.reduce((acc, l) => acc + l.stabilityPercent, 0) / lasers.length 
    : 95;
  const overallHealthScore = Math.round(
    avgLaserStability * 0.4 + opticsData.cleanlinessScore * 0.3 + (coolingData.flowRateLpm >= 10 ? 98 : 80) * 0.3
  );

  // Generate Customer MHC Report Handler
  const handleCompileAndGenerateReport = () => {
    if (!selectedMachine) return;

    const recordId = `mhc-${Date.now()}`;
    const dateStr = new Date().toISOString().split('T')[0];

    // 1. Build MHCRecord
    const mhcRecord: MHCRecord = {
      id: recordId,
      machineId: selectedMachine.id,
      machineModel: selectedMachine.model,
      machineNumber: selectedMachine.machineNumber,
      date: dateStr,
      engineerName: 'Lead Cleanroom Field Engineer',
      healthScores: {
        laserHead1: lasers[0]?.stabilityPercent || 95,
        laserHead2: lasers[1]?.stabilityPercent || 90,
        cooling: Math.round(coolingData.flowRateLpm * 7.5),
        optics: opticsData.cleanlinessScore,
        stage: 98,
        agc: 96,
        overallScore: overallHealthScore
      },
      productionReleaseStatus: releaseVerdict,
      engineerRemarks: executiveRemarks,
      actionableRecommendations: recommendations,
      photos: [inspectionPhotos.beforePhoto, inspectionPhotos.afterPhoto]
    };

    // Save MHC record
    onSaveMhcRecord(mhcRecord);

    // 2. Build ExecutiveReport
    const report: ExecutiveReport = {
      id: `rep-${Date.now()}`,
      title: `Machine Health Check Inspection Report - ${selectedMachine.model}`,
      subtitle: `Customer Passport: ${selectedMachine.customerName} (${selectedMachine.plantName})`,
      machineId: selectedMachine.id,
      machineModel: selectedMachine.model,
      machineNumber: selectedMachine.machineNumber,
      customerName: selectedMachine.customerName,
      plantName: selectedMachine.plantName,
      generatedDate: dateStr,
      authorName: 'Senior Field Service Engineer',
      status: releaseVerdict === 'APPROVED_FOR_PRODUCTION' ? 'RELEASED' : 'DRAFT',
      healthScoreAtGeneration: overallHealthScore,
      summary: executiveRemarks,
      findings: [
        `Recorded Laser Hours: ${laserHourData.currentReadingHours} hrs (Runtime Delta: ${runtimeHours} hrs).`,
        `Laser Power Stability: ${avgLaserStability.toFixed(1)}% across ${lasers.length} configured laser head(s).`,
        `Optics Cleanliness Rating: ${opticsData.cleanlinessScore}% with ${opticsData.beamWaistMm}mm beam waist.`,
        `Thermal Cooling System: Flow rate ${coolingData.flowRateLpm} LPM @ ${coolingData.coolantTempC}°C.`
      ],
      recommendations: recommendations,
      photos: [inspectionPhotos.beforePhoto, inspectionPhotos.afterPhoto]
    };

    // Pass to parent
    onGenerateReport(report);
    setGeneratedReport(report);
    setActiveView('report_preview');
    showAlert('Customer MHC Report compiled and saved successfully!');
  };

  // Filter machines for target selection list
  const filteredMachines = machines.filter((m) =>
    m.model.toLowerCase().includes(machineSearch.toLowerCase()) ||
    m.machineNumber.toLowerCase().includes(machineSearch.toLowerCase()) ||
    m.customerName.toLowerCase().includes(machineSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {systemAlert && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl font-mono text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            {systemAlert}
          </div>
        </div>
      )}

      {/* View Switcher Header */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDark ? 'bg-[#14171A] border-[#2B323A]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isDark ? 'bg-[#8B9DFF]/10 text-[#8B9DFF]' : 'bg-indigo-50 text-indigo-600'}`}>
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Machine Health Check (MHC) Workspace
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
                FSOS v0.7.7
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Standardized field inspection workflow & 1-click customer report generation engine.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeView === 'report_preview' ? (
            <Button
              variant="secondary"
              onClick={() => setActiveView('editor')}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Inspection Editor
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleCompileAndGenerateReport}
              icon={<FileCheck className="w-4 h-4" />}
              className="bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow-lg shadow-emerald-600/20"
            >
              Generate Customer MHC Report
            </Button>
          )}
        </div>
      </div>

      {activeView === 'report_preview' && generatedReport ? (
        /* =========================================================
           CUSTOMER MHC EXECUTIVE REPORT DOCUMENT VIEW
           ========================================================= */
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-indigo-950/40 p-4 rounded-2xl border border-indigo-800/40">
            <div className="flex items-center gap-2 text-indigo-200 text-xs font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Report Generated & Signed Off • Saved in Executive Report Studio</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<Printer className="w-3.5 h-3.5" />}
                onClick={() => window.print()}
              >
                Print / Export PDF
              </Button>
            </div>
          </div>

          <div className={`p-8 rounded-3xl border shadow-2xl max-w-4xl mx-auto space-y-8 ${
            isDark ? 'bg-[#14171A] border-[#2B323A] text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Report Header */}
            <div className="flex justify-between items-start pb-6 border-b border-slate-700/50">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
                    MHC EXECUTIVE REPORT
                  </span>
                  <Badge variant={releaseVerdict === 'APPROVED_FOR_PRODUCTION' ? 'emerald' : 'amber'}>
                    {releaseVerdict.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight">{selectedMachine?.model}</h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Machine #: {selectedMachine?.machineNumber} • S/N: {selectedMachine?.serialNumber}
                </p>
              </div>

              <div className="text-right space-y-1">
                <div className="text-xs font-bold text-slate-300">{selectedMachine?.customerName}</div>
                <div className="text-[11px] text-slate-400">{selectedMachine?.plantName}</div>
                <div className="text-[11px] font-mono text-indigo-400 mt-2">
                  Inspection Date: {new Date().toISOString().split('T')[0]}
                </div>
              </div>
            </div>

            {/* Overall Score Banner */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              overallHealthScore >= 90
                ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                : 'bg-amber-950/20 border-amber-800/40 text-amber-300'
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-black/30">
                  <HealthGauge score={overallHealthScore} size="sm" showLabel={false} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Overall System Inspection Health</h3>
                  <p className="text-xs opacity-80">
                    Aggregated score evaluated across Laser Hours, Power Stability, Optics Cleanliness & Chiller Loop.
                  </p>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-3xl font-black">{overallHealthScore}</span>
                <span className="text-xs opacity-70"> / 100</span>
              </div>
            </div>

            {/* Laser Hour Telemetry Summary */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-400 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                Laser Hour & Lifecycle Telemetry
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 block font-mono">Recorded Baseline</span>
                  <span className="text-sm font-bold font-mono">{laserHourData.baselineRecordedHours} hrs</span>
                </div>
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 block font-mono">Current Reading</span>
                  <span className="text-sm font-bold font-mono text-indigo-400">{laserHourData.currentReadingHours} hrs</span>
                </div>
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 block font-mono">Runtime Delta</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">+{runtimeHours} hrs</span>
                </div>
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 block font-mono">Lifecycle Status</span>
                  <Badge variant={hourStatus === 'NOMINAL' ? 'emerald' : hourStatus === 'WARNING' ? 'amber' : 'rose'}>
                    {hourStatus}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Laser Power Output Inspection Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-400 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Laser Head Power Output Calibration Readings
              </h3>
              <div className={`rounded-xl border overflow-hidden ${isDark ? 'border-[#2B323A]' : 'border-slate-200'}`}>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className={`border-b font-mono ${isDark ? 'bg-[#1E2227] border-[#2B323A] text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                      <th className="p-3">Laser Head Module</th>
                      <th className="p-3">Serial Number</th>
                      <th className="p-3">Rated Power</th>
                      <th className="p-3">Measured Power</th>
                      <th className="p-3">Stability %</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {lasers.map((l) => (
                      <tr key={l.id}>
                        <td className="p-3 font-semibold">{l.name}</td>
                        <td className="p-3 font-mono text-slate-400">{l.serialNumber}</td>
                        <td className="p-3 font-mono">{l.ratedWatts} W</td>
                        <td className="p-3 font-mono font-bold text-indigo-400">{l.measuredWatts} W</td>
                        <td className="p-3 font-mono font-bold">{l.stabilityPercent}%</td>
                        <td className="p-3">
                          <Badge variant={l.status === 'NOMINAL' ? 'emerald' : l.status === 'WARNING' ? 'amber' : 'rose'} size="sm">
                            {l.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Optics & Cooling Telemetry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  Optics Cleanliness & Beam Metrics
                </h4>
                <div className="text-xs space-y-1 font-mono text-slate-300">
                  <div>Cleanliness Rating: <strong className="text-emerald-400">{opticsData.cleanlinessScore}%</strong></div>
                  <div>Beam Waist Diameter: <strong>{opticsData.beamWaistMm} mm</strong></div>
                  <div>Focus Offset: <strong>{opticsData.focusOffsetMm} mm</strong></div>
                  <p className="text-[11px] text-slate-400 italic pt-1 font-sans">{opticsData.remarks}</p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5" />
                  Chiller & Thermal Circuit
                </h4>
                <div className="text-xs space-y-1 font-mono text-slate-300">
                  <div>Coolant Flow Rate: <strong className="text-sky-400">{coolingData.flowRateLpm} LPM</strong></div>
                  <div>Coolant Temperature: <strong>{coolingData.coolantTempC} °C</strong></div>
                  <div>Chiller Pressure: <strong>{coolingData.pressurePsi} PSI</strong></div>
                  <p className="text-[11px] text-slate-400 italic pt-1 font-sans">{coolingData.remarks}</p>
                </div>
              </div>
            </div>

            {/* Executive Remarks & Recommendations */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-400">
                Executive Engineer Summary & Actionable Recommendations
              </h3>
              <p className="text-xs leading-relaxed p-4 rounded-xl border bg-black/20 border-slate-700/50 text-slate-300">
                {executiveRemarks}
              </p>

              {recommendations.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 block font-mono">Action Items:</span>
                  <ul className="space-y-1 text-xs">
                    {recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Visual Inspection Photos */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-400">
                Visual Optical Inspection Records
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block">BEFORE INSPECTION</span>
                  <div className="aspect-video rounded-xl overflow-hidden border border-slate-700">
                    <img src={inspectionPhotos.beforePhoto} alt="Before Inspection" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block">AFTER INSPECTION</span>
                  <div className="aspect-video rounded-xl overflow-hidden border border-slate-700">
                    <img src={inspectionPhotos.afterPhoto} alt="After Inspection" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sign-off Blocks */}
            <div className="pt-8 border-t border-slate-700/50 grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-300">Field Service Engineer Sign-Off</div>
                <div className="h-12 border-b border-slate-600 border-dashed flex items-end pb-1 text-xs font-mono text-indigo-400">
                  Signed: Senior Cleanroom Field Engineer
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Date: {new Date().toISOString().split('T')[0]}</div>
              </div>

              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-300">Cleanroom Facility Manager Acceptance</div>
                <div className="h-12 border-b border-slate-600 border-dashed flex items-end pb-1 text-xs font-mono text-slate-400">
                  Customer Signature Placeholder
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Facility Manager ({selectedMachine?.customerName})</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================
           INSPECTION EDITOR WORKSPACE
           ========================================================= */
        <div className="space-y-6">
          {/* Target Machine Selection List */}
          <Card title="Active Inspection Target Machine">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <input
                  type="text"
                  placeholder="Filter target machines by model, machine number, or customer..."
                  value={machineSearch}
                  onChange={(e) => setMachineSearch(e.target.value)}
                  className={`w-full sm:w-80 px-3 py-1.5 rounded-xl text-xs border ${
                    isDark ? 'bg-[#111315] border-[#2B323A] text-slate-200' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <span className="text-xs text-slate-400 font-mono">
                  {filteredMachines.length} Machine(s) Available
                </span>
              </div>

              {/* Machine Cards Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-56 overflow-y-auto pr-1">
                {filteredMachines.map((m) => {
                  const isSelected = m.id === selectedMachine?.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMachineId(m.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                        isSelected
                          ? isDark
                            ? 'bg-[#1E2228] border-[#8B9DFF] ring-1 ring-[#8B9DFF]/50 shadow-md'
                            : 'bg-indigo-50/50 border-indigo-600 ring-1 ring-indigo-500/30'
                          : isDark
                            ? 'bg-[#14171A] border-[#2B323A] hover:bg-[#1A1D21]'
                            : 'bg-slate-50 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          isSelected
                            ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {m.machineNumber}
                        </span>
                        <Badge variant={m.status === 'OPERATIONAL' ? 'emerald' : 'amber'} size="sm">
                          {m.status}
                        </Badge>
                      </div>

                      <h4 className={`text-xs font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                        {m.model}
                      </h4>
                      <p className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {m.customerName} • {m.plantName}
                      </p>

                      <div className="mt-2 pt-1.5 border-t border-slate-700/40 flex justify-between items-center text-[10px] font-mono">
                        <span className="text-slate-400">S/N: {m.serialNumber}</span>
                        <span className="font-bold text-emerald-400">{m.healthScore}% Health</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Section 1: Laser Hour Monitoring & Lifecycle Thresholds */}
          <Card title="1. Laser Hour Monitoring & Lifecycle Thresholds">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-3">
                <div>
                  <label className={`block text-[10px] font-mono font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Baseline Recorded (hrs)
                  </label>
                  <input
                    type="number"
                    value={laserHourData.baselineRecordedHours}
                    onChange={(e) => setLaserHourData({ ...laserHourData, baselineRecordedHours: Number(e.target.value) })}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-mono border ${
                      isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[10px] font-mono font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Baseline Recorded Date
                  </label>
                  <input
                    type="text"
                    value={laserHourData.recordedDateTime}
                    onChange={(e) => setLaserHourData({ ...laserHourData, recordedDateTime: e.target.value })}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-mono border ${
                      isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[10px] font-mono font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Current Reading (hrs)
                  </label>
                  <input
                    type="number"
                    value={laserHourData.currentReadingHours}
                    onChange={(e) => setLaserHourData({ ...laserHourData, currentReadingHours: Number(e.target.value) })}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold text-indigo-400 border ${
                      isDark ? 'bg-[#111315] border-[#2B323A]' : 'bg-white border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[10px] font-mono font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Warning Threshold (hrs)
                  </label>
                  <input
                    type="number"
                    value={laserHourData.warningThresholdHours}
                    onChange={(e) => setLaserHourData({ ...laserHourData, warningThresholdHours: Number(e.target.value) })}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-mono border ${
                      isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[10px] font-mono font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Critical Threshold (hrs)
                  </label>
                  <input
                    type="number"
                    value={laserHourData.criticalThresholdHours}
                    onChange={(e) => setLaserHourData({ ...laserHourData, criticalThresholdHours: Number(e.target.value) })}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-mono border ${
                      isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[10px] font-mono font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Max Lifetime (hrs)
                  </label>
                  <input
                    type="number"
                    value={laserHourData.lifetimeMaxHours}
                    onChange={(e) => setLaserHourData({ ...laserHourData, lifetimeMaxHours: Number(e.target.value) })}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-mono border ${
                      isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Laser Hour Progress Bar */}
              <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">
                    Runtime Delta since baseline: <strong className="text-emerald-400">+{runtimeHours} hrs</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Lifecycle Status:</span>
                    <Badge variant={hourStatus === 'NOMINAL' ? 'emerald' : hourStatus === 'WARNING' ? 'amber' : 'rose'}>
                      {hourStatus}
                    </Badge>
                  </div>
                </div>

                <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                  <div
                    className={`h-full transition-all duration-300 ${
                      hourStatus === 'NOMINAL' ? 'bg-emerald-500' : hourStatus === 'WARNING' ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, (laserHourData.currentReadingHours / laserHourData.lifetimeMaxHours) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Dynamic Laser Output & Power Check */}
          <Card
            title="2. Laser Output & Power Calibration Check"
            action={
              <Button
                variant="secondary"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={handleOpenAddLaser}
              >
                Add Laser Head
              </Button>
            }
          >
            <div className="space-y-3">
              <div className={`rounded-xl border overflow-hidden ${isDark ? 'border-[#2B323A]' : 'border-slate-200'}`}>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className={`border-b font-mono ${isDark ? 'bg-[#1E2227] border-[#2B323A] text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                      <th className="p-3">Laser Head Module</th>
                      <th className="p-3">Serial Number</th>
                      <th className="p-3">Rated Power</th>
                      <th className="p-3">Measured Power</th>
                      <th className="p-3">Stability %</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {lasers.map((l) => (
                      <tr key={l.id}>
                        <td className="p-3 font-semibold">{l.name}</td>
                        <td className="p-3 font-mono text-slate-400">{l.serialNumber}</td>
                        <td className="p-3 font-mono">{l.ratedWatts} W</td>
                        <td className="p-3 font-mono font-bold text-indigo-400">{l.measuredWatts} W</td>
                        <td className="p-3 font-mono font-bold">{l.stabilityPercent}%</td>
                        <td className="p-3">
                          <Badge variant={l.status === 'NOMINAL' ? 'emerald' : l.status === 'WARNING' ? 'amber' : 'rose'} size="sm">
                            {l.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditLaser(l)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
                              }`}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLaser(l.id)}
                              className="p-1.5 rounded-lg transition-colors hover:bg-rose-500/10 text-rose-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* Section 3 & 4: Optics & Chiller Inspection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="3. Optic Cleanliness & Beam Profiling">
              <div className="space-y-3 text-xs">
                <div>
                  <label className={`block font-mono mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Optics Cleanliness Score ({opticsData.cleanlinessScore}%)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={opticsData.cleanlinessScore}
                    onChange={(e) => setOpticsData({ ...opticsData, cleanlinessScore: Number(e.target.value) })}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={`block font-mono text-[10px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Beam Waist (mm)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={opticsData.beamWaistMm}
                      onChange={(e) => setOpticsData({ ...opticsData, beamWaistMm: Number(e.target.value) })}
                      className={`w-full px-2.5 py-1.5 rounded-xl border font-mono ${
                        isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block font-mono text-[10px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Focus Offset (mm)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={opticsData.focusOffsetMm}
                      onChange={(e) => setOpticsData({ ...opticsData, focusOffsetMm: Number(e.target.value) })}
                      className={`w-full px-2.5 py-1.5 rounded-xl border font-mono ${
                        isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block font-mono text-[10px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Optics Remarks
                  </label>
                  <textarea
                    rows={2}
                    value={opticsData.remarks}
                    onChange={(e) => setOpticsData({ ...opticsData, remarks: e.target.value })}
                    className={`w-full px-2.5 py-1.5 rounded-xl border ${
                      isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            </Card>

            <Card title="4. Chiller & Thermal Cooling Circuit">
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className={`block font-mono text-[10px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Flow Rate (LPM)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={coolingData.flowRateLpm}
                      onChange={(e) => setCoolingData({ ...coolingData, flowRateLpm: Number(e.target.value) })}
                      className={`w-full px-2.5 py-1.5 rounded-xl border font-mono ${
                        isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block font-mono text-[10px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Temp (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={coolingData.coolantTempC}
                      onChange={(e) => setCoolingData({ ...coolingData, coolantTempC: Number(e.target.value) })}
                      className={`w-full px-2.5 py-1.5 rounded-xl border font-mono ${
                        isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block font-mono text-[10px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Pressure (PSI)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={coolingData.pressurePsi}
                      onChange={(e) => setCoolingData({ ...coolingData, pressurePsi: Number(e.target.value) })}
                      className={`w-full px-2.5 py-1.5 rounded-xl border font-mono ${
                        isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block font-mono text-[10px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Thermal Remarks
                  </label>
                  <textarea
                    rows={2}
                    value={coolingData.remarks}
                    onChange={(e) => setCoolingData({ ...coolingData, remarks: e.target.value })}
                    className={`w-full px-2.5 py-1.5 rounded-xl border ${
                      isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Section 5 & 6: Executive Remarks & Inspection Photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="5. Executive Remarks & Release Status">
              <div className="space-y-3 text-xs">
                <div>
                  <label className={`block font-mono mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Production Release Verdict
                  </label>
                  <select
                    value={releaseVerdict}
                    onChange={(e) => setReleaseVerdict(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl border font-bold ${
                      isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="APPROVED_FOR_PRODUCTION">APPROVED FOR PRODUCTION</option>
                    <option value="CONDITIONAL_RELEASE">CONDITIONAL RELEASE (MINOR WARNINGS)</option>
                    <option value="HALTED_FOR_MAINTENANCE">HALTED FOR MAINTENANCE</option>
                  </select>
                </div>

                <div>
                  <label className={`block font-mono mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Executive Remarks
                  </label>
                  <textarea
                    rows={3}
                    value={executiveRemarks}
                    onChange={(e) => setExecutiveRemarks(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border ${
                      isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block font-mono mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Action Items & Recommendations
                  </label>
                  <form onSubmit={handleAddRecommendation} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Add recommendation..."
                      value={newRecommendation}
                      onChange={(e) => setNewRecommendation(e.target.value)}
                      className={`flex-1 px-3 py-1.5 rounded-xl border ${
                        isDark ? 'bg-[#111315] border-[#2B323A] text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                    <Button type="submit" size="sm" variant="secondary">
                      Add
                    </Button>
                  </form>
                  <div className="space-y-1">
                    {recommendations.map((rec, i) => (
                      <div key={i} className={`p-2 rounded-lg border flex justify-between items-center ${
                        isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <span>{rec}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRecommendation(i)}
                          className="text-rose-500 hover:text-rose-400 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card title="6. Optical Inspection Visual Records">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1.5">
                  <span className="font-mono text-[10px] text-slate-400 block">BEFORE INSPECTION PHOTO</span>
                  <div className="aspect-video rounded-xl overflow-hidden border relative group bg-slate-900 border-slate-700">
                    <img src={inspectionPhotos.beforePhoto} alt="Before Photo" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-xs font-semibold gap-1">
                      <Upload className="w-3.5 h-3.5" /> Change Image
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload('beforePhoto', e)}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="font-mono text-[10px] text-slate-400 block">AFTER INSPECTION PHOTO</span>
                  <div className="aspect-video rounded-xl overflow-hidden border relative group bg-slate-900 border-slate-700">
                    <img src={inspectionPhotos.afterPhoto} alt="After Photo" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-xs font-semibold gap-1">
                      <Upload className="w-3.5 h-3.5" /> Change Image
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload('afterPhoto', e)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Laser Head Modal */}
      {isLaserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${
            isDark ? 'bg-[#14171A] border-[#2B323A] text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-sm font-bold mb-4">
              {editingLaserId ? 'Edit Laser Head Module' : 'Add Laser Head Module'}
            </h3>
            <form onSubmit={handleSaveLaser} className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 font-mono text-[10px]">Laser Head Name</label>
                <input
                  type="text"
                  required
                  value={laserForm.name}
                  onChange={(e) => setLaserForm({ ...laserForm, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border ${
                    isDark ? 'bg-[#111315] border-[#2B323A]' : 'bg-white border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block mb-1 font-mono text-[10px]">Serial Number</label>
                <input
                  type="text"
                  required
                  value={laserForm.serialNumber}
                  onChange={(e) => setLaserForm({ ...laserForm, serialNumber: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border font-mono ${
                    isDark ? 'bg-[#111315] border-[#2B323A]' : 'bg-white border-slate-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 font-mono text-[10px]">Rated Power (Watts)</label>
                  <input
                    type="number"
                    required
                    value={laserForm.ratedWatts}
                    onChange={(e) => setLaserForm({ ...laserForm, ratedWatts: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-xl border font-mono ${
                      isDark ? 'bg-[#111315] border-[#2B323A]' : 'bg-white border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-mono text-[10px]">Measured Power (Watts)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={laserForm.measuredWatts}
                    onChange={(e) => setLaserForm({ ...laserForm, measuredWatts: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-xl border font-mono ${
                      isDark ? 'bg-[#111315] border-[#2B323A]' : 'bg-white border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-mono text-[10px]">Inspection Notes</label>
                <input
                  type="text"
                  value={laserForm.notes}
                  onChange={(e) => setLaserForm({ ...laserForm, notes: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border ${
                    isDark ? 'bg-[#111315] border-[#2B323A]' : 'bg-white border-slate-300'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsLaserModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" variant="primary">
                  Save Laser Head
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
