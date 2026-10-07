import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import { useNavigate } from 'react-router-dom';
import MapLabels from './MapLabels';
import SiteMarkerGlyph from './SiteMarkerGlyph';
import { hideBasemapLabels } from '../lib/mapBase';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

const CONUS_BOUNDS = [[-125, 24.5], [-66.9, 49.5]];

export default function DatacenterMap({ datacenters, activeId, selectedId, onHover, onSelect }) {
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  const initialViewState = useMemo(() => ({
    bounds: CONUS_BOUNDS,
    fitBoundsOptions: { padding: 40 },
  }), []);

  const fitConus = useCallback(() => {
    mapRef.current?.getMap()?.fitBounds(CONUS_BOUNDS, { padding: 40, duration: 0 });
  }, []);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const dc = datacenters.find((d) => d.id === selectedId);
    if (dc) {
      map.flyTo({ center: [dc.lng, dc.lat], zoom: Math.max(map.getZoom(), 5.5), duration: 900 });
    } else {
      map.fitBounds(CONUS_BOUNDS, { padding: 40, duration: 900 });
    }
  }, [selectedId, datacenters]);

  return (
    <div className={'dc-map' + (ready ? ' map--ready' : '')}>
      <Map
        ref={mapRef}
        mapStyle={MAP_STYLE}
        initialViewState={initialViewState}
        onLoad={(e) => {
          hideBasemapLabels(e.target);
          fitConus();
          setReady(true);
        }}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        dragRotate={false}
        pitchWithRotate={false}
        touchPitch={false}
        maxPitch={0}
        onClick={() => onSelect(null)}
      >
        <MapLabels />
        <NavigationControl position="top-right" showCompass={false} />
        {ready && datacenters.map((dc, i) => {
          const active = dc.id === activeId || dc.id === selectedId;
          const isCase = dc.kind === 'case';
          return (
            <Marker key={dc.id} longitude={dc.lng} latitude={dc.lat} anchor="center" style={{ zIndex: active ? 2 : 1 }}>
              <button
                type="button"
                className={'dc-pin prod-stagger' + (isCase ? ' dc-pin--case' : '') + (active ? ' dc-pin--active' : '')}
                style={{ '--i': i }}
                aria-label={isCase ? `Open site ${dc.name}, grade ${dc.grade}` : `${dc.name}, ${dc.location}`}
                onMouseEnter={() => onHover(dc.id)}
                onMouseLeave={() => onHover(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isCase) navigate(`/app/site/${dc.id}`);
                  else onSelect(dc.id);
                }}
              >
                <SiteMarkerGlyph active={active} variant={isCase ? 'case' : 'site'} />
                <span className="dc-pin-label">{dc.name}</span>
              </button>
            </Marker>
          );
        })}
      </Map>
      <span className="dc-map-attrib">© OpenStreetMap · CARTO</span>
    </div>
  );
}
