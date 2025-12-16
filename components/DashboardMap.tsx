import React, { useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet';
import { CommuneAggregated, SectorConfig } from '../types';
import { getTetouanProvinceGeoJSON } from '../services/adminBoundaries';
import L from 'leaflet';

interface DashboardMapProps {
  communes: CommuneAggregated[];
  selectedCommune: CommuneAggregated | null;
  sectorConfig: SectorConfig;
  onCommuneSelect: (commune: CommuneAggregated) => void;
}

// Helper component to update view when selected commune changes
const MapUpdater: React.FC<{ center: [number, number] | null; selectedName?: string }> = ({ center, selectedName }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, 11.5, { duration: 1.2, easeLinearity: 0.25 });
    }
  }, [center, selectedName, map]); 
  
  return null;
};

const mapStyle = `
  path.leaflet-interactive {
    transition: fill-opacity 0.3s ease, stroke-width 0.3s ease, fill 0.3s ease;
    outline: none;
  }
  .leaflet-container {
    background: #e2e8f0;
  }
  .commune-tooltip {
    background: rgba(255, 255, 255, 0.95);
    border: none;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    color: #334155;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.05em;
    padding: 4px 8px;
    border-radius: 6px;
  }
  /* Glow effect for selected commune */
  .selected-commune-glow {
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.3));
    z-index: 1000;
  }
`;

export const DashboardMap: React.FC<DashboardMapProps> = ({ communes, selectedCommune, sectorConfig, onCommuneSelect }) => {
  
  const provinceFeatures = useMemo(() => {
    return getTetouanProvinceGeoJSON();
  }, []);

  // Refs to hold latest props for event handlers (avoiding stale closures in onEachFeature)
  const communesRef = useRef(communes);
  const selectedCommuneRef = useRef(selectedCommune);
  const sectorConfigRef = useRef(sectorConfig);

  useEffect(() => {
    communesRef.current = communes;
    selectedCommuneRef.current = selectedCommune;
    sectorConfigRef.current = sectorConfig;
  }, [communes, selectedCommune, sectorConfig]);

  // Determine styling for each commune polygon based on active data and selection
  // This function runs on every render when props change
  const style = (feature: any) => {
    const communeName = feature?.properties?.name;
    // Check if this commune is in the current filtered list (active in this sector)
    const hasData = communes.some(c => c.name === communeName);
    const isSelected = selectedCommune?.name === communeName;

    if (hasData) {
      // Active Project Commune Style
      return {
        fillColor: sectorConfig.hex,
        weight: isSelected ? 4 : 1.5, // Thicker border for selected
        opacity: 1,
        color: '#ffffff', // Clean white border
        dashArray: '',
        fillOpacity: isSelected ? 0.9 : 0.6, // Higher opacity for selected
        className: `cursor-pointer ${isSelected ? 'selected-commune-glow' : ''}`
      };
    } else {
      // Inactive/No-Project Commune Style
      return {
        fillColor: '#f1f5f9', // Very light slate
        weight: 1,
        opacity: 1,
        color: '#cbd5e1', // Slate-300 border
        dashArray: '4, 6', // Dashed to indicate inactivity/border only
        fillOpacity: 0.4,
        className: 'cursor-default'
      };
    }
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const communeName = feature.properties.name;
    
    // Bind a clean text label
    layer.bindTooltip(communeName, {
      permanent: false,
      direction: 'center',
      className: 'commune-tooltip',
      opacity: 0.9
    });

    // Interaction handlers
    layer.on({
      click: (e) => {
        L.DomEvent.stopPropagation(e); // Prevent map click propogation
        
        const currentCommunes = communesRef.current;
        const matchingCommune = currentCommunes.find(c => c.name === communeName);
        
        if (matchingCommune) {
          // Trigger selection in parent
          onCommuneSelect(matchingCommune);
          
          // Visual feedback immediately
          const target = e.target as L.Path;
          target.bringToFront();
          
          // Apply distinct visual style immediately
          target.setStyle({
            weight: 4,
            fillOpacity: 0.9,
            color: '#ffffff',
            fillColor: sectorConfigRef.current.hex
          });
        }
      },
      mouseover: (e) => {
        const currentCommunes = communesRef.current;
        const currentSelected = selectedCommuneRef.current;
        const currentSectorConfig = sectorConfigRef.current;

        const matchingCommune = currentCommunes.find(c => c.name === communeName);
        const isSelected = currentSelected?.name === communeName;
        const layer = e.target as L.Path;
        
        layer.bringToFront();
        
        if (matchingCommune) {
          // If it's already selected, keep it styled as such
          if (isSelected) return;

          // Highlight active (unselected)
          layer.setStyle({
            weight: 3,
            color: '#ffffff',
            fillOpacity: 0.85,
            fillColor: currentSectorConfig.hex 
          });
        } else {
          // Subtle highlight for inactive
          layer.setStyle({
            weight: 2,
            color: '#94a3b8', // Darker slate border
            fillOpacity: 0.6,
            fillColor: '#e2e8f0' // Slightly darker fill
          });
        }
      },
      mouseout: (e) => {
        const currentCommunes = communesRef.current;
        const currentSelected = selectedCommuneRef.current;
        const currentSectorConfig = sectorConfigRef.current;

        const layer = e.target as L.Path;
        const matchingCommune = currentCommunes.find(c => c.name === communeName);
        const isSelected = currentSelected?.name === communeName;
        
        if (matchingCommune) {
          // Revert to Active Style based on selection state
          layer.setStyle({
            weight: isSelected ? 4 : 1.5,
            color: '#ffffff',
            fillOpacity: isSelected ? 0.9 : 0.6,
            fillColor: currentSectorConfig.hex,
            dashArray: ''
          });
          
          // Ensure selected stays on top
          if (isSelected) {
            layer.bringToFront();
          }

        } else {
          // Revert to Inactive Style
          layer.setStyle({
            weight: 1,
            color: '#cbd5e1',
            fillOpacity: 0.4,
            fillColor: '#f1f5f9',
            dashArray: '4, 6'
          });
        }
      }
    });
  };

  return (
    <>
      <style>{mapStyle}</style>
      <MapContainer 
        center={[35.53, -5.40]} 
        zoom={10} 
        className="w-full h-full rounded-2xl shadow-inner outline-none z-0 border border-white"
        zoomControl={false}
        scrollWheelZoom={true}
        doubleClickZoom={false}
      >
        {/* Minimalist Basemap */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
          opacity={0.8}
        />

        {/* Administrative Polygons Layer */}
        <GeoJSON 
            // We cast to any here because standard GeoJSON types can be strict about feature properties
            data={provinceFeatures as any}
            style={style}
            onEachFeature={onEachFeature}
        />

        <MapUpdater 
          center={selectedCommune ? [selectedCommune.lat, selectedCommune.lng] : null} 
          selectedName={selectedCommune?.name}
        />
      </MapContainer>
    </>
  );
};