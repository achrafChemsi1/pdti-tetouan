import React, { useState, useMemo } from 'react';
import { Project, SectorType, CommuneAggregated, SectorConfig } from './types';
import { projectsData } from './services/projectData';
import { StatCard } from './components/StatCard';
import { SectorTabs } from './components/SectorTabs';
import { ProjectList } from './components/ProjectList';
import { DashboardMap } from './components/DashboardMap';
import { InvestmentChart } from './components/InvestmentChart';

// --- Configurations ---
const SECTOR_CONFIG: Record<SectorType, SectorConfig> = {
  [SectorType.Emploi]: { label: "Emploi", icon: "💼", color: "text-indigo-600", hex: "#4f46e5" },
  [SectorType.Education]: { label: "Éducation", icon: "🎓", color: "text-pink-500", hex: "#ec4899" },
  [SectorType.Sante]: { label: "Santé", icon: "🏥", color: "text-cyan-500", hex: "#06b6d4" },
  [SectorType.Eau]: { label: "Eau", icon: "💧", color: "text-teal-500", hex: "#14b8a6" },
  [SectorType.MiseNiveauTerritoriale]: { label: "Mise à Niveau", icon: "🏗️", color: "text-amber-500", hex: "#f59e0b" },
};

const ALL_SECTORS_KEY = 'Tous';
const ALL_SECTORS_CONFIG: SectorConfig = {
  label: "Tous les secteurs",
  icon: "🌍",
  color: "text-slate-700",
  hex: "#334155" // Slate-700 for global neutral view
};

// Merge for display in the sidebar
const DISPLAY_SECTOR_CONFIG: Record<string, SectorConfig> = {
  [ALL_SECTORS_KEY]: ALL_SECTORS_CONFIG,
  ...SECTOR_CONFIG
};

