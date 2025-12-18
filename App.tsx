import React, { useState, useMemo } from 'react';
import { CommuneAggregated } from './types';
import { projectsData } from './services/projectData';
import { StatCard } from './components/StatCard';
import { FeatureTabs } from './components/FeatureTabs';
import { ProjectList } from './components/ProjectList';
import { DashboardMap } from './components/DashboardMap';
import { FeatureList } from './components/FeatureList';
import { ProvincePresentation } from './components/ProvincePresentation';
import { INFRASTRUCTURE_GEOJSON, CENTRES_EMERGENTS_GEOJSON } from './services/mapLayersData';

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

const FEATURE_CATEGORIES = {
  ALL: { label: "Tout le Répertoire", icon: "🗺️", color: "text-slate-700", hex: "#475569" },
  AEROPORT: { label: "Aéroports", icon: "✈️", color: "text-indigo-600", hex: "#4f46e5" },
  BARRAGE: { label: "Barrages", icon: <DropIcon />, color: "text-blue-600", hex: "#2563eb" },
  ZI: { label: "Zones Industrielles", icon: "🏭", color: "text-amber-600", hex: "#d97706" },
  CENTRE: { label: "Centres Émergents", icon: <MedicalKitIcon />, color: "text-emerald-600", hex: "#059669" },
};

type SectionId = 'diagnostics' | 'priorities' | 'synthesis';

