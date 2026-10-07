import React from 'react';
import { Marker, useMap } from 'react-map-gl/maplibre';
import { findPlaceSource, queryBasemapPlaces, watchBasemapLabels } from '../lib/mapBase';
import { CITY_LABELS, REGION_LABELS, STATE_LABELS } from '../lib/mapLabelData';
import '../styles/map-labels.css';
import MapRoadLabels from './MapRoadLabels';

// Zoom breakpoints; labels re-render only when the zoom crosses one of these.
const Z_MINOR_STATES = 4.75;
const Z_CITY_T1 = 4.5;
const Z_STATE_NAMES = 5.5;
const Z_CITY_T2 = 6;
const Z_REGIONS_OFF = 7;
const Z_STATES_OFF = 8.5;
const BREAKS = [Z_CITY_T1, Z_MINOR_STATES, Z_STATE_NAMES, Z_CITY_T2, Z_REGIONS_OFF, Z_STATES_OFF];

const LABEL_STYLE = { zIndex: 0, pointerEvents: 'none' };

function zoomLevel(zoom) {
  return BREAKS.filter((b) => zoom >= b).length;
}

function useZoomLevel(map) {
  const [level, setLevel] = React.useState(() => (map ? zoomLevel(map.getZoom()) : 0));

  React.useEffect(() => {
    if (!map) return undefined;
    const update = () => setLevel(zoomLevel(map.getZoom()));
    update();
    map.on('zoom', update);
    return () => map.off('zoom', update);
  }, [map]);

  return level;
}

// Basemap place labels (towns etc. read from the hidden vector `place` layer) for close zooms.
const PLACE_MIN_ZOOM = { city: 7, town: 8, village: 10, suburb: 12, hamlet: 12, neighbourhood: 12 };
const PLACE_PRIORITY = { city: 0, town: 1, village: 2, suburb: 3, hamlet: 4, neighbourhood: 4 };
const PLACE_MINOR = new Set(['village', 'suburb', 'hamlet', 'neighbourhood']);
const PLACES_MIN_ZOOM = Math.min(...Object.values(PLACE_MIN_ZOOM));
const MAX_PLACES = 80;
const PLACE_DEBOUNCE_MS = 150;
// Approximate screen box of a city-style label at --t-xxs (10px IBM Plex Mono ≈ 6px/char, dot + gap ≈ 11px).
const CHAR_PX = 6;
const DOT_PX = 11;
const LABEL_H_PX = 14;
const LABEL_PAD_PX = 4;
const COVERED_DEG = 0.5;

const CITY_BY_NAME = CITY_LABELS.reduce((acc, c) => {
  const k = c.name.toLowerCase();
  (acc[k] ||= []).push(c);
  return acc;
}, {});

function coveredByCityLabel(p) {
  return (CITY_BY_NAME[p.name.toLowerCase()] || []).some(
    (c) => Math.abs(c.lat - p.lat) < COVERED_DEG && Math.abs(c.lng - p.lng) < COVERED_DEG,
  );
}

function labelBox(map, lng, lat, name) {
  const { x, y } = map.project([lng, lat]);
  return [x - LABEL_PAD_PX, y - LABEL_H_PX / 2, x + DOT_PX + CHAR_PX * name.length + LABEL_PAD_PX, y + LABEL_H_PX / 2];
}

const overlaps = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];

function pickPlaces(map, sourceId) {
  const zoom = map.getZoom();
  if (zoom < PLACES_MIN_ZOOM) return [];
  const bounds = map.getBounds();
  const seen = new Set();
  const candidates = [];
  for (const p of queryBasemapPlaces(map, sourceId)) {
    const minZoom = PLACE_MIN_ZOOM[p.cls];
    if (minZoom === undefined || zoom < minZoom || !bounds.contains([p.lng, p.lat])) continue;
    // Tiles overlap at their buffers, so the same place can come back several times.
    const key = `${p.name}|${Math.round(p.lat * 50)}|${Math.round(p.lng * 50)}`;
    if (seen.has(key) || coveredByCityLabel(p)) continue;
    seen.add(key);
    candidates.push({ ...p, key });
  }
  candidates.sort(
    (a, b) => PLACE_PRIORITY[a.cls] - PLACE_PRIORITY[b.cls] || a.rank - b.rank || a.name.localeCompare(b.name),
  );

  const placed = CITY_LABELS.filter(
    (c) => zoom >= (c.tier === 1 ? Z_CITY_T1 : Z_CITY_T2) && bounds.contains([c.lng, c.lat]),
  ).map((c) => labelBox(map, c.lng, c.lat, c.name));
  const picked = [];
  for (const p of candidates) {
    if (picked.length >= MAX_PLACES) break;
    const box = labelBox(map, p.lng, p.lat, p.name);
    if (placed.some((b) => overlaps(b, box))) continue;
    placed.push(box);
    picked.push({ key: p.key, name: p.name, lng: p.lng, lat: p.lat, minor: PLACE_MINOR.has(p.cls) });
  }
  return picked;
}

