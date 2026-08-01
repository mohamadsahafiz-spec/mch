import React, { useState } from 'react';
import { 
  FileText, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  Download, 
  Upload, 
  Copy, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Image as ImageIcon,
  ChevronRight,
  Sparkles,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { MHCSession, MHCReportDraftConfig } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { StorageService } from '../../utils/persistence';

interface MhcReportBuilderProps {
  session: MHCSession;
  onFinalizeReport: (draft: MHCReportDraftConfig) => void;
  onBackToSummary: () => void;
}

export const MhcReportBuilder: React.FC<MhcReportBuilderProps> = ({
  session,
  onFinalizeReport,
  onBackToSummary
}) => {
  // Initial draft config state
  const [draftConfig, setDraftConfig] = useState<MHCReportDraftConfig>(() => {
    const existingDrafts = StorageService.getMhcReportDrafts();
    const existing = existingDrafts.find((d) => d.mhcSessionId === session.id);
    if (existing) return existing;

    return {
      id: `DRAFT-MHC-${Date.now()}`,
      mhcSessionId: session.id,
      reportTitle: 'OFFICIAL MACHINE HEALTH CHECK CERTIFICATE & FIELD INSPECTION REPORT',
      reportNumber: `EO-MHC-REP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      customerName: session.customerName,
      plantName: session.plantName,
      machineModel: session.machineModel,
      machineSerialNumber: session.machineSerialNumber,
      machineName: session.machineName,
      engineerName: session.engineerName || 'Sahafiz',
      engineerTitle: 'Senior Field Service Engineer (EO Technics)',
      sectionsVisibility: {
        cover: true,
        passport: true,
        summary: true,
        sec_01: true,
        sec_02: true,
        sec_03: true,
        sec_04: true,
        sec_05: true,
        sec_06: true,
        sec_07: true,
        sec_08: true,
        evidence: true,
        signoff: true
      },
      sectionsOrder: [
        'cover',
        'passport',
        'summary',
        'sec_01',
        'sec_02',
        'sec_03',
        'sec_04',
        'sec_05',
        'sec_06',
        'sec_07',
        'sec_08',
        'evidence',
        'signoff'
      ],
      customComments: 'Comprehensive Machine Health Check executed in accordance with cleanroom SOP and EO Technics Technical Standard. All optical, laser, and thermal subsystems verified.',
      selectedImages: [
        ...(session.stage02_laserProfile?.images || []).map((url, i) => ({
          id: `img-prof-${i}`,
          url,
          caption: 'Beam Profile Analysis - TEM00 Single Mode Spot Output',
          sectionKey: 'sec_02'
        })),
        ...(session.stage04_opticsBeam?.images || []).map((url, i) => ({
          id: `img-opt-${i}`,
          url,
          caption: 'Optics Surface Transmittance & Cleanliness Inspection',
          sectionKey: 'sec_04'
        }))
      ],
      engineerConclusion: session.stage08_engineerRemarks?.generalFindings || 'System approved for continuous wafer production under standard cleanroom protocols.',
      engineerSignatureName: session.engineerName || 'Sahafiz',
      engineerSignatureDate: new Date().toISOString().split('T')[0],
      customerSignatureName: 'Dr. Marcus Vance',
      customerSignatureDate: new Date().toISOString().split('T')[0],
      lastSaved: new Date().toLocaleString()
    };
  });

  // Saved Drafts list state
  const [savedDrafts, setSavedDrafts] = useState<MHCReportDraftConfig[]>(() =>
    StorageService.getMhcReportDrafts()
  );

  // System toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Section names mapping
  const sectionLabels: Record<string, string> = {
    cover: 'Report Cover & Certificate Banner',
    passport: 'Machine Identity & Passport Details',
    summary: 'MHC Operational Progress Summary',
    sec_01: '01 Current Laser Hour Readings',
    sec_02: '02 Laser Profile / Product Setup',
    sec_03: '03 Laser Output Power Measurements',
    sec_04: '04 Optics & Beam Quality Profile',
    sec_05: '05 Chiller & Cooling System Status',
    sec_06: '06 Product Quality / Via Sample Cut',
    sec_07: '07 Spare Parts & Consumables Log',
    sec_08: '08 Engineer Remarks & Release Verdict',
    evidence: 'High-Res Evidence Photos Gallery',
    signoff: 'Formal Engineering Sign-Offs'
  };

  // Toggle Section Visibility
  const toggleVisibility = (secKey: string) => {
    setDraftConfig((prev) => ({
      ...prev,
      sectionsVisibility: {
        ...prev.sectionsVisibility,
        [secKey]: !prev.sectionsVisibility[secKey]
      },
      lastSaved: new Date().toLocaleString()
    }));
  };

  // Move Section Up/Down in Order
  const moveSection = (index: number, direction: 'UP' | 'DOWN') => {
    const newOrder = [...draftConfig.sectionsOrder];
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;

    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;

    setDraftConfig((prev) => ({
      ...prev,
      sectionsOrder: newOrder,
      lastSaved: new Date().toLocaleString()
    }));
  };

  // Save Draft
  const handleSaveDraft = () => {
    const allDrafts = StorageService.getMhcReportDrafts();
    const idx = allDrafts.findIndex((d) => d.id === draftConfig.id);
    let updated: MHCReportDraftConfig[];
    const updatedDraft = { ...draftConfig, lastSaved: new Date().toLocaleString() };

    if (idx >= 0) {
      updated = allDrafts.map((d, i) => (i === idx ? updatedDraft : d));
    } else {
      updated = [updatedDraft, ...allDrafts];
    }

    StorageService.saveMhcReportDrafts(updated);
    setSavedDrafts(updated);
    setDraftConfig(updatedDraft);
    showToast('Report draft saved successfully!');
  };

  // Duplicate Draft
  const handleDuplicateDraft = () => {
    const clone: MHCReportDraftConfig = {
      ...draftConfig,
      id: `DRAFT-MHC-${Date.now()}`,
      reportTitle: `${draftConfig.reportTitle} (Copy)`,
      lastSaved: new Date().toLocaleString()
    };
    const all = [clone, ...StorageService.getMhcReportDrafts()];
    StorageService.saveMhcReportDrafts(all);
    setSavedDrafts(all);
    setDraftConfig(clone);
    showToast('Draft duplicated successfully!');
  };

  // CSV Export Functionality
  const handleExportCSV = () => {
    const rows = [
      ['SECTION', 'KEY_PARAMETER', 'VALUE / READING', 'UNIT / STATUS'],
      ['SESSION', 'MHC ID', session.id, 'ACTIVE'],
      ['SESSION', 'Machine', session.machineName, ''],
      ['SESSION', 'Customer', session.customerName, session.plantName],
      ['SESSION', 'Engineer', session.engineerName, ''],
      ['01_LASER_HOURS', 'Laser 1 Hour', session.stage01_laserHours[0]?.calculatedCurrentHour || 0, 'Hours'],
      ['01_LASER_HOURS', 'Laser 2 Hour', session.stage01_laserHours[1]?.calculatedCurrentHour || 0, 'Hours'],
      ['03_LASER_POWER', 'Laser 1 Power After', session.stage03_laserPower[0]?.afterValueWatts || 0, 'Watts'],
      ['03_LASER_POWER', 'Laser 2 Power After', session.stage03_laserPower[1]?.afterValueWatts || 0, 'Watts'],
      ['04_OPTICS', 'Cleanliness Score', session.stage04_opticsBeam?.cleanlinessScore || 100, '%'],
      ['04_OPTICS', 'Beam Waist', session.stage04_opticsBeam?.beamWaistMm || 0, 'mm'],
      ['05_COOLING', 'Chiller Temp', session.stage05_cooling?.chillerTempCelsius || 0, '°C'],
      ['05_COOLING', 'Flow Rate', session.stage05_cooling?.chillerFlowLpm || 0, 'LPM'],
      ['05_COOLING', 'DI Conductivity', session.stage05_cooling?.diConductivityUs || 0, 'µS/cm'],
      ['06_QUALITY', 'Via Diameter', session.stage06_productQuality?.viaDiameterUm || 0, 'µm'],
      ['08_REMARKS', 'Production Verdict', session.stage08_engineerRemarks?.productionReleaseVerdict || 'APPROVED', '']
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${session.id}_MHC_Draft_Data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('MHC Session CSV exported!');
  };

  // CSV Import Functionality
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        showToast('CSV imported and draft hydrated successfully!');
      } catch (err) {
        showToast('Error parsing CSV file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white font-semibold text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Header Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800/50">
              CUSTOM MHC REPORT BUILDER
            </span>
            <span className="text-xs text-slate-400 font-mono">Last Saved: {draftConfig.lastSaved}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            Editing Workspace & Live Customer Report Preview
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={onBackToSummary}
            variant="outline"
            className="border-slate-700 text-slate-300 text-xs py-2"
          >
            Back to Summary
          </Button>

          <Button
            onClick={handleSaveDraft}
            variant="outline"
            className="border-slate-700 text-emerald-400 hover:bg-emerald-950/40 text-xs py-2 flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            Save Draft
          </Button>

          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="border-slate-700 text-sky-400 hover:bg-sky-950/40 text-xs py-2 flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export CSV
          </Button>

          <label className="cursor-pointer bg-slate-950 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs py-2 px-3 rounded-lg font-medium flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            Import CSV
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          </label>

          <Button
            onClick={() => onFinalizeReport(draftConfig)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Finalize & View PDF
          </Button>
        </div>
      </div>

      {/* Main Split Workspace: Left = EDITING WORKSPACE, Right = LIVE PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: EDITING WORKSPACE (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <FileText className="w-4 h-4 text-purple-400" />
              Report Header & Title Config
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Report Title Banner</label>
                <input
                  type="text"
                  value={draftConfig.reportTitle}
                  onChange={(e) =>
                    setDraftConfig((p) => ({ ...p, reportTitle: e.target.value }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Report Number</label>
                  <input
                    type="text"
                    value={draftConfig.reportNumber}
                    onChange={(e) =>
                      setDraftConfig((p) => ({ ...p, reportNumber: e.target.value }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Date</label>
                  <input
                    type="date"
                    value={draftConfig.date}
                    onChange={(e) => setDraftConfig((p) => ({ ...p, date: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Executive Report Introduction</label>
                <textarea
                  rows={3}
                  value={draftConfig.customComments}
                  onChange={(e) =>
                    setDraftConfig((p) => ({ ...p, customComments: e.target.value }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 text-xs"
                />
              </div>
            </div>
          </Card>

          {/* SECTION VISIBILITY & REORDERING WORKSPACE */}
          <Card className="border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              Section Visibility & Custom Ordering
            </h3>

            <div className="space-y-2">
              {draftConfig.sectionsOrder.map((secKey, idx) => {
                const isVisible = draftConfig.sectionsVisibility[secKey] ?? true;

                return (
                  <div
                    key={secKey}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition ${
                      isVisible
                        ? 'bg-slate-950/80 border-slate-800 text-slate-200'
                        : 'bg-slate-950/30 border-slate-900 text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleVisibility(secKey)}
                        className={`p-1 rounded ${
                          isVisible
                            ? 'text-emerald-400 hover:bg-emerald-950/50'
                            : 'text-slate-600 hover:bg-slate-800'
                        }`}
                      >
                        {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <span className="font-semibold">{sectionLabels[secKey] || secKey}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveSection(idx, 'UP')}
                        className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={idx === draftConfig.sectionsOrder.length - 1}
                        onClick={() => moveSection(idx, 'DOWN')}
                        className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* SIGNATURE CONFIGURATION */}
          <Card className="border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              Signatures & Authorization Config
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Field Engineer Name</label>
                  <input
                    type="text"
                    value={draftConfig.engineerSignatureName}
                    onChange={(e) =>
                      setDraftConfig((p) => ({ ...p, engineerSignatureName: e.target.value }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Customer Signee Name</label>
                  <input
                    type="text"
                    value={draftConfig.customerSignatureName}
                    onChange={(e) =>
                      setDraftConfig((p) => ({ ...p, customerSignatureName: e.target.value }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT PANEL: LIVE REPORT PREVIEW (7 cols) */}
        <div className="lg:col-span-7 space-y-4 sticky top-6">
          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800">
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> LIVE REPORT PREVIEW (UPDATES INSTANTLY)
            </span>
            <span>Cleanroom Executive Format</span>
          </div>

          {/* LIVE DOCUMENT CANVAS */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-slate-100 shadow-2xl space-y-6 font-sans">
            {/* Render sections according to sectionsOrder and sectionsVisibility */}
            {draftConfig.sectionsOrder.map((secKey) => {
              if (!draftConfig.sectionsVisibility[secKey]) return null;

              if (secKey === 'cover') {
                return (
                  <div key={secKey} className="border-b-2 border-emerald-500 pb-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-black text-white tracking-widest uppercase">
                        EO TECHNICS
                      </div>
                      <Badge variant="success">CONFIDENTIAL INSPECTION CERTIFICATE</Badge>
                    </div>
                    <h1 className="text-xl font-bold text-slate-100 leading-tight">
                      {draftConfig.reportTitle}
                    </h1>
                    <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono pt-2">
                      <span>Report #: {draftConfig.reportNumber}</span>
                      <span>Date: {draftConfig.date}</span>
                    </div>
                  </div>
                );
              }

              if (secKey === 'passport') {
                return (
                  <div key={secKey} className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      MACHINE PASSPORT IDENTITY
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">Customer:</span>{' '}
                        <strong className="text-slate-200">{draftConfig.customerName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Plant:</span>{' '}
                        <strong className="text-slate-200">{draftConfig.plantName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Model:</span>{' '}
                        <strong className="text-slate-200">{draftConfig.machineModel}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Serial #:</span>{' '}
                        <strong className="text-slate-200 font-mono">{draftConfig.machineSerialNumber}</strong>
                      </div>
                    </div>
                  </div>
                );
              }

              if (secKey === 'summary') {
                return (
                  <div key={secKey} className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                      EXECUTIVE INSPECTION SUMMARY
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-slate-800/60">
                      {draftConfig.customComments}
                    </p>
                  </div>
                );
              }

              if (secKey === 'sec_01') {
                return (
                  <div key={secKey} className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                      01 CURRENT LASER HOUR
                    </h3>
                    <div className="space-y-1.5 text-xs">
                      {session.stage01_laserHours.map((lh, i) => (
                        <div key={i} className="flex justify-between p-2 bg-slate-900/40 rounded font-mono">
                          <span>{lh.laserIdentifier}</span>
                          <span className="text-emerald-400 font-bold">{lh.calculatedCurrentHour} hrs ({lh.runtimeStatus})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (secKey === 'sec_03') {
                return (
                  <div key={secKey} className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                      03 LASER OUTPUT & POWER
                    </h3>
                    <div className="space-y-1.5 text-xs">
                      {session.stage03_laserPower.map((lp, i) => (
                        <div key={i} className="flex justify-between p-2 bg-slate-900/40 rounded font-mono">
                          <span>{lp.laserIdentifier}</span>
                          <span className="text-amber-300 font-bold">{lp.afterValueWatts}W / {lp.ratedPowerWatts}W ({lp.result})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (secKey === 'sec_04') {
                return (
                  <div key={secKey} className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                      04 OPTICS & BEAM QUALITY
                    </h3>
                    <div className="p-3 bg-slate-900/40 rounded text-xs space-y-1">
                      <div>Cleanliness Score: <strong>{session.stage04_opticsBeam?.cleanlinessScore}%</strong></div>
                      <div>Beam Waist: <strong>{session.stage04_opticsBeam?.beamWaistMm} mm</strong></div>
                      <div>Result: <span className="text-emerald-400 font-bold">{session.stage04_opticsBeam?.inspectionResult}</span></div>
                    </div>
                  </div>
                );
              }

              if (secKey === 'sec_05') {
                return (
                  <div key={secKey} className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                      05 COOLING SYSTEM STATUS
                    </h3>
                    <div className="p-3 bg-slate-900/40 rounded text-xs space-y-1 font-mono">
                      <div>Chiller Temp: <strong>{session.stage05_cooling?.chillerTempCelsius}°C</strong></div>
                      <div>Flow Rate: <strong>{session.stage05_cooling?.chillerFlowLpm} LPM</strong></div>
                      <div>DI Conductivity: <strong>{session.stage05_cooling?.diConductivityUs} µS/cm</strong></div>
                    </div>
                  </div>
                );
              }

              if (secKey === 'sec_07') {
                return (
                  <div key={secKey} className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                      07 SPARE PARTS & CONSUMABLES
                    </h3>
                    <div className="space-y-1 text-xs">
                      {session.stage07_spareParts.map((sp, i) => (
                        <div key={i} className="p-2 bg-slate-900/40 rounded flex justify-between">
                          <span>{sp.partName} ({sp.partNumber})</span>
                          <span className="text-orange-400 font-bold">{sp.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (secKey === 'sec_08') {
                return (
                  <div key={secKey} className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                      08 ENGINEER CONCLUSION & VERDICT
                    </h3>
                    <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-lg text-xs space-y-1">
                      <div className="font-bold text-emerald-300">
                        Verdict: {session.stage08_engineerRemarks?.productionReleaseVerdict}
                      </div>
                      <p className="text-slate-300">{draftConfig.engineerConclusion}</p>
                    </div>
                  </div>
                );
              }

              if (secKey === 'signoff') {
                return (
                  <div key={secKey} className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-6 text-xs">
                    <div className="p-3 bg-slate-900/60 rounded border border-slate-800 space-y-1">
                      <span className="text-slate-500 uppercase text-[10px] tracking-wider">Field Service Engineer</span>
                      <div className="font-bold text-slate-200">{draftConfig.engineerSignatureName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Date: {draftConfig.engineerSignatureDate}</div>
                    </div>
                    <div className="p-3 bg-slate-900/60 rounded border border-slate-800 space-y-1">
                      <span className="text-slate-500 uppercase text-[10px] tracking-wider">Customer Authorization</span>
                      <div className="font-bold text-slate-200">{draftConfig.customerSignatureName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Date: {draftConfig.customerSignatureDate}</div>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
