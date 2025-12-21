import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Project, SectorType, CommuneAggregated, SectorConfig } from './types';
import { projectsData } from './services/projectData';
import { StatCard } from './components/StatCard';
import { SectorTabs } from './components/SectorTabs';
import { ProjectList } from './components/ProjectList';
import { DashboardMap } from './components/DashboardMap';
import { InvestmentChart } from './components/InvestmentChart';
import { SectoralOverview } from './components/SectoralOverview';

// --- Configurations ---
const SECTOR_CONFIG: Record<SectorType, SectorConfig> = {
  [SectorType.Emploi]: { label: "Emploi", icon: "💼", color: "text-indigo-600", hex: "#6366f1" },
  [SectorType.Education]: { label: "Éducation", icon: "🎓", color: "text-pink-500", hex: "#ec4899" },
  [SectorType.Sante]: { label: "Santé", icon: "🏥", color: "text-cyan-500", hex: "#22d3ee" },
  [SectorType.Eau]: { label: "Eau", icon: "💧", color: "text-blue-500", hex: "#3b82f6" },
  [SectorType.MiseNiveauTerritoriale]: { label: "Mise à Niveau", icon: "🏗️", color: "text-amber-500", hex: "#f59e0b" },
};

const ALL_SECTORS_KEY = 'Tous';
const ALL_SECTORS_CONFIG: SectorConfig = {
  label: "Global",
  icon: "🌍",
  color: "text-slate-400",
  hex: "#94a3b8" 
};

const DISPLAY_SECTOR_CONFIG: Record<string, SectorConfig> = {
  [ALL_SECTORS_KEY]: ALL_SECTORS_CONFIG,
  ...SECTOR_CONFIG
};

