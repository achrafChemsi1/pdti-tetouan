import React from 'react';
import { SectorType, SectorConfig } from '../types';

interface SectorTabsProps {
  sectors: Record<SectorType, SectorConfig>;
  currentSector: SectorType;
  onSelect: (sector: SectorType) => void;
}

export const SectorTabs: React.FC<SectorTabsProps> = ({ sectors, currentSector, onSelect }) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 px-2">Secteurs</h3>
      {Object.entries(sectors).map(([key, config]) => {
        const isActive = currentSector === key;
        return (
          <button
            key={key}
            onClick={() => onSelect(key as SectorType)}
            className={`
              w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 font-medium group relative overflow-hidden
              ${isActive 
                ? 'bg-white shadow-md text-slate-800 ring-1 ring-slate-200' 
                : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
              }
            `}
          >
            {/* Active Indicator Bar */}
            {isActive && (
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${config.color.replace('text-', 'bg-')}`} />
            )}
            
            <span className={`text-xl ${isActive ? config.color : 'text-slate-400 group-hover:text-slate-500'}`}>
              {config.icon}
            </span>
            <span className={isActive ? 'font-semibold' : ''}>{config.label}</span>
          </button>
        );
      })}
    </div>
  );
};