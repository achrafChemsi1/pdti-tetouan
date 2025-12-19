import React, { useMemo, useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Vector as VectorSource, XYZ } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Fill, Stroke, Text, Icon } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { getRenderPixel } from 'ol/render';
import { defaults as defaultInteractions, MouseWheelZoom, DoubleClickZoom, PinchZoom } from 'ol/interaction';
import { CommuneAggregated, SectorConfig } from '../types';
import { getTetouanProvinceGeoJSON } from '../services/adminBoundaries';
import { LITTORAL_GEOJSON, CENTRES_EMERGENTS_GEOJSON, INFRASTRUCTURE_GEOJSON } from '../services/mapLayersData';

interface DashboardMapProps {
  communes: CommuneAggregated[];
  selectedCommune: CommuneAggregated | null;
  selectedPOI?: { coords: [number, number]; name: string } | null;
  sectorConfig: SectorConfig;
  onCommuneSelect: (commune: CommuneAggregated | null) => void;
}

const PROVINCE_CENTER = [-5.40, 35.53];
const PROVINCE_ZOOM = 10.3;
const COMMUNE_ZOOM = 12.0;

const PLANE_ICON_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#4f46e5">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
`);

const CENTRE_ICON_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <rect x="2" y="6" width="20" height="14" rx="2.5" fill="white" stroke="#059669" stroke-width="2.2"/>
    <path d="M12 9.5v7M8.5 13h7" fill="none" stroke="#059669" stroke-width="2.2" stroke-linecap="round"/>
  </svg>
`);

const FACTORY_ICON_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
    <path d="M2 22h20V12h-4V4h-4v8h-2V4H8v8H2v10z" fill="#d97706" stroke="#ffffff" stroke-width="1"/>
  </svg>
