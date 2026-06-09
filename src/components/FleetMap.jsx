import React, { useCallback, useMemo, useRef } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const FLEET_SITES = [
  { id: 'PB-07', name: 'Permian Basin', region: 'TX', lat: 31.99, lng: -102.07, grade: 'A+', score: 92, clickable: true },
  { id: 'CR-02', name: 'Cumberland Ridge', region: 'TN', lat: 36.16, lng: -85.5, grade: 'A−', score: 88, clickable: false },
  { id: 'SV-31', name: 'Shenandoah Valley', region: 'VA', lat: 38.5, lng: -78.86, grade: 'B+', score: 81, clickable: false },
  { id: 'CL-05', name: 'Coastal Lowlands', region: 'GA', lat: 31.5, lng: -82.0, grade: 'B', score: 76, clickable: false },
  { id: 'KM-11', name: 'Kearney Mesa', region: 'NE', lat: 40.7, lng: -99.08, grade: 'B−', score: 73, clickable: false },
  { id: 'GB-19', name: 'Great Basin', region: 'NV', lat: 39.5, lng: -117.0, grade: 'C+', score: 64, clickable: false },
];

const STYLES = {
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
};

function tierColor(score) {
  return score >= 85 ? 'var(--pos)' : score >= 72 ? 'var(--warn)' : 'var(--neg)';
}

function SiteMarker({ site, active, accent, onHover, onLeave, onOpenSite }) {
  const col = tierColor(site.score);

  return (
    <Marker longitude={site.lng} latitude={site.lat} anchor="center">
      <button
        type="button"
        className={`fleet-pin${active ? ' fleet-pin--active' : ''}${site.clickable ? ' fleet-pin--clickable' : ''}`}
        onMouseEnter={() => onHover(site.id)}
        onMouseLeave={onLeave}
        onClick={site.clickable ? onOpenSite : undefined}
        aria-label={`${site.id} ${site.name}`}
      >
        {(site.clickable || active) && (
          <span
            className="fleet-pin__pulse-ring"
            style={{ borderColor: accent }}
          />
        )}
        <span
          className="fleet-pin__diamond"
          style={{
            borderColor: active ? accent : 'var(--ink2)',
            background: active ? accent : 'var(--card)',
            boxShadow: active ? `0 0 18px ${accent}55` : '0 1px 4px rgba(0,0,0,0.25)',
          }}
        />
        {active && (
          <div className="fleet-pin__label" style={{ borderColor: 'var(--line)', background: 'var(--mapcall, rgba(14,17,22,0.9))' }}>
            <span className="st-mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: col }}>{site.id}</span>
            <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--ink)', marginTop: 2 }}>{site.name}</span>
            <span className="st-mono" style={{ fontSize: 9, color: 'var(--mut)', marginTop: 2 }}>{site.grade} · {site.score}</span>
          </div>
        )}
      </button>
    </Marker>
  );
}

export default function FleetMap({ dark, hover, setHover, onOpenSite, accent = '#5B83D8' }) {
  const mapRef = useRef(null);
  const mapStyle = dark ? STYLES.dark : STYLES.light;

  const initialViewState = useMemo(() => ({
    longitude: -98.35,
    latitude: 39.5,
    zoom: 3.4,
    pitch: 0,
    bearing: 0,
  }), []);

  const fitFleet = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const lngs = FLEET_SITES.map((s) => s.lng);
    const lats = FLEET_SITES.map((s) => s.lat);
    map.fitBounds(
      [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
      { padding: { top: 72, bottom: 72, left: 56, right: 56 }, duration: 800 },
    );
  }, []);

  const onLoad = useCallback(() => {
    fitFleet();
  }, [fitFleet]);

  return (
    <div className="fleet-map-shell relative flex-1 min-w-0 overflow-hidden" style={{ background: 'var(--mapbg)' }}>
      <Map
        ref={mapRef}
        mapStyle={mapStyle}
        initialViewState={initialViewState}
        onLoad={onLoad}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        dragRotate={false}
        pitchWithRotate={false}
        touchPitch={false}
        maxPitch={0}
      >
        <NavigationControl position="top-left" showCompass={false} visualizePitch={false} />
        {FLEET_SITES.map((site) => (
          <SiteMarker
            key={site.id}
            site={site}
            active={hover === site.id}
            accent={accent}
            onHover={setHover}
            onLeave={() => setHover(null)}
            onOpenSite={onOpenSite}
          />
        ))}
      </Map>

      <div className="fleet-map-grid pointer-events-none absolute inset-0" />
      <div className="fleet-map-vignette pointer-events-none absolute inset-0" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-between p-4">
        <span className="st-mono text-[10px] tracking-[0.18em] text-[var(--faint)]">49°N</span>
        <span className="st-mono text-[10px] tracking-[0.18em] text-[var(--faint)]">CONUS · FLEET GRID</span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-between p-4">
        <span className="st-mono text-[10px] tracking-[0.18em] text-[var(--faint)]">25°N</span>
        <span className="st-mono text-[10px] tracking-[0.18em] text-[var(--faint)]">125°W → 67°W</span>
      </div>

      <div className="pointer-events-none absolute bottom-3 right-3 z-10">
        <span className="st-mono text-[8px] tracking-wide text-[var(--faint)] opacity-70">© OpenStreetMap · CARTO</span>
      </div>
    </div>
  );
}

export { FLEET_SITES };
