import React from 'react';
import { CommuneAggregated, Project, SectorType } from '../types';

const SECTOR_COLORS: Record<string, string> = {
  [SectorType.Emploi]: "bg-indigo-100 text-indigo-700 border-indigo-200",
  [SectorType.Education]: "bg-pink-100 text-pink-700 border-pink-200",
  [SectorType.Sante]: "bg-cyan-100 text-cyan-700 border-cyan-200",
  [SectorType.Eau]: "bg-teal-100 text-teal-700 border-teal-200",
  [SectorType.MiseNiveauTerritoriale]: "bg-amber-100 text-amber-700 border-amber-200",
};

const SECTOR_LABELS: Record<string, string> = {
  [SectorType.Emploi]: "Emploi",
  [SectorType.Education]: "Éducation",
  [SectorType.Sante]: "Santé",
  [SectorType.Eau]: "Eau",
  [SectorType.MiseNiveauTerritoriale]: "Mise à Niveau",
};

interface ProjectListProps {
  commune: CommuneAggregated | null;
  onClose: () => void;
  onDragStart?: (e: React.PointerEvent) => void;
  onPointerMove?: (e: React.PointerEvent) => void;
  onPointerUp?: (e: React.PointerEvent) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ 
  commune, onClose, onDragStart, onPointerMove, onPointerUp 
}) => {
  if (!commune) return null;

  return (
    <div 
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="bg-white/90 backdrop-blur-xl border-t border-slate-200 lg:border-none lg:rounded-[2.5rem] lg:shadow-2xl p-6 h-full flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden"
    >
      {/* Drag Handle */}
      <div 
        onPointerDown={onDragStart}
        className="absolute top-0 left-0 right-0 h-8 flex items-center justify-center cursor-grab active:cursor-grabbing z-50 group"
      >
        <div className="w-12 h-1 rounded-full bg-slate-300 group-hover:bg-slate-400 transition-colors"></div>
      </div>

      <div className="flex items-center justify-between mb-6 mt-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-display">{commune.name}</h2>
          <p className="text-slate-500 text-sm">{commune.projects.length} projets identifiés</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="overflow-y-auto pr-2 space-y-4 flex-1 custom-scrollbar">
        {commune.projects.map((project: Project, idx: number) => {
          const badgeClass = SECTOR_COLORS[project.sector] || "bg-slate-100 text-slate-700 border-slate-200";
          const sectorLabel = SECTOR_LABELS[project.sector] || project.sector;

          return (
            <div 
              key={idx} 
              className="group p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-md transition-all duration-200 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover:bg-brand-500 transition-colors"></div>
              
              <div className="mb-3 pl-2 flex flex-col gap-2">
                <span className={`self-start text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeClass}`}>
                  {sectorLabel}
                </span>
                <h3 className="font-semibold text-slate-800 text-sm leading-snug">{project.project_title}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pl-2">
                <div className="text-center p-2 rounded-xl bg-white shadow-sm border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Coût</p>
                  <p className="text-brand-600 font-bold text-sm">{project.cost_mdh} <span className="text-[10px]">MDH</span></p>
                </div>
                <div className="text-center p-2 rounded-xl bg-white shadow-sm border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Emplois</p>
                  <p className="text-slate-700 font-bold text-sm">{project.jobs_planned}</p>
                </div>
                <div className="text-center p-2 rounded-xl bg-white shadow-sm border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">NJT</p>
                  <p className="text-slate-700 font-bold text-sm">{project.njt}</p>
                </div>
                <div className="text-center p-2 rounded-xl bg-white shadow-sm border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Durée</p>
                  <p className="text-slate-700 font-bold text-sm">{project.duration_months} <span className="text-[10px]">Mois</span></p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};