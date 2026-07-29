import React, { useState } from 'react';
import { BookOpen, Search, FileText, AlertTriangle, ChevronRight, CheckCircle2, ShieldCheck, Download, ExternalLink, Wrench, Clock, FileCheck } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface SOPItem {
  code: string;
  title: string;
  category: string;
  readTime: string;
  lastUpdated: string;
  summary: string;
  steps: string[];
  requiredTools: string[];
  safetyClass: string;
}

export const KnowledgeBaseModule: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeSop, setActiveSop] = useState<SOPItem | null>(null);

  const sops: SOPItem[] = [
    {
      code: 'SOP-LSR-001',
      title: 'TRUMPF TruMicro 7000 Series Cleanroom ISO 4 Gowning & Safety Protocol',
      category: 'Laser Safety',
      readTime: '8 min',
      lastUpdated: '2026-06-15',
      summary: 'Mandatory ISO Class 4 gowning, electrostatic discharge (ESD) grounding, and Class 4 High-Power Laser Safety curtain interlock entry procedures.',
      safetyClass: 'Class 4 Laser / ISO 4 Cleanroom',
      requiredTools: ['ESD Wrist Strap', 'Laser Safety Eyewear (OD 7+ @ 1030nm)', 'Cleanroom Nitrile Gloves', 'Particulate Counter'],
      steps: [
        'Perform 30-second air shower cycle before entering primary gowning anteroom.',
        'Don ESD-rated booties, cleanroom hood, and full coveralls in sequence according to top-down rule.',
        'Verify laser keylock is in SECURE/OFF position before entering the main processing enclosure.',
        'Inspect Class 4 laser safety curtains for optical pinholes or thermal degradation.',
        'Power on ambient particulate counter and confirm cleanroom particle count is below 10 particles/m³ (>0.5µm).'
      ]
    },
    {
      code: 'SOP-CAL-004',
      title: 'Galvanometer Scanning Motor Gain Realignment & Field Distortion Correction',
      category: 'Calibration',
      readTime: '12 min',
      lastUpdated: '2026-07-10',
      summary: 'Precision calibration of dual-axis galvanometer motor feedback gains, field grid distortion matrix mapping, and step response latency adjustment.',
      safetyClass: 'Class 1 Interlocked / Maintenance Mode',
      requiredTools: ['Grid Target Alignment Plate (9-point)', 'Thermal Beam Profiler', 'Hex Key Set (Metric)', 'Oscilloscope'],
      steps: [
        'Mount precision quartz alignment grid onto galvo focal plane.',
        'Fire low-power pilot diode (635nm) at 1% output power.',
        'Adjust X-axis galvo motor servo gain pot until step latency is below 12 microseconds.',
        'Adjust Y-axis galvo motor damping until overshoot is less than 0.5%.',
        'Execute automated 81-point grid scan to compute 2D field distortion matrix and upload parameters to galvo controller memory.'
      ]
    },
    {
      code: 'ERR-LSR-402',
      title: 'Diode Pump Array Forward Voltage Spike Troubleshooting & Swap Guide',
      category: 'Error Diagnostic',
      readTime: '5 min',
      lastUpdated: '2026-05-22',
      summary: 'Troubleshooting steps for error code ERR-402 indicating diode driver over-voltage spike during pulsed laser discharge.',
      safetyClass: 'Electrical Hazard / High Voltage',
      requiredTools: ['Fluke True-RMS Multimeter', 'Insulated Hand Tools', 'Thermal Paste (High Conductivity)', 'Torque Wrench'],
      steps: [
        'Lock out tag out (LOTO) 480V 3-phase mains supply to the laser power unit.',
        'Wait 5 minutes for main capacitor bank to bleed residual charge below 12V DC.',
        'Measure forward voltage drop across diode stack terminal connectors.',
        'If voltage delta exceeds 2.8V per bar, isolate and replace degraded diode module array.',
        'Reapply high-thermal-conductivity paste and torque mounting bolts to 3.5 Nm.'
      ]
    },
    {
      code: 'SOP-CHIL-009',
      title: 'Deionized Water Cooling Filter Cartridge Swap & System De-aeration',
      category: 'Maintenance',
      readTime: '10 min',
      lastUpdated: '2026-07-02',
      summary: 'Procedure for replacing the 0.2µm deionized cooling water filter, flushing ion-exchange resin, and bleeding micro-air bubbles from laser head cooling jacket.',
      safetyClass: 'Hydraulic / Fluid Pressure',
      requiredTools: ['Filter Housing Spanner Wrench', '0.2µm Polypropylene Filter Cartridge', 'Conductivity Meter', 'Catch Basin'],
      steps: [
        'Isolate cooling loop ball valves at chiller inlet and outlet ports.',
        'Depressurize cooling line via manual bleed valve into catch basin.',
        'Unscrew filter canister using spanner wrench and dispose of spent cartridge.',
        'Insert fresh 0.2µm filter cartridge and lubricate Viton O-ring with DI-water compatible grease.',
        'Re-open valves, start chiller pump, and open manual air-bleed vent on top of laser head until bubble-free laminar stream is observed.'
      ]
    }
  ];

  const categories = ['ALL', 'Laser Safety', 'Calibration', 'Error Diagnostic', 'Maintenance'];

  const filteredSops = sops.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || 
                          s.code.toLowerCase().includes(search.toLowerCase()) ||
                          s.summary.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12 transition-all duration-300">
      {/* Light Theme Knowledge Workspace Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase">
              EXECUTIVE DOCUMENTation
            </span>
            <span className="text-xs text-slate-500 font-mono">ISO 9001 Compliant SOPs</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Field Engineering Knowledge Base & Standard Manuals</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified cleanroom procedures, optical calibration manuals, and error diagnostic protocols for laser field engineers.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-600 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>4 Verified SOP Documents</span>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search SOPs, manuals, or error codes (e.g. ERR-402)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SOP Cards Grid (Light Theme Clean Look) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSops.map((sop) => (
          <div
            key={sop.code}
            onClick={() => setActiveSop(sop)}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  {sop.code}
                </span>
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {sop.category}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                {sop.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2 font-sans">
                {sop.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {sop.readTime} read
              </span>

              <span className="text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                View Operational Manual
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* SOP Detail Modal Viewer */}
      {activeSop && (
        <Modal
          isOpen={!!activeSop}
          onClose={() => setActiveSop(null)}
          title={`${activeSop.code}: ${activeSop.title}`}
        >
          <div className="space-y-6 text-slate-800 text-xs">
            {/* Header Meta */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded">
                  {activeSop.code}
                </span>
                <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                  Classification: {activeSop.safetyClass}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{activeSop.summary}</p>
            </div>

            {/* Required Tools */}
            <div>
              <h4 className="font-mono font-bold text-slate-900 uppercase text-[11px] mb-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-blue-600" />
                Required Equipment & PPE
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeSop.requiredTools.map((tool, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[11px]">
                    • {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Step-by-Step Procedure */}
            <div>
              <h4 className="font-mono font-bold text-slate-900 uppercase text-[11px] mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Sequential Operational Protocol
              </h4>
              <ol className="space-y-2.5">
                {activeSop.steps.map((step, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-xs text-slate-700 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setActiveSop(null)}>Close Manual</Button>
              <Button variant="primary" icon={<Download className="w-3.5 h-3.5" />} onClick={() => window.print()}>
                Print SOP Sheet
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
