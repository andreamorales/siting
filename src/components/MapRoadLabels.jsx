import React from 'react';
import { Marker, useMap } from 'react-map-gl/maplibre';
import '../styles/map-road-labels.css';

const SOURCE_ID = 'carto';
const SOURCE_LAYER = 'transportation_name';

// Minimum zoom per OpenMapTiles road class; lower index = higher placement priority.
const CLASS_RULES = [
  { cls: ['motorway'], minZoom: 11.5 },
  { cls: ['trunk'], minZoom: 11.5 },
  { cls: ['primary'], minZoom: 12 },
  { cls: ['secondary'], minZoom: 13 },
  { cls: ['tertiary'], minZoom: 13 },
  { cls: ['minor', 'service'], minZoom: 14.5 },
];
const MIN_ZOOM = Math.min(...CLASS_RULES.map((r) => r.minZoom));
const MAX_LABELS = 40;
const DEBOUNCE_MS = 150;
// Box estimate for --t-xxs (10px) IBM Plex Mono: glyph advance is 0.6em.
const CHAR_W = 6;
const LABEL_H = 12;
const COLLIDE_PAD = 6;
const EDGE_INSET = 8;
const SECOND_LABEL_RUN = 520;
// Reject placements where the road bends too much under the label (chord / arc length).
const MIN_STRAIGHTNESS = 0.9;

const LABEL_STYLE = { zIndex: 0, pointerEvents: 'none' };

function classRank(cls, zoom) {
  const i = CLASS_RULES.findIndex((r) => r.cls.includes(cls));
  if (i < 0 || zoom < CLASS_RULES[i].minZoom) return -1;
  return i;
}

function roadName(props) {
  return props.name_en || props['name:latin'] || props.name || '';
}

/** Liang–Barsky clip of segment a→b to rect; returns [t0, t1] or null. */
function clipSegment(a, b, rect) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  let t0 = 0;
  let t1 = 1;
  const edges = [
    [-dx, a[0] - rect.x0],
    [dx, rect.x1 - a[0]],
    [-dy, a[1] - rect.y0],
    [dy, rect.y1 - a[1]],
  ];
  for (const [p, q] of edges) {
    if (p === 0) {
      if (q < 0) return null;
    } else {
      const t = q / p;
      if (p < 0) {
        if (t > t1) return null;
        if (t > t0) t0 = t;
      } else {
        if (t < t0) return null;
        if (t < t1) t1 = t;
      }
    }
  }
  return [t0, t1];
}

const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** Splits a screen-space polyline into the contiguous runs that fall inside rect. */
function visibleRuns(pts, rect) {
  const runs = [];
  let run = null;
  for (let i = 1; i < pts.length; i += 1) {
    const clip = clipSegment(pts[i - 1], pts[i], rect);
    if (!clip) {
      run = null;
      continue;
    }
    const start = lerp(pts[i - 1], pts[i], clip[0]);
    const end = lerp(pts[i - 1], pts[i], clip[1]);
    if (!run || clip[0] > 0) {
      run = [start];
      runs.push(run);
    }
    run.push(end);
    if (clip[1] < 1) run = null;
  }
  return runs.filter((r) => r.length > 1);
}

function measureRun(run) {
  const cum = [0];
  for (let i = 1; i < run.length; i += 1) {
    cum.push(cum[i - 1] + Math.hypot(run[i][0] - run[i - 1][0], run[i][1] - run[i - 1][1]));
  }
  return cum;
}

function pointAt(run, cum, d) {
  let i = 1;
  while (i < cum.length - 1 && cum[i] < d) i += 1;
  const seg = cum[i] - cum[i - 1];
  return lerp(run[i - 1], run[i], seg > 0 ? (d - cum[i - 1]) / seg : 0);
}

function uprightAngle(a, b) {
  let deg = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  if (deg > 90) deg -= 180;
  if (deg < -90) deg += 180;
  return deg;
}

