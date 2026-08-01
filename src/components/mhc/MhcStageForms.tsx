import React, { useState } from 'react';
import { 
  Clock, 
  Sliders, 
  Zap, 
  Eye, 
  Thermometer, 
  CheckCircle2, 
  Package, 
  FileText, 
  Upload, 
  Trash2, 
  Plus, 
  Edit3, 
  AlertTriangle, 
  Check, 
  Image as ImageIcon,
  HelpCircle,
  X
} from 'lucide-react';
import { 
  MHCSession, 
  MHCLaserHourItem, 
  MHCLaserPowerItem, 
  MHCSparePartItem 
} from '../../types';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface MhcStageFormsProps {
  session: MHCSession;
  activeStage: number; // 1 to 8
  onUpdateSession: (updatedSession: MHCSession) => void;
  onNavigateStage: (stageNumber: number) => void;
}

export const MhcStageForms: React.FC<MhcStageFormsProps> = ({
  session,
  activeStage,
  onUpdateSession,
  onNavigateStage
}) => {
  // Modal state for Stage 07 Spare Parts
  const [partModalOpen, setPartModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<MHCSparePartItem | null>(null);

  // Form states for Stage 07 Part
  const [partName, setPartName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [category, setCategory] = useState('Cooling Consumable');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [action, setAction] = useState<'REPLACED' | 'USED' | 'RECOMMENDED'>('REPLACED');
  const [costIndicator, setCostIndicator] = useState<'CUSTOMER_COST' | 'EO_SUPPORT' | 'WARRANTY'>('EO_SUPPORT');
  const [partNotes, setPartNotes] = useState('');

  // Open part modal
  const handleOpenPartModal = (part?: MHCSparePartItem) => {
    if (part) {
      setEditingPart(part);
      setPartName(part.partName);
      setPartNumber(part.partNumber);
      setCategory(part.category);
      setQuantity(part.quantity);
      setReason(part.reason);
      setAction(part.action);
      setCostIndicator(part.costIndicator);
      setPartNotes(part.notes);
    } else {
      setEditingPart(null);
      setPartName('');
      setPartNumber('');
      setCategory('Optics Consumable');
      setQuantity(1);
      setReason('');
      setAction('REPLACED');
      setCostIndicator('EO_SUPPORT');
      setPartNotes('');
    }
    setPartModalOpen(true);
  };

  const handleSavePart = () => {
    if (!partName.trim()) return;

    let updatedParts = [...session.stage07_spareParts];
    if (editingPart) {
      updatedParts = updatedParts.map((p) =>
        p.id === editingPart.id
          ? {
              ...p,
              partName,
              partNumber,
              category,
              quantity,
              reason,
              action,
              costIndicator,
              notes: partNotes
            }
          : p
      );
    } else {
      const newPart: MHCSparePartItem = {
        id: `sp-${Date.now()}`,
        partName,
        partNumber,
        category,
        quantity,
        reason,
        action,
        costIndicator,
        notes: partNotes
      };
      updatedParts.push(newPart);
    }

    const updatedSession: MHCSession = {
      ...session,
      stage07_spareParts: updatedParts,
      sectionStatuses: {
        ...session.sectionStatuses,
        sec_07: 'COMPLETED'
      },
      lastUpdated: new Date().toLocaleString()
    };

    onUpdateSession(updatedSession);
    setPartModalOpen(false);
  };

  const handleDeletePart = (partId: string) => {
    if (!window.confirm('Delete this spare part record?')) return;
    const updatedParts = session.stage07_spareParts.filter((p) => p.id !== partId);
    onUpdateSession({
      ...session,
      stage07_spareParts: updatedParts,
      lastUpdated: new Date().toLocaleString()
    });
  };

  // Generic helper to update session sections
  const updateSectionStatus = (secKey: string, status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED') => {
    onUpdateSession({
      ...session,
      sectionStatuses: {
        ...session.sectionStatuses,
        [secKey]: status
      },
      lastUpdated: new Date().toLocaleString()
    });
  };

  // Helper image mock uploader
  const handleSimulateImageUpload = (
    currentImages: string[],
    onUpdateImages: (imgs: string[]) => void
  ) => {
    const sampleUrls = [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
    ];
    const newUrl = sampleUrls[Math.floor(Math.random() * sampleUrls.length)];
    onUpdateImages([...currentImages, newUrl]);
  };

  // --------------------------------------------------------------------------
  // STAGE 01: CURRENT LASER HOUR
  // --------------------------------------------------------------------------
  if (activeStage === 1) {
    const laserHours = session.stage01_laserHours || [];

    const handleLaserHourChange = (
      index: number,
      field: keyof MHCLaserHourItem,
      value: any
    ) => {
      const updated = [...laserHours];
      const item = { ...updated[index], [field]: value };

      // Recalculate runtime status
      if (field === 'calculatedCurrentHour' || field === 'warningThreshold' || field === 'criticalThreshold') {
        const cur = Number(field === 'calculatedCurrentHour' ? value : item.calculatedCurrentHour);
        const warn = Number(field === 'warningThreshold' ? value : item.warningThreshold);
        const crit = Number(field === 'criticalThreshold' ? value : item.criticalThreshold);

        if (cur >= crit) {
          item.runtimeStatus = 'CRITICAL';
        } else if (cur >= warn) {
          item.runtimeStatus = 'WARNING';
        } else {
          item.runtimeStatus = 'NORMAL';
        }
      }

      updated[index] = item;

      onUpdateSession({
        ...session,
        stage01_laserHours: updated,
        sectionStatuses: { ...session.sectionStatuses, sec_01: 'COMPLETED' },
        lastUpdated: new Date().toLocaleString()
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-400" />
              01 Current Laser Hour Monitoring
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              Record laser operating hours, check runtime thresholds, and determine maintenance alerts.
            </p>
          </div>
          <Badge variant={session.sectionStatuses.sec_01 === 'COMPLETED' ? 'success' : 'warning'}>
            {session.sectionStatuses.sec_01 || 'IN_PROGRESS'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {laserHours.map((lh, idx) => (
            <Card key={lh.laserId || idx} className="border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="font-bold text-slate-200 text-base flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                  {lh.laserIdentifier}
                </div>
                <Badge
                  variant={
                    lh.runtimeStatus === 'CRITICAL'
                      ? 'danger'
                      : lh.runtimeStatus === 'WARNING'
                      ? 'warning'
                      : 'success'
                  }
                >
                  RUNTIME: {lh.runtimeStatus}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Last Recorded Hour</label>
                  <input
                    type="number"
                    value={lh.recordedLaserHour}
                    onChange={(e) => handleLaserHourChange(idx, 'recordedLaserHour', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Calculated Current Hour</label>
                  <input
                    type="number"
                    value={lh.calculatedCurrentHour}
                    onChange={(e) => handleLaserHourChange(idx, 'calculatedCurrentHour', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Warning Threshold (hrs)</label>
                  <input
                    type="number"
                    value={lh.warningThreshold}
                    onChange={(e) => handleLaserHourChange(idx, 'warningThreshold', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-amber-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Critical Threshold (hrs)</label>
                  <input
                    type="number"
                    value={lh.criticalThreshold}
                    onChange={(e) => handleLaserHourChange(idx, 'criticalThreshold', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-rose-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Reading Date</label>
                  <input
                    type="date"
                    value={lh.readingDate}
                    onChange={(e) => handleLaserHourChange(idx, 'readingDate', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Reading Time</label>
                  <input
                    type="time"
                    value={lh.readingTime}
                    onChange={(e) => handleLaserHourChange(idx, 'readingTime', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STAGE 02: LASER PROFILE / PRODUCT
  // --------------------------------------------------------------------------
  if (activeStage === 2) {
    const prof = session.stage02_laserProfile;

    const handleProfileChange = (field: keyof typeof prof, value: any) => {
      onUpdateSession({
        ...session,
        stage02_laserProfile: {
          ...prof,
          [field]: value
        },
        sectionStatuses: { ...session.sectionStatuses, sec_02: 'COMPLETED' },
        lastUpdated: new Date().toLocaleString()
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-400" />
              02 Laser Profile & Product Setup
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              Verify customer processed product, recipe program, and optical profile settings.
            </p>
          </div>
          <Badge variant={session.sectionStatuses.sec_02 === 'COMPLETED' ? 'success' : 'warning'}>
            {session.sectionStatuses.sec_02 || 'IN_PROGRESS'}
          </Badge>
        </div>

        <Card className="border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Processed Product Name</label>
              <input
                type="text"
                value={prof.productName}
                onChange={(e) => handleProfileChange('productName', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Recipe / Program Name</label>
              <input
                type="text"
                value={prof.recipeProgram}
                onChange={(e) => handleProfileChange('recipeProgram', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Laser Profile Information</label>
              <input
                type="text"
                value={prof.profileInfo}
                onChange={(e) => handleProfileChange('profileInfo', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Spot / Rayleigh Measurement Info</label>
              <input
                type="text"
                value={prof.measurementInfo}
                onChange={(e) => handleProfileChange('measurementInfo', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-400 mb-1 font-medium">Supporting Evidence Notes</label>
            <textarea
              rows={3}
              value={prof.supportingEvidence}
              onChange={(e) => handleProfileChange('supportingEvidence', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Profile Images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-400">Beam Profile Evidence Photos</label>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleSimulateImageUpload(prof.images || [], (imgs) =>
                    handleProfileChange('images', imgs)
                  )
                }
                className="text-xs flex items-center gap-1.5 py-1"
              >
                <Upload className="w-3.5 h-3.5" />
                Add Image
              </Button>
            </div>
            <div className="flex flex-wrap gap-3">
              {(prof.images || []).map((img, i) => (
                <div key={i} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                  <img src={img} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button
                    onClick={() => {
                      const updated = prof.images.filter((_, idx) => idx !== i);
                      handleProfileChange('images', updated);
                    }}
                    className="absolute top-1 right-1 p-1 bg-rose-950/80 text-rose-300 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STAGE 03: LASER OUTPUT & POWER
  // --------------------------------------------------------------------------
  if (activeStage === 3) {
    const powerItems = session.stage03_laserPower || [];

    const handlePowerChange = (
      index: number,
      field: keyof MHCLaserPowerItem,
      value: any
    ) => {
      const updated = [...powerItems];
      const item = { ...updated[index], [field]: value };

      if (field === 'beforeValueWatts' || field === 'afterValueWatts' || field === 'ratedPowerWatts') {
        const rated = Number(field === 'ratedPowerWatts' ? value : item.ratedPowerWatts);
        const after = Number(field === 'afterValueWatts' ? value : item.afterValueWatts);
        if (rated > 0) {
          item.stabilityPercent = Number(((after / rated) * 100).toFixed(1));
          if (item.stabilityPercent >= 98) {
            item.result = 'PASS';
          } else if (item.stabilityPercent >= 94) {
            item.result = 'WARNING';
          } else {
            item.result = 'FAIL';
          }
        }
      }

      updated[index] = item;

      onUpdateSession({
        ...session,
        stage03_laserPower: updated,
        sectionStatuses: { ...session.sectionStatuses, sec_03: 'COMPLETED' },
        lastUpdated: new Date().toLocaleString()
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              03 Laser Output & Power Measurements
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              Record power meter readings (Before & After maintenance) for all active laser heads.
            </p>
          </div>
          <Badge variant={session.sectionStatuses.sec_03 === 'COMPLETED' ? 'success' : 'warning'}>
            {session.sectionStatuses.sec_03 || 'IN_PROGRESS'}
          </Badge>
        </div>

        <div className="space-y-4">
          {powerItems.map((p, idx) => (
            <Card key={p.laserId || idx} className="border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  {p.laserIdentifier}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">
                    Stability: <strong className="text-amber-300">{p.stabilityPercent}%</strong>
                  </span>
                  <Badge variant={p.result === 'PASS' ? 'success' : p.result === 'WARNING' ? 'warning' : 'danger'}>
                    {p.result}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Rated Power (Watts)</label>
                  <input
                    type="number"
                    value={p.ratedPowerWatts}
                    onChange={(e) => handlePowerChange(idx, 'ratedPowerWatts', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Reference Value (W)</label>
                  <input
                    type="number"
                    value={p.referenceValueWatts}
                    onChange={(e) => handlePowerChange(idx, 'referenceValueWatts', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Before Value (W)</label>
                  <input
                    type="number"
                    value={p.beforeValueWatts}
                    onChange={(e) => handlePowerChange(idx, 'beforeValueWatts', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-rose-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">After Value (W)</label>
                  <input
                    type="number"
                    value={p.afterValueWatts}
                    onChange={(e) => handlePowerChange(idx, 'afterValueWatts', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-emerald-300 font-mono"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-slate-400 mb-1 font-medium">Power Notes & Observations</label>
                <input
                  type="text"
                  value={p.notes}
                  onChange={(e) => handlePowerChange(idx, 'notes', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STAGE 04: OPTICS & BEAM PROFILE
  // --------------------------------------------------------------------------
  if (activeStage === 4) {
    const optics = session.stage04_opticsBeam;

    const handleOpticsChange = (field: keyof typeof optics, value: any) => {
      onUpdateSession({
        ...session,
        stage04_opticsBeam: {
          ...optics,
          [field]: value
        },
        sectionStatuses: { ...session.sectionStatuses, sec_04: 'COMPLETED' },
        lastUpdated: new Date().toLocaleString()
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-400" />
              04 Optics & Beam Profile Inspection
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              Inspect optics cleanliness, beam waist diameter, focus offsets, and M² beam quality.
            </p>
          </div>
          <Badge variant={session.sectionStatuses.sec_04 === 'COMPLETED' ? 'success' : 'warning'}>
            {session.sectionStatuses.sec_04 || 'IN_PROGRESS'}
          </Badge>
        </div>

        <Card className="border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Cleanliness Score (%)</label>
              <input
                type="number"
                value={optics.cleanlinessScore}
                onChange={(e) => handleOpticsChange('cleanlinessScore', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-indigo-300 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Beam Waist (mm)</label>
              <input
                type="number"
                step="0.01"
                value={optics.beamWaistMm}
                onChange={(e) => handleOpticsChange('beamWaistMm', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Focus Offset (mm)</label>
              <input
                type="number"
                step="0.01"
                value={optics.focusOffsetMm}
                onChange={(e) => handleOpticsChange('focusOffsetMm', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Symmetry Ratio</label>
              <input
                type="number"
                step="0.01"
                value={optics.symmetryRatio}
                onChange={(e) => handleOpticsChange('symmetryRatio', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">M² Beam Quality</label>
              <input
                type="number"
                step="0.01"
                value={optics.m2Value}
                onChange={(e) => handleOpticsChange('m2Value', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Before Condition</label>
              <textarea
                rows={2}
                value={optics.beforeCondition}
                onChange={(e) => handleOpticsChange('beforeCondition', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">After Condition</label>
              <textarea
                rows={2}
                value={optics.afterCondition}
                onChange={(e) => handleOpticsChange('afterCondition', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-medium">Inspection Result:</span>
              <select
                value={optics.inspectionResult}
                onChange={(e) => handleOpticsChange('inspectionResult', e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 font-bold"
              >
                <option value="PASS">PASS</option>
                <option value="WARNING">WARNING</option>
                <option value="FAIL">FAIL</option>
              </select>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                handleSimulateImageUpload(optics.images || [], (imgs) =>
                  handleOpticsChange('images', imgs)
                )
              }
              className="text-xs flex items-center gap-1.5 py-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Optics Photo
            </Button>
          </div>

          {optics.images && optics.images.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {optics.images.map((img, i) => (
                <div key={i} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-slate-700">
                  <img src={img} alt="Optics" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button
                    onClick={() => {
                      const updated = optics.images.filter((_, idx) => idx !== i);
                      handleOpticsChange('images', updated);
                    }}
                    className="absolute top-1 right-1 p-1 bg-rose-950/80 text-rose-300 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STAGE 05: COOLING SYSTEM
  // --------------------------------------------------------------------------
  if (activeStage === 5) {
    const cool = session.stage05_cooling;

    const handleCoolingChange = (field: keyof typeof cool, value: any) => {
      onUpdateSession({
        ...session,
        stage05_cooling: {
          ...cool,
          [field]: value
        },
        sectionStatuses: { ...session.sectionStatuses, sec_05: 'COMPLETED' },
        lastUpdated: new Date().toLocaleString()
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-cyan-400" />
              05 Chiller & Cooling System Verification
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              Check DI water conductivity, flow rate, chiller coolant temperatures, and thermal stability.
            </p>
          </div>
          <Badge variant={session.sectionStatuses.sec_05 === 'COMPLETED' ? 'success' : 'warning'}>
            {session.sectionStatuses.sec_05 || 'IN_PROGRESS'}
          </Badge>
        </div>

        <Card className="border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Chiller Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                value={cool.chillerTempCelsius}
                onChange={(e) => handleCoolingChange('chillerTempCelsius', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-cyan-300 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Coolant Flow Rate (LPM)</label>
              <input
                type="number"
                step="0.1"
                value={cool.chillerFlowLpm}
                onChange={(e) => handleCoolingChange('chillerFlowLpm', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">DI Water Conductivity (µS/cm)</label>
              <input
                type="number"
                step="0.01"
                value={cool.diConductivityUs}
                onChange={(e) => handleCoolingChange('diConductivityUs', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Before Condition / Readings</label>
              <textarea
                rows={2}
                value={cool.beforeCondition}
                onChange={(e) => handleCoolingChange('beforeCondition', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">After Condition / Post-Maintenance</label>
              <textarea
                rows={2}
                value={cool.afterCondition}
                onChange={(e) => handleCoolingChange('afterCondition', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Cooling Subsystem Verdict:</span>
            <select
              value={cool.result}
              onChange={(e) => handleCoolingChange('result', e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 font-bold"
            >
              <option value="PASS">PASS</option>
              <option value="ATTENTION">ATTENTION REQUIRED</option>
              <option value="FAIL">FAIL</option>
            </select>
          </div>
        </Card>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STAGE 06: PRODUCT QUALITY / VISUAL INSPECTION
  // --------------------------------------------------------------------------
  if (activeStage === 6) {
    const qual = session.stage06_productQuality;

    const handleQualChange = (field: keyof typeof qual, value: any) => {
      onUpdateSession({
        ...session,
        stage06_productQuality: {
          ...qual,
          [field]: value
        },
        sectionStatuses: { ...session.sectionStatuses, sec_06: 'COMPLETED' },
        lastUpdated: new Date().toLocaleString()
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              06 Product Quality & Visual Inspection
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              Inspect test cut sample wafer quality, via diameter, pad condition, and visual cut evidence.
            </p>
          </div>
          <Badge variant={session.sectionStatuses.sec_06 === 'COMPLETED' ? 'success' : 'warning'}>
            {session.sectionStatuses.sec_06 || 'IN_PROGRESS'}
          </Badge>
        </div>

        <Card className="border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Sample ID / Coupon</label>
              <input
                type="text"
                value={qual.sampleId}
                onChange={(e) => handleQualChange('sampleId', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Via Diameter (µm)</label>
              <input
                type="number"
                step="0.1"
                value={qual.viaDiameterUm}
                onChange={(e) => handleQualChange('viaDiameterUm', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-emerald-300 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Via Shape / Roundness</label>
              <input
                type="text"
                value={qual.viaShape}
                onChange={(e) => handleQualChange('viaShape', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Via Offset (µm)</label>
              <input
                type="number"
                step="0.1"
                value={qual.viaOffsetUm}
                onChange={(e) => handleQualChange('viaOffsetUm', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-400 mb-1 font-medium">Pad Quality & Recast Observations</label>
            <input
              type="text"
              value={qual.padQuality}
              onChange={(e) => handleQualChange('padQuality', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Before Inspection Notes</label>
              <textarea
                rows={2}
                value={qual.beforeInspectionNotes}
                onChange={(e) => handleQualChange('beforeInspectionNotes', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">After Inspection Notes</label>
              <textarea
                rows={2}
                value={qual.afterInspectionNotes}
                onChange={(e) => handleQualChange('afterInspectionNotes', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Quality Verification Verdict:</span>
            <select
              value={qual.result}
              onChange={(e) => handleQualChange('result', e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 font-bold"
            >
              <option value="PASS">PASS (MEETS LITHO SPEC)</option>
              <option value="ATTENTION">ATTENTION REQUIRED</option>
              <option value="FAIL">FAIL</option>
            </select>
          </div>
        </Card>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STAGE 07: SPARE PARTS & CONSUMABLE
  // --------------------------------------------------------------------------
  if (activeStage === 7) {
    const parts = session.stage07_spareParts || [];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-400" />
              07 Spare Parts & Consumables Log
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              Record parts replaced during maintenance, consumables used, and recommended stock.
            </p>
          </div>
          <Button
            onClick={() => handleOpenPartModal()}
            className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold px-4 py-2 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Spare Part Entry
          </Button>
        </div>

        {/* Parts List */}
        {parts.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
            <Package className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="text-sm">No spare parts recorded for this session yet.</p>
            <Button
              onClick={() => handleOpenPartModal()}
              variant="outline"
              className="mt-3 text-xs border-slate-700 text-slate-300"
            >
              Add First Part
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {parts.map((pt) => (
              <Card
                key={pt.id}
                className="border border-slate-800 bg-slate-900/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 text-sm">{pt.partName}</span>
                    <span className="text-xs font-mono text-orange-400">({pt.partNumber})</span>
                    <Badge variant={pt.action === 'REPLACED' ? 'success' : 'warning'}>
                      {pt.action}
                    </Badge>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {pt.costIndicator.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Category: <span className="text-slate-300">{pt.category}</span> • Qty:{' '}
                    <span className="text-slate-200 font-bold">{pt.quantity}</span> • Reason:{' '}
                    <span className="text-slate-300">{pt.reason}</span>
                  </div>
                  {pt.notes && <p className="text-xs text-slate-500 mt-0.5 italic">{pt.notes}</p>}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleOpenPartModal(pt)}
                    className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePart(pt.id)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal for Adding/Editing Part */}
        {partModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-base font-bold text-slate-100">
                  {editingPart ? 'Edit Spare Part Record' : 'Add Spare Part Entry'}
                </h4>
                <button onClick={() => setPartModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Part Name *</label>
                  <input
                    type="text"
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    placeholder="e.g. DI Water Resin Filter Cartridge 10''"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Part Number</label>
                    <input
                      type="text"
                      value={partNumber}
                      onChange={(e) => setPartNumber(e.target.value)}
                      placeholder="e.g. EO-FLT-9921"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Action Taken</label>
                    <select
                      value={action}
                      onChange={(e) => setAction(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                    >
                      <option value="REPLACED">REPLACED</option>
                      <option value="USED">USED</option>
                      <option value="RECOMMENDED">RECOMMENDED</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Cost Indicator</label>
                    <select
                      value={costIndicator}
                      onChange={(e) => setCostIndicator(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                    >
                      <option value="EO_SUPPORT">EO SUPPORT</option>
                      <option value="CUSTOMER_COST">CUSTOMER COST</option>
                      <option value="WARRANTY">WARRANTY</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Reason for Action</label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Scheduled quarterly preventive replacement"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Additional Notes</label>
                  <textarea
                    rows={2}
                    value={partNotes}
                    onChange={(e) => setPartNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <Button variant="outline" size="sm" onClick={() => setPartModalOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSavePart} className="bg-orange-600 hover:bg-orange-500 text-white">
                  Save Part Entry
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STAGE 08: ENGINEER REMARKS & VERDICT
  // --------------------------------------------------------------------------
  if (activeStage === 8) {
    const rem = session.stage08_engineerRemarks;

    const handleRemarkChange = (field: keyof typeof rem, value: any) => {
      onUpdateSession({
        ...session,
        stage08_engineerRemarks: {
          ...rem,
          [field]: value
        },
        sectionStatuses: { ...session.sectionStatuses, sec_08: 'COMPLETED' },
        lastUpdated: new Date().toLocaleString()
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-400" />
              08 Engineer Remarks & Production Verdict
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              Document general findings, observed issues, recommendations, and production release status.
            </p>
          </div>
          <Badge variant={session.sectionStatuses.sec_08 === 'COMPLETED' ? 'success' : 'warning'}>
            {session.sectionStatuses.sec_08 || 'IN_PROGRESS'}
          </Badge>
        </div>

        <Card className="border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="text-xs">
            <label className="block text-slate-400 mb-1 font-medium">General Findings</label>
            <textarea
              rows={3}
              value={rem.generalFindings}
              onChange={(e) => handleRemarkChange('generalFindings', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-200 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Observed Issues</label>
              <textarea
                rows={3}
                value={rem.observedIssues}
                onChange={(e) => handleRemarkChange('observedIssues', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Corrective Actions Taken</label>
              <textarea
                rows={3}
                value={rem.correctiveActions}
                onChange={(e) => handleRemarkChange('correctiveActions', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-400 mb-1 font-medium">Engineer Recommendations</label>
            <textarea
              rows={2}
              value={rem.recommendations}
              onChange={(e) => handleRemarkChange('recommendations', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-200 text-xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-800 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rem.followUpRequired}
                onChange={(e) => handleRemarkChange('followUpRequired', e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-rose-500 focus:ring-rose-500"
              />
              <span className="text-slate-300 font-medium">Follow-Up Required before next cycle</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Production Release Verdict:</span>
              <select
                value={rem.productionReleaseVerdict}
                onChange={(e) => handleRemarkChange('productionReleaseVerdict', e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 font-bold"
              >
                <option value="APPROVED">APPROVED FOR FULL PRODUCTION</option>
                <option value="CONDITIONAL_RELEASE">CONDITIONAL RELEASE</option>
                <option value="HALTED">HALTED / DO NOT OPERATE</option>
              </select>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
};
