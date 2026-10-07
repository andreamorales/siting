const NOMINATIM = 'https://nominatim.openstreetmap.org';

const BROAD_TYPES = new Set(['country', 'state', 'region', 'province', 'continent']);

const STATE_CODES = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA', Colorado: 'CO',
  Connecticut: 'CT', Delaware: 'DE', 'District of Columbia': 'DC', Florida: 'FL', Georgia: 'GA',
  Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL', Indiana: 'IN', Iowa: 'IA', Kansas: 'KS', Kentucky: 'KY',
  Louisiana: 'LA', Maine: 'ME', Maryland: 'MD', Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN',
  Mississippi: 'MS', Missouri: 'MO', Montana: 'MT', Nebraska: 'NE', Nevada: 'NV', 'New Hampshire': 'NH',
  'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND',
  Ohio: 'OH', Oklahoma: 'OK', Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI',
  'South Carolina': 'SC', 'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT', Vermont: 'VT',
  Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV', Wisconsin: 'WI', Wyoming: 'WY',
};

async function request(path, params, signal) {
  const url = `${NOMINATIM}/${path}?${new URLSearchParams({ format: 'jsonv2', ...params })}`;
  const res = await fetch(url, { signal, headers: { 'Accept-Language': 'en' } });
  if (!res.ok) throw new Error(`Geocoder responded ${res.status}`);
  return res.json();
}

export function searchPlaces(query, signal) {
  return request('search', { addressdetails: '1', countrycodes: 'us', limit: '5', q: query }, signal);
}

export async function reversePlace(lat, lng, signal) {
  const data = await request('reverse', { lat: String(lat), lon: String(lng), addressdetails: '1', zoom: '14' }, signal);
  if (data?.error) throw new Error(data.error);
  return data;
}

function shortLabel(result) {
  return result.name || result.display_name?.split(',')[0] || 'Selected area';
}

/**
 * Accepts county-level or finer results inside the U.S. Nominatim ranks: state = 8, county = 12, city = 16.
 * Returns null when acceptable, otherwise a user-facing hint.
 */
export function specificityIssue(result) {
  const code = result.address?.country_code;
  if (code && code !== 'us') return 'That spot is outside the United States — pick a U.S. location.';
  const kind = result.addresstype || result.type;
  const label = shortLabel(result);
  if (kind === 'country' || Number(result.place_rank) <= 4) {
    return `“${label}” is a whole country — try a county, city, or address.`;
  }
  if (BROAD_TYPES.has(kind) || Number(result.place_rank) < 12) {
    const noun = kind === 'state' ? 'a whole state' : 'too broad an area';
    return `“${label}” is ${noun} — try a county, city, or address.`;
  }
  return null;
}

export function toPlace(result) {
  const a = result.address ?? {};
  const state = a.state ?? '';
  const iso = a['ISO3166-2-lvl4'];
  const stateCode = iso?.startsWith('US-') ? iso.slice(3) : STATE_CODES[state] ?? state;
  const city = a.city || a.town || a.village || a.hamlet || a.municipality || '';
  const county = a.county || '';
  const kind = result.addresstype || result.type;
  const primary = kind === 'county' ? county || shortLabel(result) : city || county || shortLabel(result);
  return {
    name: stateCode ? `${primary}, ${stateCode}` : primary,
    display: result.display_name ?? primary,
    lat: Number(result.lat),
    lng: Number(result.lon),
    city,
    county,
    state,
    stateCode,
  };
}
