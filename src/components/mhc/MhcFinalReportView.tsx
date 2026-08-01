import React from 'react';
import { 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Cpu, 
  Clock, 
  FileCheck,
  Zap,
  Eye,
  Thermometer,
  Package
} from 'lucide-react';
import { MHCSession, MHCReportDraftConfig } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface MhcFinalReportViewProps {
  session: MHCSession;
  draftConfig: MHCReportDraftConfig;
  onBackToBuilder: () => void;
}

export const MhcFinalReportView: React.FC<MhcFinalReportViewProps> = ({
  session,
  draftConfig,
  onBackToBuilder
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Bar (hidden when printing) */}
      <div className="print:hidden bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
        <Button
          onClick={onBackToBuilder}
          variant="outline"
          className="border-slate-700 text-slate-300 text-xs py-2 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Report Builder
        </Button>

        <Button
          onClick={() => window.print()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-5 flex items-center gap-2 shadow-lg"
        >
          <Printer className="w-4 h-4" />
          Print / Export PDF Document
        </Button>
      </div>

      {/* FINAL CUSTOMER REPORT DOCUMENT CANVAS */}
      <div className="bg-white text-slate-900 rounded-2xl p-8 md:p-12 shadow-2xl space-y-8 font-sans print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-emerald-600 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-widest uppercase flex items-center gap-2">
              <span className="w-4 h-4 bg-emerald-600 inline-block"></span>
              EO TECHNICS
            </div>
            <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
              FIELD SERVICE OPERATIONS • CLEANROOM CERTIFICATION
            </div>
          </div>
          <div className="text-right font-mono text-xs text-slate-600 space-y-0.5">
            <div><strong className="text-slate-900">Certificate #:</strong> {draftConfig.reportNumber}</div>
            <div><strong className="text-slate-900">Date:</strong> {draftConfig.date}</div>
            <div className="text-emerald-700 font-bold">STATUS: OFFICIAL / PUBLISHED</div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center py-2 border-b border-slate-200">
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 uppercase tracking-tight">
            {draftConfig.reportTitle}
          </h1>
        </div>

        {/* Machine & Customer Passport Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-500 block">Customer Name:</span>
            <strong className="text-slate-900 text-sm">{draftConfig.customerName}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Plant / Fab Location:</span>
            <strong className="text-slate-900 text-sm">{draftConfig.plantName}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Machine Model:</span>
            <strong className="text-slate-900">{draftConfig.machineModel}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Serial Number:</span>
            <strong className="text-slate-900 font-mono">{draftConfig.machineSerialNumber}</strong>
          </div>
        </div>

        {/* Executive Overview Comments */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-300 pb-1">
            EXECUTIVE FIELD SUMMARY
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
            {draftConfig.customComments}
          </p>
        </div>

        {/* Stage 01: Laser Hours */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-300 pb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            01 CURRENT LASER HOUR READINGS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {session.stage01_laserHours.map((lh, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded border border-slate-200 flex justify-between">
                <div>
                  <div className="font-bold text-slate-900">{lh.laserIdentifier}</div>
                  <div className="text-[11px] text-slate-500">Recorded: {lh.recordedLaserHour} hrs</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-emerald-700 font-bold">{lh.calculatedCurrentHour} hrs</div>
                  <div className="text-[10px] text-slate-500">{lh.runtimeStatus}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stage 03: Output & Power */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-300 pb-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-slate-600" />
            03 LASER POWER MEASUREMENTS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {session.stage03_laserPower.map((lp, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded border border-slate-200 flex justify-between">
                <div>
                  <div className="font-bold text-slate-900">{lp.laserIdentifier}</div>
                  <div className="text-[11px] text-slate-500">Rated: {lp.ratedPowerWatts}W</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-slate-900 font-bold">{lp.afterValueWatts}W</div>
                  <div className="text-[10px] text-emerald-700 font-bold">{lp.result} ({lp.stabilityPercent}%)</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stage 08 & Release Verdict */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-300 pb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            08 ENGINEER VERDICT & PRODUCTION RELEASE
          </h3>
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Production Verdict:</span>
              <span className="font-extrabold text-emerald-800 text-sm px-3 py-1 rounded bg-white border border-emerald-300">
                {session.stage08_engineerRemarks?.productionReleaseVerdict || 'APPROVED'}
              </span>
            </div>
            <p className="text-slate-800 leading-relaxed">
              {draftConfig.engineerConclusion}
            </p>
          </div>
        </div>

        {/* Formal Signatures */}
        <div className="pt-8 border-t-2 border-slate-200 grid grid-cols-2 gap-8 text-xs">
          <div className="space-y-4">
            <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider block">
              Field Service Engineer Authorization
            </span>
            <div className="h-12 border-b border-slate-300 flex items-end pb-1 font-semibold text-slate-900">
              {draftConfig.engineerSignatureName}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Title: {draftConfig.engineerTitle} • Date: {draftConfig.engineerSignatureDate}
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider block">
              Customer Sign-Off & Acceptance
            </span>
            <div className="h-12 border-b border-slate-300 flex items-end pb-1 font-semibold text-slate-900">
              {draftConfig.customerSignatureName}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Role: Wafer Fab Engineering Director • Date: {draftConfig.customerSignatureDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
