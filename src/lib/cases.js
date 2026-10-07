import { generateCaseName } from './caseNames';

const STORAGE_KEY = 'meterzero.cases';

/** Cases saved before codenames were named after their place; give them a stable codename seeded by id. */
function migrateNames(cases) {
  let changed = false;
  const taken = cases.filter((c) => c.nameGenerated || c.nameEdited).map((c) => c.name);
  const ordered = [...cases].sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));
  for (const c of ordered) {
    if (c.nameGenerated || c.nameEdited) continue;
    const label = c.placeLabel ?? c.place?.name ?? '';
    changed = true;
    c.placeLabel = label;
    if (!c.name || c.name === label) {
      c.name = generateCaseName({ place: c.place, seed: c.id, taken });
      c.nameGenerated = true;
    } else {
      c.nameEdited = true;
    }
    taken.push(c.name);
  }
  return changed;
}

function readAll() {
  let cases;
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    cases = Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
  if (migrateNames(cases)) writeAll(cases);
  return cases;
}

function writeAll(cases) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

export function listCases() {
  return readAll().sort((a, b) => b.createdAt - a.createdAt);
}

export function getCase(id) {
  return readAll().find((c) => c.id === id) ?? null;
}

export function saveCase(record) {
  const all = readAll();
  const next = { ...record, updatedAt: Date.now() };
  const idx = all.findIndex((c) => c.id === record.id);
  if (idx === -1) all.push(next);
  else all[idx] = next;
  writeAll(all);
  return next;
}

function takenNames(exceptId) {
  return readAll().filter((c) => c.id !== exceptId).map((c) => c.name);
}

/** Random codename unique among saved cases (and different from `current`). */
export function suggestCaseName(place, { exceptId, current } = {}) {
  return generateCaseName({ place, taken: [...takenNames(exceptId), current] });
}

export function createCase({ place, loadMw, technology, name, nameGenerated = false }) {
  const now = Date.now();
  const custom = name?.trim();
  const generated = !custom || nameGenerated;
  return saveCase({
    id: `site-${now.toString(36)}`,
    name: custom || suggestCaseName(place),
    nameGenerated: generated,
    nameEdited: !generated,
    placeLabel: place.name,
    place,
    loadMw,
    technology,
    createdAt: now,
  });
}

/** Empty names are ignored — the record is returned unchanged. */
export function renameCase(record, name) {
  const trimmed = name.trim();
  if (!trimmed || trimmed === record.name) return record;
  return saveCase({ ...record, name: trimmed, nameEdited: true, nameGenerated: false });
}

export function regenerateCaseName(record) {
  const name = suggestCaseName(record.place, { exceptId: record.id, current: record.name });
  return saveCase({ ...record, name, nameGenerated: true, nameEdited: false });
}

export function casePlaceLabel(record) {
  return record.placeLabel ?? record.place?.name ?? '';
}

/** Address minus the parts already in the place label and the country: "Nassau County, New York 11550". */
export function caseAddress(record) {
  const place = record.place ?? {};
  const primary = casePlaceLabel(record).split(',')[0].trim().toLowerCase();
  const parts = (place.display ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s && s !== 'United States' && s.toLowerCase() !== primary);
  const merged = [];
  for (const part of parts) {
    if (/^\d{5}(-\d{4})?$/.test(part) && merged.length) merged[merged.length - 1] += ` ${part}`;
    else merged.push(part);
  }
  return merged.join(', ');
}

export function caseUrl(id) {
  return `${window.location.origin}/app/site/${id}`;
}
