import React, { useMemo, useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Vector as VectorSource, XYZ } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Fill, Stroke, Text, Circle as CircleStyle, Icon } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { CommuneAggregated, SectorConfig } from '../types';
import { getTetouanProvinceGeoJSON } from '../services/adminBoundaries';
import { LITTORAL_GEOJSON, CENTRES_EMERGENTS_GEOJSON, INFRASTRUCTURE_GEOJSON } from '../services/mapLayersData';

interface DashboardMapProps {
  communes: CommuneAggregated[];
  selectedCommune: CommuneAggregated | null;
  selectedPOI?: { coords: [number, number]; name: string } | null;
  sectorConfig: SectorConfig;
  onCommuneSelect: (commune: CommuneAggregated) => void;
}

// --- Specific Color Assets for Map Markers ---
const PLANE_ICON_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#4f46e5">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
`);

// Matching the requested medical kit briefcase icon, now in Emerald Green
const CENTRE_ICON_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <rect x="2" y="6" width="20" height="14" rx="2.5" fill="white" stroke="#059669" stroke-width="2.2"/>
    <path d="M9 6V4.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V6" fill="none" stroke="#059669" stroke-width="2.2"/>
    <path d="M12 9.5v7M8.5 13h7" fill="none" stroke="#059669" stroke-width="2.2" stroke-linecap="round"/>
  </svg>
`);

const FACTORY_ICON_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
    <path d="M2 22h20V12h-4V4h-4v8h-2V4H8v8H2v10z" fill="#d97706" stroke="#ffffff" stroke-width="1"/>
    <path d="M11 17h2v5h-2v-5z" fill="white"/>
  </svg>
`);

// Matching the requested water drop icon, now in True Blue (Blue 600)
const DAM_ICON_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
    <path d="M12 2.5s-7 8.5-7 12.5a7 7 0 0 0 14 0c0-4-7-12.5-7-12.5z" fill="#2563eb"/>
    <path d="M9 15.5a3.5 3.5 0 0 1 3.5-3.5" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" opacity="0.9"/>
  </svg>
`);

