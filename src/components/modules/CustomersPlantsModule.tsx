import React, { useState } from 'react';
import { Building2, Layers, Cpu, MapPin, Mail, Phone, Plus, ChevronRight, Search } from 'lucide-react';
import { Customer, Plant, ProductionLine, Machine } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface CustomersPlantsProps {
  customers: Customer[];
  plants: Plant[];
  lines: ProductionLine[];
  machines: Machine[];
  onSelectMachine: (machineId: string) => void;
}

export const CustomersPlantsModule: React.FC<CustomersPlantsProps> = ({
  customers,
  plants,
  lines,
  machines,
  onSelectMachine
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const customerPlants = plants.filter((p) => p.customerId === selectedCustomer?.id);

  return (
    <div className="space-y-6 pb-12">
      {/* Customers Header Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {customers.map((cust) => {
          const isSelected = cust.id === selectedCustomer?.id;
          return (
            <div
              key={cust.id}
              onClick={() => setSelectedCustomerId(cust.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#111e36] border-cyan-500/60 shadow-lg'
                  : 'bg-[#0d1424] border-[#1e2d4a] hover:bg-[#131d33]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="cyan" size="sm">{cust.industry}</Badge>
                <span className="text-xs font-mono text-slate-400">{cust.plantsCount} Plants</span>
              </div>
              <h3 className="text-base font-bold text-slate-100">{cust.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{cust.contactPerson}</p>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex justify-between">
                <span>{cust.email}</span>
                <span>{cust.phone}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Customer Hierarchy Detail */}
      {selectedCustomer && (
        <Card
          title={
            <div className="flex items-center justify-between w-full">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase">Customer Infrastructure Tree</span>
                <h2 className="text-xl font-bold text-slate-100">{selectedCustomer.name}</h2>
              </div>
              <Button variant="outline" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                Add Plant Facility
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            {customerPlants.map((plant) => {
              const plantLines = lines.filter((l) => l.plantId === plant.id);
              const plantMachines = machines.filter((m) => m.plantId === plant.id);

              return (
                <div key={plant.id} className="p-5 rounded-xl bg-[#090f1c] border border-[#1a2842] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-400">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-100">{plant.name}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {plant.location} • {plant.timezone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <Badge variant="indigo" size="sm">{plantLines.length} Production Lines</Badge>
                      <Badge variant="emerald" size="sm">{plantMachines.length} Laser Systems</Badge>
                    </div>
                  </div>

                  {/* Production Lines and Machines */}
                  <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-cyan-500/30">
                    {plantLines.map((line) => {
                      const lineMachines = plantMachines.filter((m) => m.productionLineId === line.id);
                      return (
                        <div key={line.id} className="p-3 rounded-lg bg-[#111a2d] border border-[#1e2d4a]">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Layers className="w-4 h-4 text-cyan-400" />
                              <span className="text-xs font-bold text-slate-200">{line.name}</span>
                              <span className="text-[10px] font-mono text-slate-500">({line.code})</span>
                            </div>
                            <Badge variant={line.criticality === 'CRITICAL' ? 'rose' : 'amber'} size="sm">
                              {line.criticality}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400 mb-3">{line.description}</p>

                          {/* Machine Cards Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {lineMachines.map((m) => (
                              <div
                                key={m.id}
                                onClick={() => onSelectMachine(m.id)}
                                className="p-2.5 rounded-lg bg-[#0a101d] border border-[#18243b] hover:border-cyan-500/50 cursor-pointer transition-all flex items-center justify-between group"
                              >
                                <div className="flex items-center gap-2.5">
                                  <Cpu className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                                  <div>
                                    <p className="text-xs font-semibold text-slate-200">{m.model}</p>
                                    <p className="text-[10px] font-mono text-slate-500">{m.serialNumber}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-mono font-bold text-cyan-400">{m.healthScore}%</span>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 inline ml-1" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
