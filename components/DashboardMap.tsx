import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { CommuneAggregated, SectorConfig } from '../types';

interface DashboardMapProps {
  communes: CommuneAggregated[];
  selectedCommune: CommuneAggregated | null;
  sectorConfig: SectorConfig;
  onCommuneSelect: (commune: CommuneAggregated) => void;
}

// Helper component to update view when selected commune changes
const MapUpdater: React.FC<{ center: [number, number] | null }> = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.flyTo(center, 12, { duration: 1.5, easeLinearity: 0.25 });
    }
  }, [center, map]);
  return null;
};

// Pulse animation styles
const pulseStyle = `
  @keyframes pulse-ring {
    0% { transform: scale(0.33); opacity: 0.8; }
    80%, 100% { opacity: 0; }
  }
  .leaflet-interactive {
    transition: all 0.3s ease;
  }
`;

export const DashboardMap: React.FC<DashboardMapProps> = ({ communes, selectedCommune, sectorConfig, onCommuneSelect }) => {
  return (
    <>
      <style>{pulseStyle}</style>
      <MapContainer 
        center={[35.460, -5.350]} 
        zoom={10} 
        className="w-full h-full rounded-2xl shadow-inner bg-slate-100"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {communes.map((commune) => {
          // Dynamic sizing based on cost
          const radius = Math.max(8, Math.min(25, Math.sqrt(commune.totalCost) * 3));
          const isSelected = selectedCommune?.name === commune.name;

          return (
            <CircleMarker
              key={commune.name}
              center={[commune.lat, commune.lng]}
              radius={radius}
              pathOptions={{
                fillColor: sectorConfig.hex,
                color: isSelected ? '#ffffff' : sectorConfig.hex,
                weight: isSelected ? 3 : 1,
                opacity: 1,
                fillOpacity: isSelected ? 0.9 : 0.6
              }}
              eventHandlers={{
                click: () => onCommuneSelect(commune)
              }}
            >
               <Popup closeButton={false} className="custom-popup">
                  <div className="p-1 text-center font-sans">
                    <h3 className="font-bold text-slate-800 text-base mb-1 font-display">{commune.name}</h3>
                    <div className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-full inline-block">
                      {commune.projects.length} projets
                    </div>
                    <div className="mt-2 text-brand-600 font-bold">
                      {commune.totalCost.toFixed(1)} MDH
                    </div>
                  </div>
               </Popup>
            </CircleMarker>
          );
        })}

        {selectedCommune && <MapUpdater center={[selectedCommune.lat, selectedCommune.lng]} />}
      </MapContainer>
    </>
  );
};