/** Oriented box as center, half extents and unit axes, for SAT overlap tests. */
function makeBox(center, w, h, deg) {
  const r = (deg * Math.PI) / 180;
  const ux = [Math.cos(r), Math.sin(r)];
  const uy = [-Math.sin(r), Math.cos(r)];
  return { c: center, hw: w / 2 + COLLIDE_PAD, hh: h / 2 + COLLIDE_PAD, axes: [ux, uy] };
}

function overlaps(a, b) {
  const d = [b.c[0] - a.c[0], b.c[1] - a.c[1]];
  const project = (box, axis) =>
    box.hw * Math.abs(box.axes[0][0] * axis[0] + box.axes[0][1] * axis[1]) +
    box.hh * Math.abs(box.axes[1][0] * axis[0] + box.axes[1][1] * axis[1]);
  for (const axis of [...a.axes, ...b.axes]) {
    const dist = Math.abs(d[0] * axis[0] + d[1] * axis[1]);
    if (dist > project(a, axis) + project(b, axis)) return false;
  }
  return true;
}

function lineParts(geometry) {
  if (geometry?.type === 'LineString') return [geometry.coordinates];
  if (geometry?.type === 'MultiLineString') return geometry.coordinates;
  return [];
}

function computeLabels(map) {
  const zoom = map.getZoom();
  if (zoom < MIN_ZOOM || !map.getSource(SOURCE_ID)) return [];

  const features = map.querySourceFeatures(SOURCE_ID, { sourceLayer: SOURCE_LAYER });
  const container = map.getContainer();
  const rect = {
    x0: EDGE_INSET,
    y0: EDGE_INSET,
    x1: container.clientWidth - EDGE_INSET,
    y1: container.clientHeight - EDGE_INSET,
  };
  if (rect.x1 <= rect.x0 || rect.y1 <= rect.y0) return [];

  // Tiles split roads into many features; collect every visible run per name.
  const roads = new Map();
  const seenParts = new Set();
  for (const f of features) {
    const name = roadName(f.properties || {});
    if (!name) continue;
    const rank = classRank(f.properties.class, zoom);
    if (rank < 0) continue;
    let road = roads.get(name);
    if (!road) {
      road = { name, rank, runs: [] };
      roads.set(name, road);
    }
    road.rank = Math.min(road.rank, rank);
    for (const coords of lineParts(f.geometry)) {
      // The same tile feature is returned once per covering tile at overzoom.
      const sig = `${name}|${coords.length}|${coords[0]}|${coords[coords.length - 1]}`;
      if (seenParts.has(sig)) continue;
      seenParts.add(sig);
      const pts = coords.map((c) => {
        const p = map.project(c);
        return [p.x, p.y];
      });
      for (const run of visibleRuns(pts, rect)) {
        const cum = measureRun(run);
        road.runs.push({ run, cum, len: cum[cum.length - 1] });
      }
    }
  }

  const ordered = [...roads.values()]
    .map((r) => ({ ...r, runs: r.runs.sort((a, b) => b.len - a.len) }))
    .filter((r) => r.runs.length)
    .sort((a, b) => a.rank - b.rank || b.runs[0].len - a.runs[0].len);

  const placed = [];
  const boxes = [];
  for (const road of ordered) {
    if (placed.length >= MAX_LABELS) break;
    const w = road.name.length * CHAR_W;
    let count = 0;
    for (const { run, cum, len } of road.runs) {
      if (len < w + LABEL_H || count >= 2) break;
      const fractions = len >= SECOND_LABEL_RUN ? [0.25, 0.75, 0.5] : [0.5, 0.35, 0.65];
      for (const t of fractions) {
        if (count >= 2 || placed.length >= MAX_LABELS) break;
        const d = Math.min(Math.max(len * t, w / 2), len - w / 2);
        const a = pointAt(run, cum, d - w / 2);
        const b = pointAt(run, cum, d + w / 2);
        if (Math.hypot(b[0] - a[0], b[1] - a[1]) < w * MIN_STRAIGHTNESS) continue;
        const center = pointAt(run, cum, d);
        const angle = uprightAngle(a, b);
        const box = makeBox(center, w, LABEL_H, angle);
        if (boxes.some((o) => overlaps(o, box))) continue;
        boxes.push(box);
        const ll = map.unproject(center);
        placed.push({ key: `${road.name}#${count}`, name: road.name, lng: ll.lng, lat: ll.lat, angle });
        count += 1;
        // A single run gets one label unless it is long enough for two spread-out ones.
        if (len < SECOND_LABEL_RUN) break;
      }
    }
  }
  return placed;
}

