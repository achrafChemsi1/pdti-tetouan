import React from 'react';
import { CommuneAggregated, Project } from '../types';

interface ProjectListProps {
  commune: CommuneAggregated | null;
  onClose: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ commune, onClose }) => {
  if (!commune) return null;

  return (
    <div className="bg-white/90 backdrop-blur-xl border-t border-slate-200 lg:border-none lg:rounded-2xl lg:shadow-xl p-6 h-full flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
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
        {commune.projects.map((project: Project, idx: number) => (
          <div 
            key={idx} 
            className="group p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-md transition-all duration-200 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover:bg-brand-500 transition-colors"></div>
            <h3 className="font-semibold text-slate-800 text-sm mb-3 pl-2">{project.project_title}</h3>
            
            <div className="grid grid-cols-3 gap-2 pl-2">
              <div className="text-center p-2 rounded-lg bg-white shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Coût</p>
                <p className="text-brand-600 font-bold text-sm">{project.cost_mdh} <span className="text-[10px]">MDH</span></p>
              </div>
              <div className="text-center p-2 rounded-lg bg-white shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Emplois</p>
                <p className="text-slate-700 font-bold text-sm">{project.jobs_planned}</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-white shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Durée</p>
                <p className="text-slate-700 font-bold text-sm">{project.duration_months} <span className="text-[10px]">Mois</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};