import React, { useState } from 'react';
import { 
  FileCheck, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Thermometer, 
  Eye, 
  ChevronRight, 
  Sparkles, 
  Calendar 
} from 'lucide-react';
import { ExecutiveReport } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { HealthGauge } from '../common/HealthGauge';

interface ReportsModuleProps {
  reports: ExecutiveReport[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({ reports }) => {
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');
  const selectedReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  const handlePrint = () => {
    window.print();
  };

  if (!selectedReport) {
    return (
      <div className="p-8 text-center text-slate-400">
        <FileCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p>No executive engineering reports generated yet. Execute a Machine Health Check to generate a report.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Report Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-print">
        {reports.map((rpt) => (
          <button
            key={rpt.id}
            onClick={() => setSelectedReportId(rpt.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all border ${
              rpt.id === selectedReport.id
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow'
                : 'bg-[#0d1424] border-[#1e2d4a] text-slate-400 hover:text-slate-200'
            }`}
          >
            {rpt.reportNumber}
          </button>
        ))}
      </div>

      {/* Top Controls Bar */}
      <div className="flex items-center justify-between no-print p-4 rounded-xl bg-[#0d1424] border border-[#1f2e4d]">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold">{selectedReport.reportNumber}</span>
          <h3 className="text-sm font-bold text-slate-100">{selectedReport.customerName} — {selectedReport.machineModel}</h3>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
            Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* EXECUTIVE ENGINEERING REPORT DOCUMENT (PRINT PAGE) */}
      <div className="print-page bg-[#0a101d] text-slate-100 border border-[#1a2842] rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl space-y-8">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-lg border border-cyan-300/40 shrink-0">
              <Zap className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest uppercase">
                EXECUTIVE FIELD ENGINEERING REPORT
              </span>
              <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">FIELD OPERATIONS SERVICE SYSTEM</h1>
              <p className="text-xs text-slate-400 font-mono">{selectedReport.reportNumber}</p>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-slate-300 space-y-0.5">
            <p>Date: <strong className="text-slate-100">{selectedReport.date}</strong></p>
            <p>Engineer: <strong className="text-cyan-400">{selectedReport.engineerName}</strong></p>
            <p className="text-[10px] text-slate-400">Classification: Highly Confidential / Enterprise SLA</p>
          </div>
        </div>

        {/* PAGE 1 IMMEDIATE ANSWER CARD: "Is the machine healthy? If not, why? What actions were taken?" */}
        <div className="p-6 rounded-xl bg-[#0e172a] border border-[#223558] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold">1. OPERATIONAL STATUS SUMMARY</span>
              <h2 className="text-lg font-extrabold text-slate-100 mt-0.5">Machine Health & Release Assessment</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-mono">HEALTH SCORE</span>
                <p className="text-2xl font-extrabold font-mono text-emerald-400">{selectedReport.overallHealthScore} / 100</p>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-bold text-xs uppercase tracking-wider">
                {selectedReport.productionReleaseStatus}
              </div>
            </div>
          </div>

          {/* 3 Executive Direct Answers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-[#080e1b] border border-[#1a2842]">
              <span className="font-bold text-cyan-400 font-mono block mb-1">IS THE MACHINE HEALTHY?</span>
              <p className="text-slate-200 leading-relaxed font-semibold">
                {selectedReport.overallHealthScore >= 90
                  ? 'YES. All core laser diodes, galvo stage accuracy, and cooling loops are operating within nominal thresholds.'
                  : 'CONDITIONAL. Minor power offset drift observed.'}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#080e1b] border border-[#1a2842]">
              <span className="font-bold text-amber-400 font-mono block mb-1">IF NOT HEALTHY, WHY?</span>
              <p className="text-slate-200 leading-relaxed">
                DI Water Cooling Filter cartridge lifecycle is at 18%, causing a 0.8 LPM flow delta drop. Laser Head B diode module approaching recommended swap hours (9,680 hrs logged).
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#080e1b] border border-[#1a2842]">
              <span className="font-bold text-emerald-400 font-mono block mb-1">ACTIONS TAKEN?</span>
              <p className="text-slate-200 leading-relaxed">
                Cleaned quartz optical window, calibrated power offset to 248W, verified galvo motor gains, and scheduled DI filter swap for August 2026.
              </p>
            </div>
          </div>

          {/* Executive Summary Narrative */}
          <div className="pt-2">
            <span className="text-[11px] text-slate-400 font-mono font-semibold uppercase">Executive Summary Narrative:</span>
            <p className="text-xs text-slate-300 leading-relaxed mt-1 p-3 rounded-lg bg-[#080e1b] border border-slate-800 font-sans">
              "{selectedReport.executiveSummary}"
            </p>
          </div>
        </div>

        {/* Machine & Facility Record */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#090f1c] border border-[#1a2842] text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono">Customer Facility</span>
            <p className="font-bold text-slate-100 mt-0.5">{selectedReport.customerName}</p>
            <p className="text-[10px] text-slate-400">{selectedReport.plantName}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono">Laser Machine Model</span>
            <p className="font-bold text-slate-100 mt-0.5">{selectedReport.machineModel}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono">Serial Number</span>
            <p className="font-mono font-bold text-cyan-400 mt-0.5">{selectedReport.serialNumber}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono">Lead Service Engineer</span>
            <p className="font-bold text-slate-100 mt-0.5">{selectedReport.engineerName}</p>
          </div>
        </div>

        {/* Subsystem Health Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">
            2. Subsystem Telemetry & Health Score Breakdown
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            {[
              { label: 'Laser Head 1', score: selectedReport.subsystemHealth.laserHead1 },
              { label: 'Laser Head 2', score: selectedReport.subsystemHealth.laserHead2 },
              { label: 'Cooling System', score: selectedReport.subsystemHealth.cooling },
              { label: 'Optics Delivery', score: selectedReport.subsystemHealth.optics },
              { label: 'Galvo & Stage', score: selectedReport.subsystemHealth.stage },
              { label: 'AGC Circuit', score: selectedReport.subsystemHealth.agc },
              { label: 'Power Stability', score: selectedReport.subsystemHealth.powerStability },
              { label: 'Beam Quality', score: selectedReport.subsystemHealth.beamQuality }
            ].map((sub, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-[#080e1b] border border-[#1a2842] flex justify-between items-center">
                <span className="text-slate-400 text-[11px] truncate">{sub.label}</span>
                <span className="font-bold text-cyan-400">{sub.score}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Laser Power Comparison & Beam Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-[#090f1c] border border-[#1a2842] space-y-2">
            <span className="font-mono font-bold text-cyan-400 uppercase text-[11px]">3. Power Output Convergence</span>
            <div className="space-y-1 font-mono pt-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Baseline Power:</span>
                <span className="text-slate-100 font-bold">{selectedReport.powerComparison.baselinePowerWatts} Watts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Measured:</span>
                <span className="text-cyan-400 font-bold">{selectedReport.powerComparison.currentPowerWatts} Watts</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1">
                <span className="text-slate-400">Power Offset Delta:</span>
                <span className="text-emerald-400 font-bold">{selectedReport.powerComparison.deltaPercent}%</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#090f1c] border border-[#1a2842] space-y-2">
            <span className="font-mono font-bold text-cyan-400 uppercase text-[11px]">4. Cooling & Beam Diagnostics</span>
            <p className="text-slate-300"><strong className="text-slate-400">Cooling Status:</strong> {selectedReport.coolingStatus}</p>
            <p className="text-slate-300"><strong className="text-slate-400">Beam Profile:</strong> {selectedReport.beamProfileSummary}</p>
          </div>
        </div>

        {/* Recommendations & Action Plan */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">
            5. Field Recommendations & Preventive Maintenance Action Plan
          </h3>
          <ul className="space-y-2">
            {selectedReport.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-200 bg-[#080e1b] p-2.5 rounded-lg border border-[#1a2842]">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Digital Signature Placeholder Section */}
        <div className="pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-xs font-mono text-slate-400 uppercase">Field Operations Lead Engineer</p>
            <p className="text-sm font-bold text-slate-100">{selectedReport.signatureName}</p>
            <p className="text-xs text-slate-400">{selectedReport.signatureTitle}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#080e1b] border border-[#1a2842] text-right font-mono text-xs">
            <span className="text-[10px] text-emerald-400 font-bold block">✓ DIGITAL SIGNATURE VERIFIED</span>
            <p className="text-slate-300 mt-1 font-bold">SHA-256: 8a91c74f...009a2</p>
            <p className="text-[10px] text-slate-500">Signed Date: {selectedReport.signedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
