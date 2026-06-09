import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import { FLEET_SITES } from './HomeSiteBreakdown.jsx';

const MAP_STYLE_URL = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

const PAPER = '#FDFDFC';
const LAND = '#EDECEA';
const BORDER = '#D4D1CC';

function patchStyle(style) {
  const patched = JSON.parse(JSON.stringify(style));

  for (const layer of patched.layers) {
    if (layer.type === 'symbol') {
      layer.layout = layer.layout || {};
      layer.layout.visibility = 'none';
      continue;
    }

    if (layer.type === 'background') {
      layer.paint = { 'background-color': LAND };
      continue;
    }

    const src = (layer['source-layer'] || '').toLowerCase();
    const id = (layer.id || '').toLowerCase();

    if (layer.type === 'fill') {
      if (/water|ocean|sea|lake|river/.test(id) || /water/.test(src)) {
        layer.paint = { ...layer.paint, 'fill-color': PAPER, 'fill-opacity': 1 };
      }
    }

    if (layer.type === 'line') {
      if (/boundary|border|admin/.test(id) || /boundary/.test(src)) {
        layer.layout = layer.layout || {};
        layer.layout.visibility = 'none';
      }
    }
  }

  return patched;
}

function PinMarker() {
  return (
    <div className="home-reticule" aria-hidden="true">
      <span className="home-site-pin-ring home-site-pin-ring--a" />
      <span className="home-site-pin-ring home-site-pin-ring--b" />
      <span className="home-site-pin-ring home-site-pin-ring--c" />
      <span className="home-site-pin-mark" />
    </div>
  );
}

export default function HomeMapOrb({ activeIdx = 0 }) {
  const [mapStyle, setMapStyle] = useState(null);

  useEffect(() => {
    fetch(MAP_STYLE_URL)
      .then((r) => r.json())
      .then((style) => setMapStyle(patchStyle(style)))
      .catch(() => {});
  }, []);

  const viewState = useMemo(() => ({
    longitude: -98.35,
    latitude: 37.5,
    zoom: 3.2,
    pitch: 0,
    bearing: 0,
  }), []);

  if (!mapStyle) return <div className="home-map-orb" />;

  return (
    <div className="home-map-orb">
      <div className="home-map-orb-inner">
        <Map
          mapStyle={mapStyle}
          initialViewState={viewState}
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
          interactive={false}
          dragPan={false}
          dragRotate={false}
          scrollZoom={false}
          doubleClickZoom={false}
          touchZoomRotate={false}
          keyboard={false}
          touchPitch={false}
          maxPitch={0}
        >
          {FLEET_SITES.map((site, i) => (
            <Marker key={site.id} longitude={site.lng} latitude={site.lat} anchor="center">
              {i === activeIdx ? (
                <PinMarker />
              ) : (
                <span
                  style={{
                    display: 'block',
                    width: 6,
                    height: 6,
                    transform: 'rotate(45deg)',
                    background: 'var(--line)',
                    border: '1.5px solid var(--faint)',
                  }}
                />
              )}
            </Marker>
          ))}
        </Map>
      </div>
    </div>
  );
}
