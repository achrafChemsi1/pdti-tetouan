
import React from 'react';

interface FeatureCategory {
  label: string;
  icon: string | React.ReactNode;
  color: string;
  hex: string;
}

interface FeatureTabsProps {
  categories: Record<string, FeatureCategory>;
  currentCategory: string;
  onSelect: (key: string) => void;
  counts: Record<string, number>;
}

export const FeatureTabs: React.FC<FeatureTabsProps> = ({ categories, currentCategory, onSelect, counts }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
        <span>Patrimoine Territorial</span>
        <div className="h-px bg-slate-200 flex-1"></div>
      </h3>
      {/* Fix: Explicitly cast Object.entries to correct type to avoid 'unknown' type errors in map */}
      {(Object.entries(categories) as [string, FeatureCategory][]).map(([key, config]) => {
        const isActive = currentCategory === key;
        const count = counts[key] || 0;
        
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`
              w-full text-left px-3 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-3 font-medium group relative border
              ${isActive 
                ? 'bg-white border-slate-200 shadow-md scale-[1.02] z-10' 
                : 'bg-transparent border-transparent hover:bg-white/60 text-slate-500 hover:text-slate-800'
              }
            `}
          >
            <div 
              className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
              style={{ backgroundColor: config.hex }}
            />

            <div 
              className={`
                w-9 h-9 rounded-lg flex items-center justify-center text-xl transition-all duration-300 shrink-0
                ${isActive ? 'bg-slate-50 shadow-inner' : 'bg-white group-hover:scale-110 shadow-sm border border-slate-100'}
              `}
              style={{ color: isActive ? config.hex : `${config.hex}aa` }}
            >
              {typeof config.icon === 'string' ? config.icon : <div className="w-5 h-5">{config.icon}</div>}
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[13px] truncate ${isActive ? 'font-black text-slate-800' : 'font-semibold'}`}>
                  {config.label}
                </span>
                <span className={`
                  text-[10px] px-1.5 py-0.5 rounded-md font-bold transition-colors
                  ${isActive 
                    ? 'bg-slate-100 text-slate-600' 
                    : 'bg-white/50 text-slate-400 border border-slate-100 group-hover:bg-white'
                  }
                `}>
                  {count}
                </span>
              </div>
            </div>

             <div className={`
               w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 shrink-0
               ${isActive ? 'bg-slate-50 opacity-100' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}
             `}>
               <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
             </div>
          </button>
        );
      })}
    </div>
  );
};