const App: React.FC = () => {
  // currentSector can be a SectorType or 'Tous'
  const [currentSector, setCurrentSector] = useState<string>(ALL_SECTORS_KEY);
  const [selectedCommune, setSelectedCommune] = useState<CommuneAggregated | null>(null);

  // --- Data Aggregation Logic ---
  
  // 1. Identify Unique Projects (deduplicated by project_id)
  // This ensures that shared projects are only counted once for global totals (Chart).
  const uniqueProjects = useMemo(() => {
    const seen = new Set<number>();
    return projectsData.filter(p => {
      if (seen.has(p.project_id)) return false;
      seen.add(p.project_id);
      return true;
    });
  }, []);

  // 2. Filter projects by sector for the map
  const filteredProjects = useMemo(() => {
    if (currentSector === ALL_SECTORS_KEY) {
      return projectsData;
    }
    return projectsData.filter(p => p.sector === currentSector);
  }, [currentSector]);

  // 3. Aggregate filtered projects by commune for map markers
  const aggregatedCommunes = useMemo(() => {
    const map = new Map<string, CommuneAggregated>();
    
    filteredProjects.forEach(proj => {
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
      comm.totalJobs += proj.jobs_planned;
      comm.totalNJT += proj.njt;
    });
    
    return Array.from(map.values());
  }, [filteredProjects]);

  // 4. Sector Stats 
  // Calculates stats based on the currently selected view (All or Specific Sector)
  const stats = useMemo(() => {
    // Deduplicate projects within the filtered set to avoid double counting shared projects
    const uniqueFilteredProjects = filteredProjects.filter((p, index, self) => 
      index === self.findIndex((t) => t.project_id === p.project_id)
    );

    const totalCost = uniqueFilteredProjects.reduce((acc, p) => acc + p.cost_mdh, 0);
    const totalProjects = uniqueFilteredProjects.length;
    const totalJobs = uniqueFilteredProjects.reduce((acc, p) => acc + p.jobs_planned, 0);
    const totalNJT = uniqueFilteredProjects.reduce((acc, p) => acc + p.njt, 0);
    
    return { totalCost, totalProjects, totalJobs, totalNJT };
  }, [filteredProjects]);

  // 5. Chart Data (Total Investment by Sector based on Unique Projects - Global Context)
  const chartData = useMemo(() => {
    const sums: Record<string, number> = {};
    Object.values(SectorType).forEach(s => sums[s] = 0);
    
    uniqueProjects.forEach(p => {
      if (sums[p.sector] !== undefined) {
        sums[p.sector] += p.cost_mdh;
      }
    });

    return Object.entries(sums).map(([key, value]) => ({
      name: SECTOR_CONFIG[key as SectorType].label,
      value: Math.round(value),
      type: key as SectorType
    }));
  }, [uniqueProjects]);

  // --- Handlers ---

  const handleSectorChange = (sector: string) => {
    setCurrentSector(sector);
    setSelectedCommune(null);
  };

  const handleCommuneSelect = (commune: CommuneAggregated) => {
    setSelectedCommune(commune);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 z-20 shadow-sm relative">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-800 tracking-tight">
            <span className="text-brand-600">PDTI</span> Tétouan 2026
          </h1>
          <p className="text-xs text-slate-500 font-medium">Programme de Développement Territorial Intégré</p>
        </div>
        <div className="flex gap-4">
           <div className="h-8 w-8 rounded-full bg-slate-200"></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Sidebar: Controls & Global Stats */}
        <aside className="w-80 lg:w-96 flex flex-col bg-slate-50 border-r border-slate-200 overflow-y-auto shrink-0 z-10 custom-scrollbar">
          <div className="p-6 space-y-8">
            
            {/* Sector Tabs */}
            <SectorTabs 
              sectors={DISPLAY_SECTOR_CONFIG} 
              currentSector={currentSector} 
              onSelect={handleSectorChange} 
            />

            {/* Stats Metrics */}
            <div>
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 px-2 flex justify-between items-center">
                <span>Indicateurs</span>
                <span 
                  className="text-[10px] font-bold py-0.5 px-2 rounded-full bg-slate-100 text-slate-600 truncate max-w-[120px]"
                >
                  {DISPLAY_SECTOR_CONFIG[currentSector].label}
                </span>
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <StatCard 
                  label="Investissement" 
                  value={Math.round(stats.totalCost)} 
                  suffix="MDH"
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="Projets" value={stats.totalProjects} />
                  <StatCard label="Emplois" value={stats.totalJobs} />
                </div>
                <StatCard 
                  label="Jours de Travail" 
                  value={stats.totalNJT.toLocaleString('fr-FR')} 
                  suffix="NJT"
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
              </div>
            </div>

            {/* Chart */}
            <div className="h-48 bg-white rounded-xl p-4 shadow-sm border border-slate-100">
               <p className="text-xs font-bold text-slate-400 uppercase mb-2">Répartition Investissement</p>
               <InvestmentChart data={chartData} sectorConfigs={SECTOR_CONFIG} />
            </div>

          </div>
        </aside>

        {/* Center: Map */}
        <main className="flex-1 relative bg-slate-100 p-4 lg:p-6 flex flex-col">
          <div className="absolute inset-0 z-0 p-4 lg:p-6">
             <DashboardMap 
                communes={aggregatedCommunes} 
                selectedCommune={selectedCommune}
                sectorConfig={DISPLAY_SECTOR_CONFIG[currentSector]}
                onCommuneSelect={handleCommuneSelect}
             />
          </div>

          {/* Floating Legend */}
          <div className="absolute bottom-8 right-8 z-[400] bg-white/90 backdrop-blur rounded-lg shadow-lg p-4 text-xs max-w-xs hidden lg:block border border-slate-100">
             <h4 className="font-bold text-slate-700 mb-2">Légende</h4>
             <div className="flex items-center gap-2 mb-1">
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DISPLAY_SECTOR_CONFIG[currentSector].hex }}></div>
               <span className="text-slate-600">Projets {DISPLAY_SECTOR_CONFIG[currentSector].label}</span>
             </div>
             <p className="text-slate-400 mt-2 italic">La taille du cercle indique le volume d'investissement.</p>
          </div>

          {/* Overlay Panel for Commune Details */}
          {selectedCommune && (
            <div className="absolute top-4 right-4 bottom-4 w-full md:w-96 z-[500] pointer-events-none flex flex-col justify-end md:justify-start">
               {/* Wrapper to allow pointer events on the panel itself */}
               <div className="pointer-events-auto h-2/3 md:h-full">
                  <ProjectList 
                    commune={selectedCommune} 
                    onClose={() => setSelectedCommune(null)} 
                  />
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;