export const DashboardMap: React.FC<DashboardMapProps> = ({ 
  communes, 
  selectedCommune, 
  selectedPOI,
  sectorConfig, 
  onCommuneSelect 
}) => {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);

  const provinceFeatures = useMemo(() => getTetouanProvinceGeoJSON(), []);

  const getDecoupageStyle = (feature: any, isHovered: boolean) => {
    const communeName = feature.get('Nom commun');
    const isSelected = selectedCommune?.name.toUpperCase() === communeName?.toUpperCase();
    
    return [
      new Style({
        stroke: new Stroke({ 
          color: isSelected ? sectorConfig.hex : 'rgba(71, 85, 105, 0.15)', 
          width: isSelected ? 4 : 1 
        }),
        zIndex: isSelected ? 10 : 1
      }),
      new Style({
        fill: new Fill({ 
          color: isSelected ? `${sectorConfig.hex}44` : (isHovered ? `${sectorConfig.hex}11` : 'rgba(255, 255, 255, 0.05)') 
        }),
        text: isSelected || isHovered ? new Text({
          text: communeName,
          font: 'bold 11px "Space Grotesk", sans-serif',
          fill: new Fill({ color: '#1e293b' }),
          stroke: new Stroke({ color: '#ffffff', width: 3 }),
          offsetY: -10,
          overflow: true
        }) : undefined,
        zIndex: isSelected ? 11 : 2
      })
    ];
  };

  // High-Visibility Triple-Glow Littoral Style
  const littoralStyle = [
    // Outer faint aura
    new Style({ 
      stroke: new Stroke({ color: 'rgba(37, 99, 235, 0.1)', width: 22, lineCap: 'round', lineJoin: 'round' }),
      zIndex: 20
    }),
    // Inner glow
    new Style({ 
      stroke: new Stroke({ color: 'rgba(37, 99, 235, 0.4)', width: 10, lineCap: 'round', lineJoin: 'round' }),
      zIndex: 21
    }),
    // Strong core line (Strong Blue 600/700)
    new Style({ 
      stroke: new Stroke({ color: '#1d4ed8', width: 4, lineCap: 'round', lineJoin: 'round' }),
      zIndex: 22
    })
  ];

  const emergentStyle = (feature: any) => [
    new Style({ image: new Icon({ src: CENTRE_ICON_SVG, scale: 1 }), zIndex: 100 }),
    new Style({
      text: new Text({
        text: feature.get('NOM'),
        font: '800 9px "Inter", sans-serif',
        fill: new Fill({ color: '#059669' }),
        stroke: new Stroke({ color: '#ffffff', width: 3 }),
        offsetY: 20
      }),
      zIndex: 101
    })
  ];

  const infraStyle = (feature: any) => {
    const type = feature.get('type');
    const nom = feature.get('NOM');
    let src = DAM_ICON_SVG;
    let labelColor = '#2563eb';
    
    if (type === 'AEROPORT') { src = PLANE_ICON_SVG; labelColor = '#4f46e5'; }
    if (type === 'ZI') { src = FACTORY_ICON_SVG; labelColor = '#d97706'; }

    return [
      new Style({ image: new Icon({ src, scale: 0.8 }), zIndex: 80 }),
      new Style({
        text: new Text({
          text: nom,
          font: 'bold 9px "Inter", sans-serif',
          fill: new Fill({ color: labelColor }),
          stroke: new Stroke({ color: '#ffffff', width: 2 }),
          offsetY: -22
        }),
        zIndex: 81
      })
    ];
  };

  useEffect(() => {
    if (!mapElement.current || mapRef.current) return;

    const vectorSource = new VectorSource({ features: new GeoJSON().readFeatures(provinceFeatures, { featureProjection: 'EPSG:3857' }) });
    vectorSourceRef.current = vectorSource;

    const map = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({ 
          source: new XYZ({ 
            url: 'https://{a-c}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png' 
          }) 
        }),
        new VectorLayer({ source: vectorSource, style: (f) => getDecoupageStyle(f, false), zIndex: 10 }),
        new VectorLayer({ 
          source: new VectorSource({ features: new GeoJSON().readFeatures(LITTORAL_GEOJSON, { featureProjection: 'EPSG:3857' }) }), 
          style: littoralStyle, 
          zIndex: 25 
        }),
        new VectorLayer({ source: new VectorSource({ features: new GeoJSON().readFeatures(CENTRES_EMERGENTS_GEOJSON, { featureProjection: 'EPSG:3857' }) }), style: emergentStyle, zIndex: 35 }),
        new VectorLayer({ source: new VectorSource({ features: new GeoJSON().readFeatures(INFRASTRUCTURE_GEOJSON, { featureProjection: 'EPSG:3857' }) }), style: infraStyle, zIndex: 45 })
      ],
      view: new View({ center: fromLonLat([-5.40, 35.53]), zoom: 10.3 })
    });

    mapRef.current = map;
    map.on('pointermove', (e) => {
      const pixel = map.getEventPixel(e.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel, { layerFilter: (l) => l.getZIndex() === 10 });
      map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    map.on('click', (e) => {
      map.forEachFeatureAtPixel(e.pixel, (f) => {
        const name = f.get('Nom commun');
        if (!name) return;
        const matching = communes.find(c => c.name.toUpperCase() === name.toUpperCase());
        if (matching) onCommuneSelect(matching);
        return true;
      }, { layerFilter: (l) => l instanceof VectorLayer && l.getZIndex() === 10 });
    });

    return () => map.setTarget(undefined);
  }, []);

  useEffect(() => {
    if (!vectorSourceRef.current) return;
    vectorSourceRef.current.getFeatures().forEach(f => f.setStyle(getDecoupageStyle(f, false)));
  }, [communes, sectorConfig, selectedCommune]);

  useEffect(() => {
    if (!mapRef.current || !selectedCommune) return;
    mapRef.current.getView().animate({ center: fromLonLat([selectedCommune.lng, selectedCommune.lat]), zoom: 11.5, duration: 1000 });
  }, [selectedCommune]);

  useEffect(() => {
    if (!mapRef.current || !selectedPOI) return;
    mapRef.current.getView().animate({ center: fromLonLat(selectedPOI.coords), zoom: 13, duration: 1200 });
  }, [selectedPOI]);

  return <div ref={mapElement} className="w-full h-full rounded-2xl shadow-xl border-4 border-white overflow-hidden bg-slate-200" />;
};