const App: React.FC = () => {
  const [currentSector, setCurrentSector] = useState<string>(ALL_SECTORS_KEY);
  const [selectedCommuneName, setSelectedCommuneName] = useState<string | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  
  // Dragging State
  const [panelOffset, setPanelOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, offX: 0, offY: 0 });

  const onDragStart = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      offX: panelOffset.x,
      offY: panelOffset.y
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [panelOffset]);

  const onDragMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPanelOffset({
      x: dragStart.current.offX + dx,
      y: dragStart.current.offY + dy
    });
  }, [isDragging]);

  const onDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Aggregation logic preserved from previous steps...
  const sectorData = useMemo(() => {
    if (currentSector === ALL_SECTORS_KEY) return projectsData;
    return projectsData.filter(p => p.sector === currentSector);
  }, [currentSector]);

  const fullSectorCommunes = useMemo(() => {
    const map = new Map<string, CommuneAggregated>();
    sectorData.forEach(proj => {
      if (!map.has(proj.commune_name)) {
        map.set(proj.commune_name, {
          name: proj.commune_name, lat: proj.latitude, lng: proj.longitude,
          projects: [], totalCost: 0, totalJobs: 0, totalNJT: 0
        });
      }
      const comm = map.get(proj.commune_name)!;
      comm.projects.push(proj);
      comm.totalCost += proj.cost_mdh;
      comm.totalJobs += proj.jobs_planned;
    });
    return map;
  }, [sectorData]);

  const mapAggregatedCommunes = useMemo(() => {
    const data = selectedProgramId ? sectorData.filter(p => p.project_id === selectedProgramId) : sectorData;
    const map = new Map<string, CommuneAggregated>();
    data.forEach(proj => {
      if (!map.has(proj.commune_name)) {
        map.set(proj.commune_name, {
          name: proj.commune_name, lat: proj.latitude, lng: proj.longitude,
          projects: [], totalCost: 0, totalJobs: 0, totalNJT: 0
        });
      }
      const comm = map.get(proj.commune_name)!;
      comm.projects.push(proj);
      comm.totalCost += proj.cost_mdh;
      comm.totalJobs += proj.jobs_planned;
    });
    return Array.from(map.values());
  }, [sectorData, selectedProgramId]);

  const groupedPrograms = useMemo(() => {
    const map = new Map<number, { id: number, title: string, cost: number, communes: string[] }>();
    sectorData.forEach(p => {
      if (!map.has(p.project_id)) {
        map.set(p.project_id, { id: p.project_id, title: p.project_title, cost: p.cost_mdh, communes: [p.commune_name] });
      } else {
        const entry = map.get(p.project_id)!;
        if (!entry.communes.includes(p.commune_name)) entry.communes.push(p.commune_name);
      }
    });
    return Array.from(map.values());
  }, [sectorData]);

  const stats = useMemo(() => {
    const seen = new Set<number>();
    const unique = sectorData.filter(p => !seen.has(p.project_id) && seen.add(p.project_id));
    return {
      totalCost: unique.reduce((acc, p) => acc + p.cost_mdh, 0),
      totalProjects: unique.length,
      totalJobs: unique.reduce((acc, p) => acc + p.jobs_planned, 0)
    };
  }, [sectorData]);

  const chartData = useMemo(() => {
    return Object.values(SectorType).map(s => {
      const unique = projectsData.filter(p => p.sector === s).filter((p, i, self) => i === self.findIndex(t => t.project_id === p.project_id));
      return { name: SECTOR_CONFIG[s].label, value: Math.round(unique.reduce((acc, p) => acc + p.cost_mdh, 0)), type: s };
    });
  }, []);

  const handleSectorChange = (s: string) => {
    setCurrentSector(s);
    setSelectedCommuneName(null);
    setSelectedProgramId(null); 
  };

  const handleProgramClick = (id: number) => {
    setSelectedProgramId(prev => prev === id ? null : id);
    setSelectedCommuneName(null); 
  };

  const selectedCommuneData = selectedCommuneName ? fullSectorCommunes.get(selectedCommuneName) : null;

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-100 font-sans overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-80 lg:w-[420px] h-full bg-slate-900/40 backdrop-blur-2xl border-r border-white/5 flex flex-col z-30 shadow-2xl overflow-y-auto custom-scrollbar">
        <div className="p-8 space-y-8">
          <header className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(79,70,229,0.4)]">T</div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-display">PDTI Tétouan</h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 pl-1">Stratégie Territoriale 2026</p>
          </header>

          <SectorTabs sectors={DISPLAY_SECTOR_CONFIG} currentSector={currentSector} onSelect={handleSectorChange} />

          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2 flex items-center justify-between">
              <span>Indicateurs Consolidés</span>
              {selectedProgramId && (
                <span className="text-[8px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-md border border-indigo-500/20 animate-pulse">Focus Programme</span>
              )}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <StatCard label="Investissement" value={Math.round(stats.totalCost)} suffix="MDH" />
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Programmes" value={stats.totalProjects} />
                <StatCard label="Impact" value={stats.totalJobs} suffix="Empl." />
              </div>
            </div>
          </div>

          {currentSector === ALL_SECTORS_KEY && (
            <div className="bg-slate-800/10 rounded-[2rem] p-6 border border-white/5 shadow-inner">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Volume par Secteur</h3>
               <div className="h-56">
                 <InvestmentChart data={chartData} sectorConfigs={SECTOR_CONFIG} />
               </div>
            </div>
          )}
        </div>
      </aside>

      {/* Map Center */}
      <main className="flex-1 relative h-full bg-slate-950">
        <div className="absolute inset-0 p-4 lg:p-10">
          <DashboardMap 
            communes={mapAggregatedCommunes} 
            selectedCommune={selectedCommuneData || null}
            sectorConfig={DISPLAY_SECTOR_CONFIG[currentSector]}
            activeSector={currentSector}
            selectedProgramId={selectedProgramId}
            onCommuneSelect={(c) => setSelectedCommuneName(c.name)}
          />
        </div>

        {/* Floating Draggable Panels Overlay */}
        <div 
          style={{ 
            transform: `translate(${panelOffset.x}px, ${panelOffset.y}px)`,
          }}
          className={`absolute top-14 right-14 bottom-14 w-[420px] z-40 pointer-events-none transition-shadow duration-300 ${isDragging ? 'shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]' : ''}`}
        >
          <div className="pointer-events-auto h-full flex flex-col gap-6">
            {selectedCommuneName ? (
              <ProjectList 
                commune={selectedCommuneData || null} 
                onClose={() => setSelectedCommuneName(null)} 
                onDragStart={onDragStart}
                onPointerMove={onDragMove}
                onPointerUp={onDragEnd}
              />
            ) : (
              currentSector !== ALL_SECTORS_KEY && (
                <SectoralOverview 
                  programs={groupedPrograms} 
                  config={DISPLAY_SECTOR_CONFIG[currentSector]} 
                  selectedProgramId={selectedProgramId}
                  onProgramClick={handleProgramClick}
                  onDragStart={onDragStart}
                  onPointerMove={onDragMove}
                  onPointerUp={onDragEnd}
                />
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;