`);

const DAM_ICON_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
    <path d="M12 2.5s-7 8.5-7 12.5a7 7 0 0 0 14 0c0-4-7-12.5-7-12.5z" fill="#2563eb"/>
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
    const communeName = feature.get('name') || feature.get('Nom commun');
    const population = feature.get('population');
    const isSelected = selectedCommune?.name.toUpperCase() === communeName?.toUpperCase();

    const labelText = isSelected && population
      ? `${communeName}\nPop: ${population.toLocaleString('fr-FR')}`
      : communeName;

    return [
      new Style({
        stroke: new Stroke({
          color: isSelected ? sectorConfig.hex : 'rgba(0, 0, 128, 0.6)',
          width: isSelected ? 3.5 : 1.5
        }),
        zIndex: isSelected ? 10 : 1
      }),
      new Style({
        fill: new Fill({
          color: isSelected ? `${sectorConfig.hex}25` : (isHovered ? 'rgba(0, 0, 128, 0.1)' : 'rgba(255, 255, 255, 0.5)')
        }),
        text: new Text({
          text: labelText,
          font: isSelected ? 'bold 12px "Inter", sans-serif' : '500 10px "Inter", sans-serif',
          fill: new Fill({ color: '#000080' }),
          stroke: new Stroke({ color: 'rgba(255, 255, 255, 0.9)', width: 3 }),
          offsetY: isSelected ? -10 : 0,
          overflow: true
        }),
        zIndex: isSelected ? 11 : 2
      })
    ];
  };

  const littoralStyle = [
    new Style({ stroke: new Stroke({ color: 'rgba(37, 99, 235, 0.1)', width: 20 }), zIndex: 40 }),
    new Style({ stroke: new Stroke({ color: 'rgba(37, 99, 235, 0.25)', width: 8 }), zIndex: 41 }),
    new Style({ stroke: new Stroke({ color: '#1d4ed8', width: 3 }), zIndex: 42 })
  ];

  useEffect(() => {
    if (!mapElement.current || mapRef.current) {
      return;
    }

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(provinceFeatures, { featureProjection: 'EPSG:3857' })
    });
    vectorSourceRef.current = vectorSource;

    const topoLayer = new TileLayer({
      source: new XYZ({ url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png' }),
      opacity: 0.9,
      zIndex: 5
    });

    topoLayer.on('prerender', (event) => {
      const ctx = event.context as CanvasRenderingContext2D;
      const eventMap = event.target.get('map') || mapRef.current;
      if (!eventMap) return;

      ctx.save();
      ctx.beginPath();
      vectorSource.getFeatures().forEach((feature) => {
        const geometry = feature.getGeometry();
        if (geometry && geometry.getType() === 'Polygon') {
          const coords = (geometry as any).getCoordinates()[0];
          coords.forEach((coord: number[], i: number) => {
            const pixel = eventMap.getPixelFromCoordinate(coord);
            const renderPixel = getRenderPixel(event, pixel);
            if (i === 0) ctx.moveTo(renderPixel[0], renderPixel[1]);
            else ctx.lineTo(renderPixel[0], renderPixel[1]);
          });
        }
      });
      ctx.clip();
    });

    topoLayer.on('postrender', (event) => {
      const ctx = event.context as CanvasRenderingContext2D;
      ctx.restore();
    });

    const map = new Map({
      target: mapElement.current,
      // ACTIVATE ZOOM ONLY, KEEP POSITION FIXED (Disable DragPan)
      interactions: defaultInteractions({
        dragPan: false, // Blocks moving the map around
        mouseWheelZoom: true,
        doubleClickZoom: true,
        pinchZoom: true
      }),
      layers: [
        topoLayer,
        new VectorLayer({ source: vectorSource, style: (f) => getDecoupageStyle(f, false), zIndex: 10 }),
        new VectorLayer({
          source: new VectorSource({ features: new GeoJSON().readFeatures(LITTORAL_GEOJSON, { featureProjection: 'EPSG:3857' }) }),
          style: littoralStyle,
          zIndex: 40
        }),
        new VectorLayer({
          source: new VectorSource({ features: new GeoJSON().readFeatures(CENTRES_EMERGENTS_GEOJSON, { featureProjection: 'EPSG:3857' }) }), style: (f) => [
            new Style({ image: new Icon({ src: CENTRE_ICON_SVG, scale: 0.85 }), zIndex: 100 }),
            new Style({ text: new Text({ text: f.get('NOM'), font: '800 9px "Inter"', fill: new Fill({ color: '#059669' }), stroke: new Stroke({ color: '#fff', width: 3 }), offsetY: 18 }), zIndex: 101 })
          ], zIndex: 35
        }),
        new VectorLayer({
          source: new VectorSource({ features: new GeoJSON().readFeatures(INFRASTRUCTURE_GEOJSON, { featureProjection: 'EPSG:3857' }) }), style: (f) => {
            const type = f.get('type');
            let src = DAM_ICON_SVG;
            let color = '#2563eb';
            if (type === 'AEROPORT') { src = PLANE_ICON_SVG; color = '#4f46e5'; }
            if (type === 'ZI') { src = FACTORY_ICON_SVG; color = '#d97706'; }
            return [
              new Style({ image: new Icon({ src, scale: 0.75 }), zIndex: 80 }),
              new Style({ text: new Text({ text: f.get('NOM'), font: 'bold 9px "Inter"', fill: new Fill({ color }), stroke: new Stroke({ color: '#fff', width: 3 }), offsetY: -20 }), zIndex: 81 })
            ];
          }, zIndex: 45
        })
      ],
      view: new View({
        center: fromLonLat(PROVINCE_CENTER),
        zoom: PROVINCE_ZOOM,
        minZoom: 10,
        maxZoom: 16
      })
    });

    mapRef.current = map;

    map.on('click', (e) => {
      let found = false;
      map.forEachFeatureAtPixel(e.pixel, (f) => {
        const name = f.get('name') || f.get('Nom commun'); // Fix: Check both properties
        if (!name) return;
        const matching = communes.find(c => c.name.toUpperCase() === name.toUpperCase());
        if (matching) {
          onCommuneSelect(matching);
          found = true;
        }
        return true;
      }, { layerFilter: (l) => l.getZIndex() === 10 });

      if (!found) onCommuneSelect(null);
    });

    map.on('pointermove', (e) => {
      const pixel = map.getEventPixel(e.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel, { layerFilter: (l) => l.getZIndex() === 10 });
      map.getTargetElement().style.cursor = hit ? 'pointer' : 'default';
    });

    return () => {
      map.setTarget(undefined);
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!vectorSourceRef.current) return;

    vectorSourceRef.current.getFeatures().forEach(f => {
      const cName = f.get('name') || f.get('Nom commun');
      const matchingCommune = communes.find(c => c.name.toUpperCase() === cName?.toUpperCase());
      if (matchingCommune) {
        f.set('population', matchingCommune.population);
      }
      f.setStyle(getDecoupageStyle(f, false));
    });
  }, [communes, sectorConfig, selectedCommune]);

  useEffect(() => {
    if (!mapRef.current) return;
    const view = mapRef.current.getView();

    if (selectedCommune) {
      view.animate({
        center: fromLonLat([selectedCommune.lng, selectedCommune.lat]),
        zoom: COMMUNE_ZOOM,
        duration: 1200,
        easing: (t) => t * (2 - t)
      });
    } else if (selectedPOI) {
      view.animate({
        center: fromLonLat(selectedPOI.coords),
        zoom: 14,
        duration: 1200
      });
    } else {
      view.animate({
        center: fromLonLat(PROVINCE_CENTER),
        zoom: PROVINCE_ZOOM,
        duration: 1200
      });
    }
  }, [selectedCommune, selectedPOI]);

  return (
    <div
      ref={mapElement}
      className="w-full h-full rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.12)] border border-slate-200 overflow-hidden bg-[#eaf7f9]"
    />
  );
};