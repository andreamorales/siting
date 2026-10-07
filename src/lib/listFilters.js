import { DATACENTERS } from './datacenters.js';
import { scoreSite } from './siteModel.js';

export const GRADE_GROUPS = ['A', 'B', 'C', 'D'];

export const SORT_OPTIONS = [
  { value: 'grade-desc', label: 'Grade high → low' },
  { value: 'grade-asc', label: 'Grade low → high' },
  { value: 'name', label: 'Name A → Z' },
  { value: 'load-desc', label: 'Load high → low' },
  { value: 'newest', label: 'Newest' },
];

export const DEFAULT_SORT = 'newest';

/** "1.2 GW" → 1200, "300 MW" → 300. */
export function parseLoad(label) {
  const m = /([\d.]+)\s*(GW|MW)/i.exec(label ?? '');
  if (!m) return 0;
  const n = parseFloat(m[1]);
  return Math.round(m[2].toUpperCase() === 'GW' ? n * 1000 : n);
}

/** Grades datacenters with the same model as cases: seeded factors at their coordinates + their demand. */
export const DATACENTER_SITES = DATACENTERS.map((dc, i) => {
  const loadMw = parseLoad(dc.demand);
  const { score, grade } = scoreSite(dc.lat, dc.lng, loadMw);
  return { ...dc, kind: 'datacenter', grade, score, loadMw, order: i };
});

export function gradeGroup(grade) {
  return grade?.[0] ?? '';
}

export function placeLabel(place) {
  if (!place) return '';
  return [place.city || place.county, place.stateCode || place.state].filter(Boolean).join(', ');
}

function searchText(site) {
  const p = site.place ?? {};
  return [site.name, site.location, p.name, p.city, p.county, p.state, p.stateCode]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function matchesQuery(site, query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const text = searchText(site);
  return terms.every((t) => text.includes(t));
}

export function filterSites(sites, { q = '', grades = [] }) {
  return sites.filter((s) => (!grades.length || grades.includes(gradeGroup(s.grade))) && matchesQuery(s, q));
}

const byName = (a, b) => a.name.localeCompare(b.name);

/** Datacenters have no creation date, so "Newest" keeps their catalog order. */
const COMPARATORS = {
  'grade-desc': (a, b) => b.score - a.score || byName(a, b),
  'grade-asc': (a, b) => a.score - b.score || byName(a, b),
  name: byName,
  'load-desc': (a, b) => b.loadMw - a.loadMw || byName(a, b),
  newest: (a, b) => (b.createdAt ?? -b.order) - (a.createdAt ?? -a.order),
};

export function sortSites(sites, sort) {
  return [...sites].sort(COMPARATORS[sort] ?? COMPARATORS[DEFAULT_SORT]);
}

export function readListParams(params) {
  const sort = params.get('sort');
  return {
    q: params.get('q') ?? '',
    grades: (params.get('grade') ?? '')
      .split(',')
      .map((g) => g.trim().toUpperCase())
      .filter((g) => GRADE_GROUPS.includes(g)),
    sort: COMPARATORS[sort] ? sort : DEFAULT_SORT,
  };
}

/** Returns a new URLSearchParams with the given list keys applied; defaults are dropped to keep URLs clean. */
export function writeListParams(prev, patch) {
  const next = new URLSearchParams(prev);
  if ('q' in patch) {
    if (patch.q) next.set('q', patch.q);
    else next.delete('q');
  }
  if ('grades' in patch) {
    const ordered = GRADE_GROUPS.filter((g) => patch.grades.includes(g));
    if (ordered.length && ordered.length < GRADE_GROUPS.length) next.set('grade', ordered.join(','));
    else next.delete('grade');
  }
  if ('sort' in patch) {
    if (patch.sort && patch.sort !== DEFAULT_SORT) next.set('sort', patch.sort);
    else next.delete('sort');
  }
  return next;
}
