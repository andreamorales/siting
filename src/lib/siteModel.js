import { FLEET_SITES } from '../components/HomeSiteBreakdown.jsx';
import { DATACENTERS } from './datacenters.js';

export const FACTORS = FLEET_SITES[0].subscores.map(({ k, long }) => ({ k, long }));

const WEIGHTS = { Env: 0.12, Grid: 0.2, Reg: 0.12, Labor: 0.1, Fiber: 0.1, Social: 0.09, Land: 0.15, Water: 0.12 };

export const LOAD_MIN = 50;
export const LOAD_MAX = 5000;
export const LOAD_STEP = 50;
export const LOAD_ZONES = [
  { max: 500, tone: 'green', label: 'Light grid impact' },
  { max: 1500, tone: 'yellow', label: 'Moderate grid impact' },
  { max: 3000, tone: 'orange', label: 'Heavy grid impact' },
  { max: LOAD_MAX, tone: 'red', label: 'Severe grid impact' },
];

const GRADES = [
  [95, 'A++'], [90, 'A+'], [86, 'A'], [82, 'A−'], [78, 'B+'], [74, 'B'], [70, 'B−'], [66, 'C+'], [62, 'C'], [0, 'D'],
];

const TIERS = [
  [86, 'PRIME', 'Excellent site!'],
  [78, 'STRONG', 'Strong site.'],
  [70, 'VIABLE', 'Viable site.'],
  [0, 'REVIEW', 'Needs review.'],
];

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function seedFor(lat, lng, salt = '') {
  return rng(hashString(`${lat.toFixed(2)},${lng.toFixed(2)}${salt}`));
}

function pick(rand, list, n) {
  const pool = [...list];
  const out = [];
  while (out.length < n && pool.length) out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
  return out;
}

export function formatLoad(mw) {
  if (mw >= 1000) return `${(mw / 1000).toFixed(1).replace(/\.0$/, '')} GW`;
  return `${mw} MW`;
}

export function loadZone(mw) {
  return LOAD_ZONES.find((z) => mw <= z.max) ?? LOAD_ZONES[LOAD_ZONES.length - 1];
}

export function baseFactors(lat, lng) {
  const rand = seedFor(lat, lng);
  return FACTORS.map((f) => ({ ...f, v: Math.round(48 + rand() * 50) }));
}

export function scoreSite(lat, lng, loadMw) {
  const gridPenalty = clamp((loadMw - 1000) / 150, 0, 25);
  const waterPenalty = clamp((loadMw - 1500) / 250, 0, 12);
  const factors = baseFactors(lat, lng).map((f) => {
    if (f.k === 'Grid') return { ...f, v: Math.round(clamp(f.v - gridPenalty, 0, 100)) };
    if (f.k === 'Water') return { ...f, v: Math.round(clamp(f.v - waterPenalty, 0, 100)) };
    return f;
  });
  const score = Math.round(factors.reduce((sum, f) => sum + f.v * WEIGHTS[f.k], 0));
  const grade = GRADES.find(([min]) => score >= min)[1];
  const [, tier, verdict] = TIERS.find(([min]) => score >= min);
  return { factors, score, grade, tier, verdict };
}

export function factorTone(v) {
  return v >= 80 ? 'good' : v >= 65 ? 'warn' : 'bad';
}

/** Mock viability: an area needs grid, land and water together to host a campus. */
export function viability(lat, lng) {
  const f = Object.fromEntries(baseFactors(lat, lng).map((x) => [x.k, x.v]));
  const index = Math.round((f.Grid + f.Land + f.Water) / 3);
  return { viable: index >= 72, index };
}

