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
import { COMMUNE_DATA } from './services/communeData';

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
  ALL: { label: "Tout le Répertoire", icon: "🗺️", color: "text-slate-500", hex: "#64748b" },
  AEROPORT: { label: "Aéroports", icon: "✈️", color: "text-indigo-600", hex: "#4f46e5" },
  BARRAGE: { label: "Barrages", icon: <DropIcon />, color: "text-blue-600", hex: "#2563eb" },
  ZI: { label: "Zones Industrielles", icon: "🏭", color: "text-amber-600", hex: "#d97706" },
  CENTRE: { label: "Centres Émergents", icon: <MedicalKitIcon />, color: "text-emerald-600", hex: "#059669" },
  LITTORAL: { label: "Linéaire Littoral", icon: "〰️", color: "text-blue-700", hex: "#1d4ed8" }
};

type SectionId = 'diagnostics' | 'priorities' | 'synthesis';

interface NavItem {
  id: SectionId;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'diagnostics', label: 'DIAGNOSTICS ET FORMULATION DES PROJETS PAR AXE' },
  { id: 'priorities', label: 'PROJETS PRIORITAIRES AU TITRE DE L’ANNÉE 2026' },
  { id: 'synthesis', label: 'SYNTHÈSE PROVINCIALE' }
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
      LITTORAL: 1
    };
    return counts;
  }, [allPOI]);

  const stats = useMemo(() => {
    const filtered = currentCategory === 'ALL' ? allPOI : allPOI.filter(p => p.type === currentCategory);
    return {
      metric1Label: "Unités Recensées",
      metric1Value: filtered.length,
      metric2Label: currentCategory === 'BARRAGE' ? "Retenue (Hm3)" : "Points Géo",
      metric2Value: currentCategory === 'BARRAGE' ? 350 : new Set(filtered.map(f => f.NOM)).size
    };
  }, [allPOI, currentCategory]);

  const totalPopulation = useMemo(() => {
    return Object.values(COMMUNE_DATA).reduce((sum, c) => sum + c.population, 0);
  }, []);

  const aggregatedCommunes = useMemo(() => {
    const map = new Map<string, CommuneAggregated>();
    projectsData.forEach(proj => {
      if (!map.has(proj.commune_name)) {
        map.set(proj.commune_name, {
          name: proj.commune_name, lat: proj.latitude, lng: proj.longitude,
          projects: [], totalCost: 0, totalJobs: 0, totalNJT: 0,
          population: COMMUNE_DATA[proj.commune_name.toUpperCase()]?.population
        });
      }
      const comm = map.get(proj.commune_name)!;
      comm.projects.push(proj);
      comm.totalCost += proj.cost_mdh;
    });
    return Array.from(map.values());
  }, []);

  const currentNavLabel = NAV_ITEMS.find(n => n.id === activeSection)?.label || '';

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f1f5f9] font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 z-[100] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#000080] rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shrink-0">T</div>
          <div className="flex flex-col">
            <h1 className="text-base md:text-lg font-black text-[#000080] tracking-tight leading-none mb-1">
              Projet du PDTI de la Province de Tétouan
            </h1>
            <p className="text-[10px] md:text-[11px] text-slate-500 font-bold italic tracking-tight leading-none uppercase">
              (La 1ère Tranche Prioritaire, Au titre de l’Année 2026)
            </p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center border-[2.5px] border-[#000080] rounded-xl overflow-hidden bg-slate-50/40 max-w-[65%]">
          {NAV_ITEMS.map((item, idx) => (
            <React.Fragment key={item.id}>
              {idx > 0 && <div className="w-[2px] h-6 bg-[#000080]/20" />}
              <button
                onClick={() => {
                  setActiveSection(item.id);
                  setShowPresentation(false);
                  setSelectedCommune(null);
                  setSelectedPOI(null);
                }}
                className={`px-5 py-3.5 text-[9px] font-black uppercase tracking-[0.05em] transition-all leading-tight text-center ${activeSection === item.id
                  ? 'bg-[#000080] text-white'
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
        <aside className="w-85 lg:w-96 flex flex-col bg-white border-r border-slate-200 overflow-y-auto shrink-0 z-10 custom-scrollbar shadow-lg">
          <div className="p-5 space-y-8">
            <FeatureTabs
              categories={Object.fromEntries(Object.entries(FEATURE_CATEGORIES).filter(([k]) => k !== 'LITTORAL')) as any}
              currentCategory={currentCategory}
              onSelect={(k) => { setCurrentCategory(k); setSelectedPOI(null); setSelectedCommune(null); }}
              counts={categoryCounts}
            />
            <FeatureList
              filter={currentCategory}
              onFeatureSelect={(coords, name) => { setSelectedPOI({ coords, name }); setSelectedCommune(null); }}
              activeFeatureName={selectedPOI?.name || null}
            />
            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4 px-2">Indicateurs de Couverture</h3>
              <div className="grid grid-cols-1 gap-3">
                <StatCard label={stats.metric1Label} value={stats.metric1Value} icon={<div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#000080' }}></div>} />
                <StatCard label={stats.metric2Label} value={stats.metric2Value} />
                <StatCard label="Population Totale" value={totalPopulation.toLocaleString('fr-FR')} icon="👥" />
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 relative bg-slate-100 overflow-hidden">
          <div className="absolute inset-0 z-0">
            {!showPresentation ? (
              <div key={activeSection} className="w-full h-full p-4 lg:p-6 animate-in fade-in zoom-in-95 duration-500">
                <DashboardMap
                  communes={aggregatedCommunes}
                  selectedCommune={selectedCommune}
                  selectedPOI={selectedPOI}
                  sectorConfig={FEATURE_CATEGORIES[currentCategory as keyof typeof FEATURE_CATEGORIES] || FEATURE_CATEGORIES.ALL}
                  onCommuneSelect={setSelectedCommune}
                />
              </div>
            ) : (
              <div className="w-full h-full animate-in fade-in duration-500 bg-slate-900">
                <ProvincePresentation onClose={() => setShowPresentation(false)} />
              </div>
            )}
          </div>

          {!showPresentation && (
            <button
              onClick={() => setShowPresentation(true)}
              className="absolute top-10 right-10 z-[150] flex items-stretch shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.02] active:scale-95 group animate-in slide-in-from-top-4 duration-700"
            >
              <div className="bg-[#eaf7f9] border-[2.5px] border-[#000080] px-6 flex items-center justify-center transition-colors group-hover:bg-[#dcf3f6]">
                <span className="text-[#cf2e2e] font-black text-3xl font-display">I</span>
              </div>
              <div className="bg-white border-[2.5px] border-l-0 border-[#000080] px-8 py-5 flex items-center">
                <h2 className="text-[11px] md:text-[13px] font-black tracking-tight text-[#000080] whitespace-nowrap uppercase font-display max-w-[320px] truncate leading-tight">
                  {currentNavLabel}
                </h2>
              </div>
            </button>
          )}

          {!showPresentation && (
            <div className="absolute bottom-10 left-10 z-[100] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-slate-200 w-80 animate-in slide-in-from-left-4 duration-500">
              <h4 className="font-black text-[#000080] mb-5 uppercase tracking-tighter text-[11px] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Légende Territoriale
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'AEROPORT', lbl: "Aéroport" },
                  { id: 'BARRAGE', lbl: "Barrages" },
                  { id: 'ZI', lbl: "Zones Industrielles" },
                  { id: 'CENTRE', lbl: "Centres Émergents" },
                  { id: 'LITTORAL', lbl: "Linéaire Littoral" }
                ].map((item) => {
                  const config = FEATURE_CATEGORIES[item.id as keyof typeof FEATURE_CATEGORIES];
                  return (
                    <div key={item.id} className="flex items-center justify-between group transition-all duration-200">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border" style={{ backgroundColor: `${config.hex}10`, color: config.hex, borderColor: `${config.hex}30` }}>
                          {item.id === 'LITTORAL' ? (
                            <div className="w-6 h-1 rounded-full" style={{ backgroundColor: config.hex }}></div>
                          ) : (
                            typeof config.icon === 'string' ? config.icon : <div className="w-5 h-5">{config.icon}</div>
                          )}
                        </div>
                        <span className="text-[12px] text-slate-700 font-bold uppercase tracking-tight">{item.lbl}</span>
                      </div>
                      {item.id !== 'LITTORAL' && <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">{categoryCounts[item.id]}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}


        </main>
      </div>
    </div>
  );
};

export default App;