const sameLabel = (a, b) =>
  a === b || (a && b && a.key === b.key && a.lng === b.lng && a.lat === b.lat && a.angle === b.angle);

/** Keeps labels that survive a recompute in the same slot so their markers aren't touched. */
function assignSlots(prev, picked) {
  const next = new Array(MAX_LABELS).fill(null);
  const byKey = new Map(picked.map((l) => [l.key, l]));
  prev.forEach((l, i) => {
    if (l && byKey.has(l.key)) {
      next[i] = byKey.get(l.key);
      byKey.delete(l.key);
    }
  });
  const rest = byKey.values();
  for (let i = 0; i < MAX_LABELS; i += 1) {
    if (next[i]) continue;
    const l = rest.next().value;
    if (!l) break;
    next[i] = l;
  }
  return next.every((l, i) => sameLabel(l, prev[i])) ? prev : next;
}

const EMPTY_SLOTS = new Array(MAX_LABELS).fill(null);

const RoadLabel = React.memo(function RoadLabel({ lng, lat, angle, name, visible }) {
  return (
    <Marker longitude={lng} latitude={lat} anchor="center" style={LABEL_STYLE}>
      <span className="mrl-label" aria-hidden="true">
        <span
          className={`mrl-text${visible ? '' : ' mrl-text--off'}`}
          style={{ transform: `rotate(${angle.toFixed(1)}deg)` }}
        >
          {name}
        </span>
      </span>
    </Marker>
  );
});

/**
 * Street names from the basemap's vector tiles, drawn as straight HTML text rotated to the road.
 * Uses a fixed pool of markers mounted up front (toggled by class) so pins added later, which
 * stack by DOM order, always sit above them. Render inside <Map> before any pins.
 */
export default function MapRoadLabels() {
  const { current } = useMap();
  const map = current?.getMap();
  const [slots, setSlots] = React.useState(EMPTY_SLOTS);
  const [hidden, setHidden] = React.useState(false);

  React.useEffect(() => {
    if (!map) return undefined;
    let timer = null;

    const run = () => {
      timer = null;
      let next = [];
      try {
        next = computeLabels(map);
      } catch {
        next = [];
      }
      setHidden(false);
      setSlots((prev) => assignSlots(prev, next));
    };
    const schedule = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(run, DEBOUNCE_MS);
    };
    const onSourceData = (e) => {
      if (e.sourceId === SOURCE_ID && !map.isMoving()) schedule();
    };
    // Positions are tied to lng/lat so panning is fine; zooming changes road geometry on screen.
    const onZoomStart = () => setHidden(true);

    map.on('moveend', schedule);
    map.on('idle', schedule);
    map.on('sourcedata', onSourceData);
    map.on('zoomstart', onZoomStart);
    schedule();
    return () => {
      if (timer) clearTimeout(timer);
      map.off('moveend', schedule);
      map.off('idle', schedule);
      map.off('sourcedata', onSourceData);
      map.off('zoomstart', onZoomStart);
    };
  }, [map]);

  return slots.map((l, i) => (
    <RoadLabel
      key={`road-${i}`}
      lng={l?.lng ?? 0}
      lat={l?.lat ?? 0}
      angle={l?.angle ?? 0}
      name={l?.name ?? ''}
      visible={Boolean(l) && !hidden}
    />
  ));
}
