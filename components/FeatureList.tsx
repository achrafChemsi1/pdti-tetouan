import React from 'react';
import { INFRASTRUCTURE_GEOJSON, CENTRES_EMERGENTS_GEOJSON } from '../services/mapLayersData';

interface FeatureListProps {
  onFeatureSelect: (coords: [number, number], name: string) => void;
  activeFeatureName: string | null;
  filter: string;
}

const DropIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
    <path d="M12 2.5s-7 8.5-7 12.5a7 7 0 0 0 14 0c0-4-7-12.5-7-12.5z" />
    <path d="M9 15c0-1.5 1-2.5 2-2.5" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
  </svg>
);

const MedicalKitIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M12 11v5M9.5 13.5h5" />
  </svg>
);

const CATEGORY_STYLE: Record<string, { bg: string, text: string, ico: React.ReactNode, hex: string }> = {
  AEROPORT: { bg: 'bg-indigo-50', text: 'text-indigo-600', ico: '✈️', hex: '#4f46e5' },
  BARRAGE: { bg: 'bg-blue-50', text: 'text-blue-600', ico: <DropIcon />, hex: '#2563eb' },
  ZI: { bg: 'bg-amber-50', text: 'text-amber-600', ico: '🏭', hex: '#d97706' },
  CENTRE: { bg: 'bg-emerald-50', text: 'text-emerald-600', ico: <MedicalKitIcon />, hex: '#059669' },
};

export const FeatureList: React.FC<FeatureListProps> = ({ onFeatureSelect, activeFeatureName, filter }) => {
  const infrastructures = INFRASTRUCTURE_GEOJSON.features.map(f => ({
    name: f.properties.NOM,
    type: f.properties.type,
    coords: f.geometry.coordinates as [number, number],
    id: `infra-${f.properties.id}`
  }));

  const centres = CENTRES_EMERGENTS_GEOJSON.features.map(f => ({
    name: f.properties.NOM,
    type: 'CENTRE',
    coords: f.geometry.coordinates as [number, number],
    id: `centre-${f.properties.id}`
  }));

  const allFeatures = [...infrastructures, ...centres];
  const filteredFeatures = filter === 'ALL' 
    ? allFeatures 
    : allFeatures.filter(f => f.type === filter);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
        <span>Répertoire Territorial ({filteredFeatures.length})</span>
        <div className="h-px bg-slate-100 flex-1"></div>
      </h3>
      
      <div className="grid grid-cols-1 gap-1.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredFeatures.map((feat) => {
          const isActive = activeFeatureName === feat.name;
          const style = CATEGORY_STYLE[feat.type] || { bg: 'bg-slate-50', text: 'text-slate-600', ico: '📍', hex: '#475569' };
          
          return (
            <button
              key={feat.id}
              onClick={() => onFeatureSelect(feat.coords, feat.name)}
              className={`
                group flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 text-left
                ${isActive 
                  ? `bg-white border-transparent shadow-lg scale-[1.01] z-10` 
                  : 'bg-white border-slate-100 hover:bg-slate-50'
                }
              `}
              style={isActive ? { borderLeft: `4px solid ${style.hex}` } : {}}
            >
              <div 
                className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-lg transition-all ${isActive ? `${style.bg} ${style.text}` : 'bg-slate-50 group-hover:scale-110 shadow-sm border border-slate-100/50'}`}
                style={!isActive ? { color: style.hex } : {}}
              >
                {typeof style.ico === 'string' ? style.ico : <div className="w-5 h-5">{style.ico}</div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-bold uppercase leading-none mb-1 ${isActive ? style.text : 'text-slate-400'}`}>
                  {feat.type === 'CENTRE' ? 'Centre Émergent' : feat.type}
                </p>
                <p className={`text-[13px] font-bold truncate ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                  {feat.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};