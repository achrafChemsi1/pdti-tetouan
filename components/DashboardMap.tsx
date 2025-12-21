import React, { useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet';
import { CommuneAggregated, SectorConfig, SectorType } from '../types';
import { getTetouanProvinceGeoJSON } from '../services/adminBoundaries';
import L from 'leaflet';

interface DashboardMapProps {
  communes: CommuneAggregated[];
  selectedCommune: CommuneAggregated | null;
  sectorConfig: SectorConfig;
  activeSector: string;
  selectedProgramId: number | null;
  onCommuneSelect: (commune: CommuneAggregated) => void;
}

const FitBounds: React.FC<{ data: any }> = ({ data }) => {
  const map = useMap();
  const hasFitted = useRef(false);

  useEffect(() => {
    // Only fit the bounds once on initial load to show the whole province
    if (data && !hasFitted.current) {
      const layer = L.geoJSON(data);
      map.fitBounds(layer.getBounds(), { padding: [50, 50], animate: true, duration: 1.8 });
      hasFitted.current = true;
    }
  }, [data, map]);
  return null;
};

const mapStyle = `
  .leaflet-container {
    background: #020617 !important;
    border-radius: 2.5rem;
    cursor: crosshair;
  }
  path.leaflet-interactive {
    transition: fill 0.6s cubic-bezier(0.4, 0, 0.2, 1), 
                fill-opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), 
                stroke 0.4s ease, 
                stroke-width 0.4s ease;
    outline: none;
  }
  .commune-tooltip {
    background: #0f172a !important;
    border: 1px solid #1e293b !important;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    color: #f8fafc !important;
    text-transform: uppercase;
    font-size: 9px;
    letter-spacing: 0.15em;
    padding: 6px 12px;
    border-radius: 6px;
    z-index: 1000;
  }
  .selected-glow {
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.7));
  }
`;

export const DashboardMap: React.FC<DashboardMapProps> = ({ 
  communes, 
  selectedCommune, 
  sectorConfig, 
  activeSector, 
  selectedProgramId,
  onCommuneSelect 
}) => {
  const provinceFeatures = useMemo(() => getTetouanProvinceGeoJSON(), []);
  
  const basemapUrl = useMemo(() => {
    switch (activeSector) {
      case SectorType.Eau:
        return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      case SectorType.Emploi:
        return "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png";
      case SectorType.Education:
        return "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";
      case SectorType.Sante:
        return "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}";
      case SectorType.MiseNiveauTerritoriale:
        return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";
      default:
        return "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png";
    }
  }, [activeSector]);

  const maskGeoJSON = useMemo(() => {
    const worldOuter = [[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]];
    const holes = provinceFeatures.features.map(f => {
      if (f.geometry.type === "Polygon") return f.geometry.coordinates[0];
      return [];
    }).filter(h => h.length > 0);

    return {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [worldOuter, ...holes] }
    };
  }, [provinceFeatures]);

  const communeStyle = (feature: any) => {
    const communeName = feature?.properties?.name;
    const isSelected = selectedCommune?.name === communeName;
    const matchingCommune = communes.find(c => c.name === communeName);
    const hasData = !!matchingCommune;
    
    const isLightMap = activeSector === SectorType.Education || activeSector === SectorType.Sante;

    // High contrast strokes
    const strokeColor = isLightMap ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.7)';
    const activeStrokeColor = '#ffffff';

    if (!hasData) {
      return {
        fillColor: 'transparent',
        fillOpacity: 0,
        weight: 3, 
        opacity: 0.2, 
        color: strokeColor,
        dashArray: '4, 8',
        interactive: false 
      };
    }

    const baseWeight = 4; 
    const selectedWeight = 8; 

    if (activeSector === SectorType.Eau) {
      return {
        fillColor: isSelected ? '#38bdf8' : '#0ea5e9',
        weight: isSelected ? selectedWeight : baseWeight,
        opacity: 1,
        color: '#ffffff',
        fillOpacity: isSelected ? 0.7 : 0.5,
        className: isSelected ? 'selected-glow' : ''
      };
    }

    return {
      fillColor: sectorConfig.hex,
      weight: isSelected ? selectedWeight : baseWeight,
      opacity: 1,
      color: isSelected ? activeStrokeColor : strokeColor,
      fillOpacity: isSelected ? 0.75 : 0.5,
      className: isSelected ? 'selected-glow' : ''
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const communeName = feature.properties.name;
    const matching = communes.find(c => c.name === communeName);

    if (matching) {
      layer.bindTooltip(communeName, { 
          sticky: true, 
          className: 'commune-tooltip', 
          direction: 'top', 
          offset: [0, -10] 
      });

      layer.on({
        mouseover: (e) => {
          const l = e.target;
          l.setStyle({ weight: 9, fillOpacity: 0.85, opacity: 1, color: '#fff' });
          l.bringToFront();
        },
        mouseout: (e) => {
          const l = e.target;
          l.setStyle(communeStyle(feature));
        },
        click: (e) => {
          L.DomEvent.stopPropagation(e);
          onCommuneSelect(matching);
        }
      });
    } else {
      layer.unbindTooltip();
      layer.off();
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden rounded-[3rem] border border-slate-800/50 shadow-inner">
      <style>{mapStyle}</style>

      <MapContainer 
        center={[35.53, -5.40]} 
        zoom={10} 
        className="w-full h-full z-0"
        zoomControl={false}
        attributionControl={false}
        maxBounds={[[34.0, -6.5], [37.0, -4.5]]}
        minZoom={9}
      >
        <TileLayer url={basemapUrl} />

        <GeoJSON 
          data={maskGeoJSON as any} 
          style={{ 
            fillColor: '#020617', 
            fillOpacity: activeSector === SectorType.Education ? 0.6 : 0.85, 
            weight: 0, 
            stroke: false 
          }} 
          interactive={false} 
        />

        <GeoJSON 
            key={`${activeSector}-${selectedProgramId}-${selectedCommune?.name}`}
            data={provinceFeatures as any}
            style={communeStyle}
            onEachFeature={onEachFeature}
        />

        {(activeSector !== SectorType.Eau && activeSector !== 'Tous') && (
           <TileLayer
             url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
             opacity={0.6}
           />
        )}

        <FitBounds data={provinceFeatures} />
      </MapContainer>

      {/* Analytics HUD */}
      <div className="absolute top-10 left-10 z-20 hidden lg:flex flex-col gap-2">
        <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-3xl px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full animate-ping absolute inset-0`} style={{backgroundColor: sectorConfig.hex}}></div>
            <div className={`w-3 h-3 rounded-full relative`} style={{backgroundColor: sectorConfig.hex}}></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
              {sectorConfig.label}
            </span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
              Axe Stratégique
            </span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.6)] z-10 rounded-[3rem]"></div>
    </div>
  );
};