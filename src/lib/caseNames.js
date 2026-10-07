const LANDFORMS = ['Ridge', 'Hollow', 'Bluff', 'Mesa', 'Crossing', 'Basin', 'Summit', 'Bend', 'Flats', 'Point', 'Run', 'Falls', 'Prairie', 'Harbor', 'Grove', 'Heights'];

const SUFFIXES = ['Campus', 'Compute Park', 'AI Campus', 'Data Park', 'Compute Campus', 'Hyperscale', 'Cluster', 'Energy Park', 'Power Campus', 'Edge'];

const CODEWORDS = [
  'Halcyon', 'Meridian', 'Lodestar', 'Aurora', 'Ironwood', 'Kestrel', 'Bastion', 'Solstice', 'Cobalt', 'Tamarack',
  'Polaris', 'Juniper', 'Atlas', 'Sentinel', 'Cinder', 'Vanguard', 'Equinox', 'Granite', 'Larkspur', 'Zephyr',
  'Obsidian', 'Monarch', 'Helios', 'Quarry', 'Beacon', 'Fathom', 'Talon', 'Ember', 'Northstar', 'Corvid',
];

const COMPASS = ['North', 'South', 'East', 'West', 'High', 'Stone', 'Iron', 'Silver', 'Red', 'Clear'];
const GATES = ['gate', 'field', 'brook', 'haven', 'wood', 'water', 'point', 'crest'];

const NATURE = [
  'Blue Heron', 'Red Fox', 'Gray Wolf', 'Black Oak', 'White Pine', 'Silver Birch', 'Prairie Hawk', 'Copper Creek',
  'Cedar Hill', 'Stone River', 'Elk Meadow', 'Osprey', 'Bluestem', 'Sandhill', 'Cottonwood', 'Thunderhead',
];

const PLACE_PREFIX = /^(village|town|city|township|borough|charter township|unincorporated|census designated place)\s+of\s+/i;
const PLACE_SUFFIX = /\s+(county|parish|borough|census area|municipality|township|city|town|village|cdp)$/i;
const MAX_TOKEN_LEN = 14;

function hashString(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function seededRandom(seed) {
  let a = hashString(String(seed));
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (rand, list) => list[Math.floor(rand() * list.length)];

/** A short local word from the place ("Village of Hempstead" → "Hempstead", "Ector County" → "Ector"). */
export function placeToken(place) {
  const raw = place?.city || place?.county || place?.name?.split(',')[0] || '';
  const cleaned = raw.replace(PLACE_PREFIX, '').replace(PLACE_SUFFIX, '').trim();
  if (!cleaned || /\d/.test(cleaned)) return null;
  if (cleaned.length <= MAX_TOKEN_LEN) return cleaned;
  const words = cleaned.split(/\s+/);
  const last = words[words.length - 1];
  return last.length <= MAX_TOKEN_LEN ? last : null;
}

function candidate(rand, token) {
  const roll = rand();
  if (token && roll < 0.3) return `${token} ${pick(rand, LANDFORMS)} ${pick(rand, ['Campus', 'Compute Park', 'Data Park'])}`;
  if (token && roll < 0.5) return `${token} ${pick(rand, SUFFIXES)}`;
  if (roll < 0.68) return `Project ${pick(rand, CODEWORDS)}`;
  if (roll < 0.84) return `${pick(rand, COMPASS)}${pick(rand, GATES)} ${pick(rand, SUFFIXES)}`;
  return `${pick(rand, NATURE)} ${pick(rand, SUFFIXES)}`;
}

const ATTEMPTS = 40;

/**
 * Evocative project codename, loosely themed on the place.
 * Deterministic when `seed` is given; never returns a name in `taken` (case-insensitive).
 */
export function generateCaseName({ place, seed, taken = [] } = {}) {
  const rand = seed == null ? Math.random : seededRandom(seed);
  const used = new Set(taken.filter(Boolean).map((n) => n.toLowerCase()));
  const token = placeToken(place);
  let name = candidate(rand, token);
  for (let i = 0; i < ATTEMPTS && used.has(name.toLowerCase()); i += 1) name = candidate(rand, token);
  for (let n = 2; used.has(name.toLowerCase()); n += 1) name = `${name.replace(/ \d+$/, '')} ${n}`;
  return name;
}