/** Keeps places that are still visible in the same slot so their markers don't move or re-render. */
function assignSlots(prev, picked) {
  const next = new Array(MAX_PLACES).fill(null);
  const byKey = new Map(picked.map((p) => [p.key, p]));
  prev.forEach((p, i) => {
    if (p && byKey.has(p.key)) {
      next[i] = p;
      byKey.delete(p.key);
    }
  });
  const rest = byKey.values();
  for (let i = 0; i < MAX_PLACES; i += 1) {
    if (next[i]) continue;
    const p = rest.next().value;
    if (!p) break;
    next[i] = p;
  }
  const same = next.every((p, i) => (p?.key ?? null) === (prev[i]?.key ?? null));
  return same ? prev : next;
}

const EMPTY_SLOTS = new Array(MAX_PLACES).fill(null);

/** Fixed pool of place slots, mounted up front so pins added later always stack above them. */
function usePlaceSlots(map) {
  const [slots, setSlots] = React.useState(EMPTY_SLOTS);

  React.useEffect(() => {
    if (!map) return undefined;
    let sourceId;
    let timer;
    const run = () => {
      timer = undefined;
      if (sourceId === undefined) sourceId = findPlaceSource(map);
      const picked = sourceId ? pickPlaces(map, sourceId) : [];
      setSlots((prev) => assignSlots(prev, picked));
    };
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(run, PLACE_DEBOUNCE_MS);
    };
    const onSourceData = (e) => {
      if (e.sourceId && e.sourceId === sourceId && e.tile && map.getZoom() >= PLACES_MIN_ZOOM) schedule();
    };
    const onStyleData = () => {
      sourceId = undefined;
      schedule();
    };
    schedule();
    map.on('moveend', schedule);
    map.on('sourcedata', onSourceData);
    map.on('styledata', onStyleData);
    return () => {
      clearTimeout(timer);
      map.off('moveend', schedule);
      map.off('sourcedata', onSourceData);
      map.off('styledata', onStyleData);
    };
  }, [map]);

  return slots;
}

const LabelMarker = React.memo(function LabelMarker({ lat, lng, anchor = 'center', className, children }) {
  return (
    <Marker longitude={lng} latitude={lat} anchor={anchor} style={LABEL_STYLE}>
      <span className="ml-label" aria-hidden="true">
        <span className={className}>{children}</span>
      </span>
    </Marker>
  );
});

/**
 * HTML replacement for the basemap's symbol layers (pair with hideBasemapLabels).
 * Render as the first child of <Map> so pins added after it stack on top.
 * Every label stays mounted and is toggled by class, so later pins never end up under a label in DOM order.
 */
export default function MapLabels() {
  const { current } = useMap();
  const map = current?.getMap();
  React.useEffect(() => (map ? watchBasemapLabels(map) : undefined), [map]);
  const level = useZoomLevel(map);
  const placeSlots = usePlaceSlots(map);
  const zoomAtLeast = (z) => level >= BREAKS.indexOf(z) + 1;

  const showStates = !zoomAtLeast(Z_STATES_OFF);
  const showMinorStates = zoomAtLeast(Z_MINOR_STATES);
  const fullNames = zoomAtLeast(Z_STATE_NAMES);
  const showT1 = zoomAtLeast(Z_CITY_T1);
  const showT2 = zoomAtLeast(Z_CITY_T2);
  const showRegions = !zoomAtLeast(Z_REGIONS_OFF);

  const off = (visible) => (visible ? '' : ' ml-text--off');

  return (
    <>
      <MapRoadLabels />
      {REGION_LABELS.map((r) => (
        <LabelMarker
          key={`r-${r.name}`}
          lat={r.lat}
          lng={r.lng}
          className={`ml-text ml-region ml-region--${r.kind}${off(showRegions)}`}
        >
          {r.name}
        </LabelMarker>
      ))}
      {STATE_LABELS.map((s) => (
        <LabelMarker
          key={`s-${s.abbr}`}
          lat={s.lat}
          lng={s.lng}
          className={`ml-text ml-state${fullNames ? ' ml-state--full' : ''}${off(showStates && (!s.minor || showMinorStates))}`}
        >
          {fullNames ? s.name : s.abbr}
        </LabelMarker>
      ))}
      {CITY_LABELS.map((c) => (
        <LabelMarker
          key={`c-${c.name}`}
          lat={c.lat}
          lng={c.lng}
          anchor="left"
          className={`ml-text ml-city${off(c.tier === 1 ? showT1 : showT2)}`}
        >
          <span className="ml-city-dot" />
          <span className="ml-city-name">{c.name}</span>
        </LabelMarker>
      ))}
      {placeSlots.map((p, i) => (
        <LabelMarker
          key={`p-${i}`}
          lat={p?.lat ?? 0}
          lng={p?.lng ?? 0}
          anchor="left"
          className={`ml-text ml-city ml-place${p?.minor ? ' ml-place--minor' : ''}${off(Boolean(p))}`}
        >
          <span className="ml-city-dot" />
          <span className="ml-city-name">{p?.name}</span>
        </LabelMarker>
      ))}
    </>
  );
}