function distanceKm(aLat, aLng, bLat, bLng) {
  const rad = Math.PI / 180;
  const dLat = (bLat - aLat) * rad;
  const dLng = (bLng - aLng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * rad) * Math.cos(bLat * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

export function nearestDatacenters(lat, lng, n = 3) {
  return DATACENTERS
    .map((dc) => ({ ...dc, km: Math.round(distanceKm(lat, lng, dc.lat, dc.lng)) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, n);
}

/** Samples rings around the point and returns the closest spots that pass the mock viability check. */
export function nearestViableSpots(lat, lng, n = 3) {
  const found = [];
  for (const ring of [0.25, 0.5, 0.8, 1.2, 1.8, 2.5]) {
    for (let i = 0; i < 12; i += 1) {
      const t = (i / 12) * Math.PI * 2 + ring;
      const pLat = lat + ring * Math.sin(t);
      const pLng = lng + (ring * Math.cos(t)) / Math.cos((lat * Math.PI) / 180);
      if (viability(pLat, pLng).viable) {
        found.push({ id: `${pLat.toFixed(3)},${pLng.toFixed(3)}`, lat: pLat, lng: pLng, km: Math.round(distanceKm(lat, lng, pLat, pLng)) });
      }
    }
    if (found.length >= n) break;
  }
  return found.sort((a, b) => a.km - b.km).slice(0, n);
}

export function circlePolygon(lat, lng, radiusKm, steps = 64) {
  const coords = [];
  const dLat = radiusKm / 110.574;
  const dLng = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  for (let i = 0; i <= steps; i += 1) {
    const t = (i / steps) * Math.PI * 2;
    coords.push([lng + dLng * Math.cos(t), lat + dLat * Math.sin(t)]);
  }
  return { type: 'Feature', geometry: { type: 'Polygon', coordinates: [coords] }, properties: {} };
}

export function suggestTechnology(mw) {
  if (mw <= 150) return 'Microreactor';
  if (mw <= 1500) return 'SMR';
  return 'AP1000';
}

export const TECHNOLOGIES = ['Microreactor', 'SMR', 'AP1000', 'PWR Restart'];

export function suggestLoad(lat, lng) {
  const grid = baseFactors(lat, lng).find((f) => f.k === 'Grid').v;
  return clamp(Math.round((grid * 30 - 900) / LOAD_STEP) * LOAD_STEP, 300, 3000);
}

function transmissionFor(mw, factors, rand) {
  const grid = factors.find((f) => f.k === 'Grid').v;
  if (mw <= 100) return 'Islanded';
  if (grid < 60) return 'Behind-the-meter';
  if (mw >= 2000) return '500 kV';
  return rand() > 0.5 ? '345 kV' : '230 kV';
}

const RISK_POOL = [
  { k: 'Water', label: 'Water stress', detail: 'Cooling withdrawals compete with municipal demand.' },
  { k: 'Env', label: 'Flood exposure', detail: 'Parts of the parcel sit near a FEMA 100-year floodplain.' },
  { k: 'Env', label: 'Seismic activity', detail: 'Moderate peak ground acceleration for reactor design basis.' },
  { k: 'Env', label: 'Extreme heat days', detail: 'Rising count of 100°F+ days reduces cooling efficiency.' },
  { k: 'Land', label: 'Protected habitat', detail: 'Endangered species survey likely required before grading.' },
  { k: 'Water', label: 'Drought frequency', detail: 'Multi-year drought cycles recorded in the last decade.' },
  { k: 'Env', label: 'Wildfire risk', detail: 'Wildland–urban interface within the 10 km buffer.' },
];

function policiesFor(place, rand) {
  const state = place.state || 'State';
  const county = place.county || place.city || 'County';
  return pick(rand, [
    { title: `${state} data center sales-tax exemption`, detail: 'Equipment purchases exempt above a capital threshold.' },
    { title: `${county} industrial zoning overlay`, detail: 'Large-load facilities permitted by right in I-2 districts.' },
    { title: 'NRC Part 53 advanced reactor licensing', detail: 'Technology-inclusive pathway for SMR and microreactor sites.' },
    { title: `${state} large-load interconnection tariff`, detail: 'New loads over 75 MW must fund dedicated upgrades.' },
    { title: `${county} water-use reporting ordinance`, detail: 'Monthly withdrawal disclosures for industrial users.' },
    { title: `${state} nuclear moratorium review`, detail: 'Legislature evaluating changes to new-build restrictions.' },
  ], 3);
}

function newsFor(place, rand) {
  const where = place.city || place.county || place.state || 'the region';
  const state = place.stateCode || place.state || '';
  const images = ['/images/datacenter.png', '/images/smr.png', '/images/coolingtower.png', '/images/ai.png'];
  const sources = ['Utility Dive', 'E&E News', 'Data Center Dynamics', 'Local Ledger', 'Power Magazine'];
  const headlines = [
    `${where} officials weigh incentives for hyperscale campuses`,
    `Utility files long-range plan citing ${state} load growth`,
    `Residents debate water use as data centers eye ${where}`,
    `Advanced reactor developer scouts sites across ${state}`,
    `${where} approves transmission corridor upgrade`,
    `Fiber backbone expansion announced near ${where}`,
  ];
  return pick(rand, headlines, 4).map((title, i) => ({
    title,
    source: sources[Math.floor(rand() * sources.length)],
    age: `${1 + Math.floor(rand() * 20)}d ago`,
    image: images[i % images.length],
  }));
}

function capacityFor(mw, factors) {
  const grid = factors.find((f) => f.k === 'Grid').v;
  const headroom = Math.round((grid / 100) * LOAD_MAX * 0.6 / LOAD_STEP) * LOAD_STEP;
  return [
    { label: 'Phase 1', mw: Math.round((mw * 0.3) / 10) * 10 },
    { label: 'Phase 2', mw: Math.round((mw * 0.65) / 10) * 10 },
    { label: 'Full build', mw },
    { label: 'Grid headroom', mw: headroom, reference: true },
  ];
}

function summaryFor(place, factors) {
  const sorted = [...factors].sort((a, b) => b.v - a.v);
  const [best, second] = sorted;
  const worst = sorted[sorted.length - 1];
  return `${place.name} stands out on ${best.long.toLowerCase()} and ${second.long.toLowerCase()}; ${worst.long.toLowerCase()} is the main constraint to resolve.`;
}

/** Everything the case page renders, derived deterministically from the stored case. */
export function buildCaseStudy(record) {
  const { place, loadMw, technology } = record;
  const result = scoreSite(place.lat, place.lng, loadMw);
  const rand = seedFor(place.lat, place.lng, ':content');
  const water = result.factors.find((f) => f.k === 'Water').v;
  const risks = [...RISK_POOL]
    .map((r) => ({ ...r, severity: result.factors.find((f) => f.k === r.k).v + Math.round(rand() * 20 - 10) }))
    .sort((a, b) => a.severity - b.severity)
    .slice(0, 3)
    .map((r) => ({ ...r, level: r.severity < 58 ? 'HIGH' : r.severity < 76 ? 'MED' : 'LOW' }));

  return {
    ...result,
    summary: summaryFor(place, result.factors),
    labels: [
      technology,
      formatLoad(loadMw),
      transmissionFor(loadMw, result.factors, rand),
      water < 65 ? 'Dry cooling' : 'Wet cooling',
    ],
    risks,
    policies: policiesFor(place, rand),
    news: newsFor(place, rand),
    capacity: capacityFor(loadMw, result.factors),
  };
}
