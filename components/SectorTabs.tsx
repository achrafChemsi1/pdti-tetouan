import React from 'react';
import { SectorConfig } from '../types';

interface SectorTabsProps {
  sectors: Record<string, SectorConfig>;
  currentSector: string;
  onSelect: (sector: string) => void;
}

export const SectorTabs: React.FC<SectorTabsProps> = ({ sectors, currentSector, onSelect }) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
        <span>Secteurs</span>
        <div className="h-px bg-slate-200 flex-1"></div>
      </h3>
      {Object.entries(sectors).map(([key, config]) => {
        const isActive = currentSector === key;
        
        // Dynamic styles for the active state
        // We use the sector hex color to create a matching glow/shadow effect
        const activeStyle = isActive ? {
          backgroundColor: '#ffffff',
          boxShadow: `0 8px 20px -4px ${config.hex}25`, // Colored shadow for depth
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
              w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 flex items-center gap-4 font-medium group relative border
              ${isActive 
                ? 'scale-[1.02] border-transparent z-10' 
                : 'bg-transparent border-transparent hover:bg-white/60 hover:shadow-sm text-slate-500 hover:text-slate-800'
              }
            `}
            style={activeStyle}
          >
            {/* Active Indicator Bar (Left) */}
            <div 
              className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
              style={{ backgroundColor: config.hex }}
            />

            {/* Icon Container */}
            <div 
              className={`
                w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 shrink-0
                ${isActive ? '' : 'bg-white text-slate-400 group-hover:scale-110 shadow-sm border border-slate-100'}
              `}
              style={activeIconStyle}
            >
              {config.icon}
            </div>

            {/* Label & Meta */}
            <div className="flex flex-col flex-1 min-w-0">
              <span className={`text-sm truncate ${isActive ? 'font-bold text-slate-800' : 'font-medium'}`}>
                {config.label}
              </span>
              {isActive ? (
                <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80 animate-in fade-in slide-in-from-left-1 duration-300" style={{ color: config.hex }}>
                  Sélectionné
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                  Voir les projets
                </span>
              )}
            </div>

            {/* Arrow / Chevron */}
             <div className={`
               w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shrink-0
               ${isActive ? 'bg-slate-50 rotate-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}
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