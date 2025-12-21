import React from 'react';
import { SectorConfig } from '../types';

interface SectorTabsProps {
  sectors: Record<string, SectorConfig>;
  currentSector: string;
  onSelect: (sector: string) => void;
}

export const SectorTabs: React.FC<SectorTabsProps> = ({ sectors, currentSector, onSelect }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 px-2 flex items-center gap-3">
        <span>Secteurs</span>
        <div className="h-px bg-slate-800 flex-1"></div>
      </h3>
      {(Object.entries(sectors) as [string, SectorConfig][]).map(([key, config]) => {
        const isActive = currentSector === key;
        
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`
              w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 flex items-center gap-4 group relative border
              ${isActive 
                ? 'bg-slate-800/80 border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] z-10 scale-[1.02]' 
                : 'bg-transparent border-transparent hover:bg-slate-800/40 text-slate-500 hover:text-slate-300'
              }
            `}
          >
            {/* Active Indicator Glow */}
            {isActive && (
                <div 
                  className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full blur-[1px]"
                  style={{ backgroundColor: config.hex, boxShadow: `0 0 10px ${config.hex}` }}
                />
            )}

            <div 
              className={`
                w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-300 shrink-0
                ${isActive ? 'bg-slate-900/50 shadow-inner' : 'bg-slate-800/30'}
              `}
              style={isActive ? { color: config.hex } : {}}
            >
              {config.icon}
            </div>

            <div className="flex flex-col flex-1 min-w-0">
                <span className={`text-xs truncate tracking-wide ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                  {config.label}
                </span>
            </div>

             <div className={`
               w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 shrink-0
               ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
             `}>
               <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
             </div>
          </button>
        );
      })}
    </div>
  );
};