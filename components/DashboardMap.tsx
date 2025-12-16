import React, { useMemo } from 'react';
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
  
  React.useEffect(() => {
    if (center) {
      map.flyTo(center, 11.5, { duration: 1.2, easeLinearity: 0.25 });
    }
  }, [center?.[0], center?.[1], selectedName, map]); 
  
  return null;
};

const mapStyle = `
  path.leaflet-interactive {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    outline: none;
  }
  .leaflet-container {
    background: #e2e8f0;
  }
  .commune-tooltip {
    background: transparent;
    border: none;
    box-shadow: none;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    color: #334155;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.05em;
    text-shadow: 
      2px 0 #fff, -2px 0 #fff, 0 2px #fff, 0 -2px #fff,
      1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff;
  }
`;

export const DashboardMap: React.FC<DashboardMapProps> = ({ communes, selectedCommune, sectorConfig, onCommuneSelect }) => {
  
  const provinceFeatures = useMemo(() => {
    return getTetouanProvinceGeoJSON();
  }, []);

  // Determine styling for each commune polygon based on active data and selection
  const style = (feature: any) => {
    const communeName = feature?.properties?.name;
    // Check if this commune is in the current filtered list (active in this sector)
    const hasData = communes.some(c => c.name === communeName);
    const isSelected = selectedCommune?.name === communeName;

    return {
      fillColor: hasData ? sectorConfig.hex : '#94a3b8', // Active Sector Color OR Slate
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: '#ffffff', // White borders
      dashArray: hasData ? '' : '3, 4', // Dotted lines for inactive areas
      fillOpacity: hasData ? (isSelected ? 0.9 : 0.65) : 0.1, // Dim inactive areas significantly
      className: hasData ? 'cursor-pointer' : 'cursor-default'
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const communeName = feature.properties.name;
    
    // Bind a clean text label
    layer.bindTooltip(communeName, {
      permanent: false,
      direction: 'center',
      className: 'commune-tooltip',
      opacity: 1
    });

    // Interaction handlers
    layer.on({
      click: () => {
        const matchingCommune = communes.find(c => c.name === communeName);
        if (matchingCommune) {
          onCommuneSelect(matchingCommune);
        }
      },
      mouseover: (e) => {
        const matchingCommune = communes.find(c => c.name === communeName);
        if (matchingCommune) {
          const layer = e.target;
          layer.setStyle({
            weight: 3,
            color: '#ffffff',
            fillOpacity: 0.85
          });
          layer.bringToFront();
        }
      },
      mouseout: (e) => {
        const layer = e.target;
        // The geojson style function will re-apply via React rendering, 
        // but for immediate feedback we can manually reset simplistic properties
        const hasData = communes.some(c => c.name === communeName);
        const isSelected = selectedCommune?.name === communeName;
        
        if (hasData) {
          layer.setStyle({
            weight: isSelected ? 3 : 1,
            fillOpacity: isSelected ? 0.9 : 0.65
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