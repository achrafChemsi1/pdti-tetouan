import React from 'react';
import { CommuneAggregated, Project } from '../types';

interface ProjectListProps {
  commune: CommuneAggregated | null;
  onClose: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ commune, onClose }) => {
  if (!commune) return null;

  return (
    <div className="bg-white border-l border-slate-200 shadow-2xl p-6 h-full flex flex-col animate-in slide-in-from-right fade-in duration-300 pointer-events-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-display">{commune.name}</h2>
          <p className="text-brand-600 text-xs font-bold uppercase tracking-widest">{commune.projects.length} Projets Identifiés</p>
          {commune.population && (
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Population: {commune.population.toLocaleString('fr-FR')}
            </p>
          )}
        </div>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="overflow-y-auto pr-2 space-y-4 flex-1 custom-scrollbar">
        {commune.projects.map((project: Project, idx: number) => (
          <div key={idx} className="group p-5 rounded-2xl bg-white border border-slate-100 hover:border-brand-200 hover:shadow-lg transition-all duration-300 relative">
            <div className="mb-3 flex flex-col gap-2">
              <span className="self-start text-[10px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-lg bg-brand-50 text-brand-600 border border-brand-100">
                PROJET PDTI
              </span>
              <h3 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-brand-700">{project.project_title}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-50">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Investissement</p>
                <p className="text-brand-600 font-black text-lg">{project.cost_mdh} <span className="text-[10px]">MDH</span></p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-50">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Emplois</p>
                <p className="text-slate-700 font-black text-lg">{project.jobs_planned}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};