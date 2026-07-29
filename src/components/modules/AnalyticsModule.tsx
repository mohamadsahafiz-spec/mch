import React from 'react';
import { LineChart, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area, Bar } from 'recharts';
import { Card } from '../common/Card';
import { Machine } from '../../types';

interface AnalyticsProps {
  machines: Machine[];
}

export const AnalyticsModule: React.FC<AnalyticsProps> = ({ machines }) => {
  const mtbfData = [
    { month: 'Q1 2025', mtbfHours: 1420 },
    { month: 'Q2 2025', mtbfHours: 1580 },
    { month: 'Q3 2025', mtbfHours: 1640 },
    { month: 'Q4 2025', mtbfHours: 1710 },
    { month: 'Q1 2026', mtbfHours: 1850 },
    { month: 'Q2 2026', mtbfHours: 1980 }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Mean Time Between Failures (MTBF) Growth" subtitle="Fleet Reliability Index">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mtbfData}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[1200, 2200]} />
                <Tooltip contentStyle={{ backgroundColor: '#0d1424', borderColor: '#1f2e4d', color: '#f8fafc' }} />
                <Area type="monotone" dataKey="mtbfHours" stroke="#10b981" fill="#10b98120" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Consumables Replacement Lifecycle Forecast" subtitle="Estimated Days to Swap">
          <div className="space-y-3">
            {[
              { name: 'DI Water Cooling Filter (MCH-TSMC-01)', days: 12, critical: true },
              { name: 'Cover Slide Protective Glass D30 (MCH-HYUN-02)', days: 25, critical: false },
              { name: 'N2 Gas Purge Nozzle Assembly (MCH-TSMC-01)', days: 75, critical: false },
              { name: 'Chiller Ion Exchange Resin Filter (MCH-HYUN-02)', days: 95, critical: false }
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#090f1c] border border-[#1a2842] flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">{item.name}</span>
                <span className={`font-mono font-bold ${item.critical ? 'text-rose-400' : 'text-cyan-400'}`}>
                  {item.days} Days Left
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