interface NavItem {
  id: SectionId;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'diagnostics', label: 'Diagnostics et Formulation des Projets par Axe' },
  { id: 'priorities', label: 'Projets Prioritaires au Titre de l’Année 2026' },
  { id: 'synthesis', label: 'Synthèse Provinciale' }
];

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('diagnostics');
  const [currentCategory, setCurrentCategory] = useState<string>('ALL');
  const [selectedCommune, setSelectedCommune] = useState<CommuneAggregated | null>(null);
  const [selectedPOI, setSelectedPOI] = useState<{ coords: [number, number]; name: string } | null>(null);
  const [showPresentation, setShowPresentation] = useState<boolean>(false);

  const allPOI = useMemo(() => {
    const infra = INFRASTRUCTURE_GEOJSON.features.map(f => ({ ...f.properties, type: f.properties.type }));
    const centres = CENTRES_EMERGENTS_GEOJSON.features.map(f => ({ ...f.properties, type: 'CENTRE' }));
    return [...infra, ...centres];
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: allPOI.length,
      AEROPORT: allPOI.filter(p => p.type === 'AEROPORT').length,
      BARRAGE: allPOI.filter(p => p.type === 'BARRAGE').length,
      ZI: allPOI.filter(p => p.type === 'ZI').length,
      CENTRE: allPOI.filter(p => p.type === 'CENTRE').length,
    };
    return counts;
  }, [allPOI]);

  const stats = useMemo(() => {
    const filtered = currentCategory === 'ALL' 
      ? allPOI 
      : allPOI.filter(p => p.type === currentCategory);

    let metric1Label = "Unités Recensées";
    let metric1Value = filtered.length;
    let metric2Label = "Total Points Géo";
    let metric2Value = new Set(filtered.map(f => f.NOM)).size;

    if (currentCategory === 'BARRAGE') {
      metric2Label = "Retenue Est. (Hm3)";
      metric2Value = 350;
    }

    return { total: filtered.length, metric1Label, metric1Value, metric2Label, metric2Value };
  }, [allPOI, currentCategory]);

  const aggregatedCommunes = useMemo(() => {
    const map = new Map<string, CommuneAggregated>();
    projectsData.forEach(proj => {
      if (!map.has(proj.commune_name)) {
        map.set(proj.commune_name, {
          name: proj.commune_name,
          lat: proj.latitude,
          lng: proj.longitude,
          projects: [],
          totalCost: 0,
          totalJobs: 0,
          totalNJT: 0
        });
      }
      const comm = map.get(proj.commune_name)!;
      comm.projects.push(proj);
      comm.totalCost += proj.cost_mdh;
    });
    return Array.from(map.values());
  }, []);

  const handleCategoryChange = (key: string) => {
    setCurrentCategory(key);
    setSelectedPOI(null);
    setSelectedCommune(null);
  };

  const handleCommuneSelect = (commune: CommuneAggregated) => {
    setSelectedCommune(commune);
    setSelectedPOI(null);
  };

  const handlePOISelect = (coords: [number, number], name: string) => {
    setSelectedPOI({ coords, name });
    setSelectedCommune(null);
  };

  const activeColor = FEATURE_CATEGORIES[currentCategory as keyof typeof FEATURE_CATEGORIES].hex;
  const currentNavLabel = NAV_ITEMS.find(n => n.id === activeSection)?.label || '';

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f1f5f9] font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 z-50 shadow-sm relative">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#000080] rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-blue-100 shrink-0">T</div>
          <div className="flex flex-col">
            <h1 className="text-base md:text-lg font-black font-display text-[#000080] tracking-tight leading-none mb-1">
              Projet du PDTI de la Province de Tétouan
            </h1>
            <p className="text-[10px] md:text-[11px] text-slate-500 font-bold italic tracking-tight leading-none uppercase">
              (La 1ère Tranche Prioritaire, Au titre de l’Année 2026)
            </p>
          </div>
        </div>

        {/* Strategic Navigation Bar */}
        <nav className="hidden lg:flex items-center border-[2.5px] border-[#000080] rounded-xl overflow-hidden bg-[#eaf7f9]/20 shadow-sm max-w-[60%]">
          {NAV_ITEMS.map((item, idx) => (
            <React.Fragment key={item.id}>
              {idx > 0 && <div className="w-px h-6 bg-[#000080]/20"></div>}
              <button
                onClick={() => {
                  setActiveSection(item.id);
                  setShowPresentation(false);
                }}
                className={`px-5 py-3 text-[10px] font-black uppercase tracking-wider transition-all leading-tight text-center ${
                  activeSection === item.id 
                    ? 'bg-[#000080] text-white shadow-inner' 
                    : 'text-[#000080] hover:bg-[#000080]/5'
                }`}
              >
                {item.label}
              </button>
            </React.Fragment>
          ))}
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Persistent Sidebar */}
        <aside className="w-80 lg:w-96 flex flex-col bg-white border-r border-slate-200 overflow-y-auto shrink-0 z-10 custom-scrollbar shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-500">
          <div className="p-5 space-y-8">
            
            <FeatureTabs 
              categories={FEATURE_CATEGORIES} 
              currentCategory={currentCategory} 
              onSelect={handleCategoryChange} 
              counts={categoryCounts}
            />

            <FeatureList 
              filter={currentCategory}
              onFeatureSelect={handlePOISelect} 
              activeFeatureName={selectedPOI?.name || null} 
            />

            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-4 px-2">Indicateurs de Couverture</h3>
              <div className="grid grid-cols-1 gap-3">
                <StatCard 
                  label={stats.metric1Label} 
                  value={stats.metric1Value} 
                  icon={<div className="w-2 h-2 rounded-full" style={{ backgroundColor: activeColor }}></div>}
                />
                <StatCard label={stats.metric2Label} value={stats.metric2Value} />
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 relative bg-slate-100 overflow-hidden">
          {/* Main Visual Container */}
          <div className="absolute inset-0 z-0">
             {!showPresentation ? (
                <div key={activeSection} className="w-full h-full p-4 lg:p-6 animate-in fade-in zoom-in-95 duration-700">
                  <DashboardMap 
                    communes={aggregatedCommunes} 
                    selectedCommune={selectedCommune}
                    selectedPOI={selectedPOI}
                    sectorConfig={FEATURE_CATEGORIES[currentCategory as keyof typeof FEATURE_CATEGORIES] || FEATURE_CATEGORIES.ALL}
                    onCommuneSelect={handleCommuneSelect}
                  />
                </div>
             ) : (
                <div className="w-full h-full animate-in fade-in duration-700 bg-slate-900">
                  <ProvincePresentation onClose={() => setShowPresentation(false)} />
                </div>
             )}
          </div>

          {/* Persistent "Explore Detail" Button - Floating above map */}
          {!showPresentation && (
            <button 
              onClick={() => setShowPresentation(true)}
              className="absolute top-10 right-10 z-[200] flex items-stretch shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-95 group animate-in slide-in-from-top-4 duration-1000"
            >
              <div className="bg-[#eaf7f9] border-[2.5px] border-[#000080] px-6 flex items-center justify-center transition-colors group-hover:bg-[#dcf3f6] shadow-lg">
                <span className="text-[#cf2e2e] font-black text-3xl font-display">I</span>
              </div>
              <div className="bg-white border-[2.5px] border-l-0 border-[#000080] px-8 py-5 transition-colors group-hover:bg-[#f8fafc] shadow-lg">
                 <h2 className="text-sm md:text-base font-black tracking-tight text-[#000080] whitespace-nowrap uppercase font-display max-w-[300px] overflow-hidden truncate">
                   {currentNavLabel}
                 </h2>
              </div>
            </button>
          )}

          {/* Map Overlay Components */}
          {!showPresentation && (
            <div className="absolute bottom-10 left-10 z-[100] bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-slate-200/50 w-80 animate-in slide-in-from-left-4 duration-500">
               <h4 className="font-black text-slate-900 mb-5 uppercase tracking-tighter text-[12px] flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                 Légende Territoriale
               </h4>
               <div className="grid grid-cols-1 gap-3">
                 {[
                   { id: 'AEROPORT', lbl: "Aéroport" },
                   { id: 'BARRAGE', lbl: "Barrages" },
                   { id: 'ZI', lbl: "Zones Industrielles" },
                   { id: 'CENTRE', lbl: "Centres Émergents" }
                 ].map((item) => {
                   const config = FEATURE_CATEGORIES[item.id as keyof typeof FEATURE_CATEGORIES];
                   const count = categoryCounts[item.id as keyof typeof categoryCounts];
                   return (
                     <div key={item.id} className="flex items-center justify-between group transition-all duration-200 hover:translate-x-1">
                       <div className="flex items-center gap-4">
                         <div 
                           className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm border transition-all"
                           style={{ 
                             backgroundColor: `${config.hex}10`, 
                             color: config.hex, 
                             borderColor: `${config.hex}30` 
                           }}
                         >
                           {typeof config.icon === 'string' ? config.icon : <div className="w-6 h-6">{config.icon}</div>}
                         </div>
                         <span className="text-[12px] text-slate-700 font-bold">{item.lbl}</span>
                       </div>
                       <span className="text-[11px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
                         {count}
                       </span>
                     </div>
                   );
                 })}
               </div>
            </div>
          )}

          {selectedCommune && !showPresentation && (
            <div className="absolute top-4 right-4 bottom-4 w-full md:w-96 z-[300] pointer-events-none flex flex-col">
               <div className="pointer-events-auto h-full">
                  <ProjectList commune={selectedCommune} onClose={() => setSelectedCommune(null)} />
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;