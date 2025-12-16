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
      <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
        <span>Secteurs</span>
        <div className="h-px bg-slate-200 flex-1"></div>
      </h3>
      {Object.entries(sectors).map(([key, config]) => {
        const isActive = currentSector === key;
        
        // Dynamic styles for the active state
        const activeStyle = isActive ? {
          backgroundColor: '#ffffff',
          boxShadow: `0 4px 12px -2px ${config.hex}15`,
        } : {};

        const activeIconStyle = isActive ? {
          backgroundColor: `${config.hex}15`, 
          color: config.hex,
        } : {};

        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`
              w-full text-left px-3 py-2 rounded-xl transition-all duration-300 flex items-center gap-3 font-medium group relative border
              ${isActive 
                ? 'scale-[1.01] border-transparent z-10' 
                : 'bg-transparent border-transparent hover:bg-white/60 hover:shadow-sm text-slate-500 hover:text-slate-800'
              }
            `}
            style={activeStyle}
          >
            {/* Active Indicator Bar (Left) */}
            <div 
              className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
              style={{ backgroundColor: config.hex }}
            />

            {/* Icon Container - Compact */}
            <div 
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all duration-300 shrink-0
                ${isActive ? '' : 'bg-white text-slate-400 group-hover:scale-110 shadow-sm border border-slate-100'}
              `}
              style={activeIconStyle}
            >
              {config.icon}
            </div>

            {/* Label & Meta */}
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`text-xs truncate ${isActive ? 'font-bold text-slate-800' : 'font-medium'}`}>
                  {config.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: config.hex }}></span>
                )}
              </div>
            </div>

            {/* Arrow / Chevron */}
             <div className={`
               w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 shrink-0
               ${isActive ? 'bg-slate-50 rotate-0 opacity-100' : '-translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}
             `}>
               <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
             </div>
          </button>
        );
      })}
    </div>
  );
};