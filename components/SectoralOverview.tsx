import React from 'react';
import { SectorConfig } from '../types';

interface GroupedProgram {
  id: number;
  title: string;
  cost: number;
  communes: string[];
}

interface SectoralOverviewProps {
  programs: GroupedProgram[];
  config: SectorConfig;
  selectedProgramId: number | null;
  onProgramClick: (id: number) => void;
  onDragStart?: (e: React.PointerEvent) => void;
  onPointerMove?: (e: React.PointerEvent) => void;
  onPointerUp?: (e: React.PointerEvent) => void;
}

export const SectoralOverview: React.FC<SectoralOverviewProps> = ({ 
  programs, 
  config, 
  selectedProgramId, 
  onProgramClick,
  onDragStart,
  onPointerMove,
  onPointerUp
}) => {
  return (
    <div 
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl h-full flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-500 ease-out relative"
    >
      {/* Drag Handle */}
      <div 
        onPointerDown={onDragStart}
        className="absolute top-0 left-0 right-0 h-8 flex items-center justify-center cursor-grab active:cursor-grabbing z-50 group"
      >
        <div className="w-12 h-1 rounded-full bg-white/10 group-hover:bg-white/30 transition-colors"></div>
      </div>

      {/* Header */}
      <div className="p-8 pb-6 space-y-4 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xl shadow-inner border border-white/10">
               {config.icon}
             </div>
             <div>
               <h2 className="text-xl font-bold text-white font-display tracking-tight">Portfolio Sectoriel</h2>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Axe : {config.label}</p>
             </div>
          </div>
          <div className="bg-white/5 px-3 py-1 rounded-full border border-white/5">
             <span className="text-[10px] font-black" style={{ color: config.hex }}>
               {programs.length} Programmes
             </span>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <p className="text-[11px] text-slate-400 leading-relaxed italic">
            Cliquez sur un programme pour isoler son <span className="text-white font-semibold underline decoration-white/20">déploiement territorial</span> sur la carte.
          </p>
        </div>
      </div>
      
      {/* List */}
      <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar space-y-4">
        <div className="space-y-3">
          {programs.map((prog) => {
            const isSelected = selectedProgramId === prog.id;
            
            return (
              <button 
                key={prog.id}
                onClick={() => onProgramClick(prog.id)}
                className={`
                  w-full text-left bg-slate-800/20 border rounded-2xl p-5 transition-all group relative overflow-hidden
                  ${isSelected 
                    ? 'border-white/30 bg-slate-800/60 shadow-[0_0_20px_rgba(255,255,255,0.05)] scale-[1.02] z-10' 
                    : 'border-white/5 hover:bg-slate-800/40 hover:border-white/10'
                  }
                `}
              >
                {/* Sector-colored side stripe */}
                <div 
                  className={`
                    absolute left-0 top-0 bottom-0 w-1 transition-opacity
                    ${isSelected ? 'opacity-100' : 'opacity-20 group-hover:opacity-100'}
                  `}
                  style={{ backgroundColor: config.hex, boxShadow: isSelected ? `0 0 10px ${config.hex}` : 'none' }}
                />
                
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start gap-4">
                    <h5 className={`text-[13px] font-bold leading-snug transition-colors ${isSelected ? 'text-white' : 'text-slate-100 group-hover:text-white'}`}>
                      {prog.title}
                    </h5>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-black block px-2 py-1 bg-white/5 rounded-lg border border-white/5" style={{ color: config.hex }}>
                        {prog.cost} MDH
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-px bg-slate-800 flex-1"></div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">
                        Ciblage Territorial
                      </p>
                      <div className="h-px bg-slate-800 flex-1"></div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {prog.communes.map((comm, idx) => (
                        <span 
                          key={idx}
                          className={`
                            text-[9px] font-bold px-2.5 py-1 rounded-md transition-all capitalize
                            ${isSelected 
                              ? 'bg-white/10 text-white border-white/10' 
                              : 'bg-slate-900 border border-white/5 text-slate-400 group-hover:text-slate-200 group-hover:border-white/20'
                            }
                          `}
                        >
                          {comm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Selected Indicator Icon */}
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 rounded-full bg-white animate-ping opacity-20"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer / Fade */}
      <div className="h-8 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none absolute bottom-0 left-0 right-0"></div>
    </div>
  );
};