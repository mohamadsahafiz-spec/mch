import React, { useState } from 'react';
import { BookOpen, Search, FileText, AlertTriangle, ChevronRight } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const KnowledgeBaseModule: React.FC = () => {
  const [search, setSearch] = useState('');

  const sops = [
    {
      code: 'SOP-LSR-001',
      title: 'TRUMPF TruMicro 7000 Series Cleanroom ISO 4 Gowning & Safety Protocol',
      category: 'Laser Safety',
      readTime: '8 min'
    },
    {
      code: 'SOP-CAL-004',
      title: 'Galvanometer Motor Gain Realignment & Field Distortion Correction Procedure',
      category: 'Calibration',
      readTime: '12 min'
    },
    {
      code: 'ERR-LSR-402',
      title: 'Diode Pump Array Forward Voltage Spike Troubleshooting Guide',
      category: 'Error Diagnostic',
      readTime: '5 min'
    },
    {
      code: 'SOP-CHIL-009',
      title: 'Deionized Water Cooling Filter Cartridge Swap & System De-aeration',
      category: 'Maintenance',
      readTime: '10 min'
    }
  ];

  const filtered = sops.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 pb-12">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search SOPs, Calibration Manuals, Error Codes (e.g., ERR-LSR-402)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0d1424] text-slate-100 text-sm rounded-xl pl-10 pr-4 py-3 border border-[#1f2e4d] focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((sop) => (
          <Card key={sop.code} className="hover:border-cyan-500/50 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-cyan-400">{sop.code}</span>
              <Badge variant="indigo" size="sm">{sop.category}</Badge>
            </div>
            <h3 className="text-sm font-bold text-slate-100 mb-2">{sop.title}</h3>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Estimated Read: {sop.readTime}</span>
              <span className="text-cyan-400 flex items-center gap-1 font-semibold">Open Manual <ChevronRight className="w-3.5 h-3.5" /></span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
