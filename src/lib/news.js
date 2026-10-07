// Same paths in dev (Vite proxy / middleware) and prod (vercel.json → api/news.js).
const GOOGLE_URL = '/api/gnews';
const GDELT_URL = '/api/gdelt';
const OG_URL = '/api/og';

const CACHE_PREFIX = 'meterzero.news.v2.';
const OG_TIMEOUT_MS = 12000;
const OG_CONCURRENCY = 3;
const CACHE_TTL_MS = 18 * 60 * 60 * 1000;
const MIN_RESULTS = 3;
const MAX_ITEMS = 6;
const GOOGLE_TERMS = '("data center" OR "data centre" OR "AI data center" OR hyperscale OR nuclear)';
const GDELT_TERMS = '("data center" OR hyperscale)';
const GDELT_GAP_MS = 5000;
const GDELT_BACKOFF_MS = 60 * 1000;
const REQUEST_TIMEOUT_MS = 8000;

export const NEWS_ILLUSTRATIONS = ['/images/datacenter.png', '/images/smr.png', '/images/coolingtower.png', '/images/ai.png'];

export const NEWS_SOURCE_LABELS = { google: 'Google News', gdelt: 'GDELT' };

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function illustrationFor(key) {
  return NEWS_ILLUSTRATIONS[hash(key) % NEWS_ILLUSTRATIONS.length];
}

/** "now", "5h ago", "11d ago", "3mo ago", "2y ago". */
export function relativeAge(ms, now = Date.now()) {
  const mins = Math.max(0, Math.round((now - ms) / 60000));
  if (mins < 60) return mins < 1 ? 'now' : `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 45) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(days / 365)}y ago`;
}

/** Mixed-content safe; anything that still fails to load falls back to an illustration in the card. */
const toHttps = (url) => (url && /^https?:\/\//i.test(url) ? url.replace(/^http:/i, 'https:') : null);

/**
 * Narrow → broad, built only from the site's own geocoded place, so any user-added site works.
 * Town and county are pinned to the full state name so e.g. "Nassau County" doesn't pull in Florida.
 */
function scopesFor(place) {
  const state = place.state?.trim();
  const scopes = [];
  const add = (scope, label) => {
    if (!label || scopes.some((s) => s.label === label)) return;
    scopes.push({ scope, label, phrase: label === state ? `"${label}"` : `"${label}"${state ? ` "${state}"` : ''}` });
  };
  add('town', place.city?.trim());
  add('county', place.county?.trim());
  if (!scopes.length) add('town', place.name?.split(',')[0].trim());
  add('state', state);
  return scopes;
}

// Search terms can match article bodies; the headline itself must be on-topic.
const TOPIC_RE = /data ?cent(er|re)|hyperscal|\bAI\b|artificial intelligence|nuclear|reactor|\bSMRs?\b|megawatt|\bG?MW\b|power (plant|deal|grid|line)|\bgrid\b|server farm|cloud campus/i;
const SIMILAR_AT = 0.5;

const normalizeTitle = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const titleWords = (title) => new Set(normalizeTitle(title).split(' ').filter((w) => w.length > 3));

function similar(a, b) {
  let shared = 0;
  for (const w of a) if (b.has(w)) shared++;
  const union = a.size + b.size - shared;
  return union > 0 && shared / union >= SIMILAR_AT;
}

/** Keeps input (relevance) order while picking, then sorts the picks newest first. */
function finalize(items) {
  const picked = [];
  for (const item of items) {
    if (picked.length >= MAX_ITEMS) break;
    if (!item.title || !item.url || !TOPIC_RE.test(item.title)) continue;
    const words = titleWords(item.title);
    if (picked.some((p) => similar(p.words, words))) continue;
    picked.push({ ...item, words });
  }
  return picked.sort((a, b) => b.date - a.date).map(({ words: _words, ...item }) => item);
}

/** Caller aborts surface as AbortError; our own timeout as TimeoutError (treated as a plain failure). */
async function fetchWithTimeout(url, signal, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const onAbort = () => controller.abort(signal.reason);
  if (signal?.aborted) onAbort();
  signal?.addEventListener('abort', onAbort, { once: true });
  const timer = setTimeout(() => controller.abort(new DOMException('News request timed out', 'TimeoutError')), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }
}

async function fetchGoogle(phrase, signal) {
  const params = new URLSearchParams({ q: `${GOOGLE_TERMS} ${phrase} when:1y`, hl: 'en-US', gl: 'US', ceid: 'US:en' });
  const res = await fetchWithTimeout(`${GOOGLE_URL}?${params}`, signal);
  if (!res.ok) throw new Error(`Google News responded ${res.status}`);
  const doc = new DOMParser().parseFromString(await res.text(), 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('Google News returned invalid XML');
  return [...doc.querySelectorAll('item')].map((node) => {
    const text = (sel) => node.querySelector(sel)?.textContent?.trim() ?? '';
    const source = text('source');
    let title = text('title');
    const suffix = ` - ${source}`;
    if (source && title.endsWith(suffix)) title = title.slice(0, -suffix.length);
    return { title, source: source || 'Google News', url: text('link'), date: Date.parse(text('pubDate')) || 0, image: rssImage(node) };
  });
}

/** Google's feed rarely carries images today, but take one if it does. */
function rssImage(node) {
  const media = node.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'content')[0]?.getAttribute('url');
  const enclosure = [...node.getElementsByTagName('enclosure')].find((e) => /^image\//.test(e.getAttribute('type') ?? ''))?.getAttribute('url');
  const inline = node.querySelector('description')?.textContent?.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
  return toHttps(media || enclosure || inline);
}

let gdeltQueue = Promise.resolve();
let gdeltNextAt = 0;
let gdeltBlockedUntil = 0;

/** Serializes GDELT calls app-wide so they're always ≥5 s apart (its documented limit). */
function gdeltSlot() {
  const slot = gdeltQueue.then(async () => {
    const wait = gdeltNextAt - Date.now();
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    gdeltNextAt = Date.now() + GDELT_GAP_MS;
  });
  gdeltQueue = slot;
  return slot;
}

class RateLimited extends Error {}

/** GDELT's "20261005T143000Z" → epoch ms. */
function parseSeenDate(s = '') {
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(s);
  return m ? Date.UTC(m[1], m[2] - 1, m[3], m[4], m[5], m[6]) : 0;
}

async function fetchGdelt(phrase, signal) {
  if (Date.now() < gdeltBlockedUntil) throw new RateLimited('GDELT rate limit');
  await gdeltSlot();
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  if (Date.now() < gdeltBlockedUntil) throw new RateLimited('GDELT rate limit');
  const params = new URLSearchParams({
    query: `${GDELT_TERMS} ${phrase} sourcecountry:US`,
    mode: 'artlist',
    format: 'json',
    maxrecords: '10',
    sort: 'datedesc',
  });
  const res = await fetchWithTimeout(`${GDELT_URL}?${params}`, signal);
  if (res.status === 429) {
    gdeltBlockedUntil = Date.now() + GDELT_BACKOFF_MS;
    throw new RateLimited('GDELT rate limit');
  }
  if (!res.ok) throw new Error(`GDELT responded ${res.status}`);
  let data;
  try {
    data = JSON.parse(await res.text());
  } catch {
    // GDELT answers query-syntax problems with a 200 plain-text message.
    return [];
  }
  return (data.articles ?? []).map((a) => ({
    title: (a.title ?? '').replace(/\s+([,.:;!?%’'])/g, '$1').replace(/\s{2,}/g, ' ').trim(),
    source: a.domain || 'GDELT',
    url: a.url,
    date: parseSeenDate(a.seendate),
    image: toHttps(a.socialimage),
  }));
}

async function searchScopes(fetcher, scopes, signal) {
  let best = null;
  for (const { scope, phrase } of scopes) {
    let items;
    try {
      items = finalize(await fetcher(phrase, signal));
    } catch (err) {
      if (err.name === 'AbortError' || err instanceof RateLimited) throw err;
      continue;
    }
    if (items.length >= MIN_RESULTS) return { items, scope };
    if (items.length && !best) best = { items, scope };
  }
  return best;
}

function cacheKey(place) {
  return CACHE_PREFIX + [place.city, place.county, place.stateCode || place.state].map((s) => s ?? '').join('|').toLowerCase();
}

function readCacheEntry(key) {
  try {
    const entry = JSON.parse(localStorage.getItem(key) ?? 'null');
    if (entry && Date.now() - entry.at < CACHE_TTL_MS) return entry;
  } catch {}
  return null;
}

const readCache = (key) => readCacheEntry(key)?.result ?? null;

function writeCache(key, result, at = Date.now()) {
  try {
    localStorage.setItem(key, JSON.stringify({ at, result }));
  } catch {}
}

/**
 * Real local AI / data-center coverage for a site's place: Google News RSS first, GDELT as backup,
 * `fallback` (sample headlines) when both come up empty. Successful results are cached per place.
 * Resolves to `{ items, source: 'google'|'gdelt'|'mock', scope: 'town'|'county'|'state'|null }`.
 */
export async function fetchLocalNews(place, { signal, fallback = [] } = {}) {
  const key = cacheKey(place);
  const cached = readCache(key);
  if (cached) return cached;

  const scopes = scopesFor(place);
  const attempts = [['google', fetchGoogle], ['gdelt', fetchGdelt]];
  for (const [source, fetcher] of attempts) {
    let found = null;
    try {
      found = await searchScopes(fetcher, scopes, signal);
    } catch (err) {
      if (err.name === 'AbortError') throw err;
    }
    if (found) {
      const result = { items: found.items, source, scope: found.scope };
      writeCache(key, result);
      return result;
    }
  }
  return { items: fallback, source: 'mock', scope: null };
}

async function fetchOgImage(url, signal) {
  try {
    const res = await fetchWithTimeout(`${OG_URL}?${new URLSearchParams({ url })}`, signal, OG_TIMEOUT_MS);
    if (!res.ok) return null;
    return toHttps((await res.json()).image);
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    return null;
  }
}

/**
 * Fills in article photos (og:image via /api/og) for items that don't have one yet, calling
 * `onImage(url, image)` as each resolves. Every attempt — hit or miss — is written back to the
 * place's cache so revisits don't re-resolve.
 */
export async function resolveArticleImages(place, result, { signal, onImage } = {}) {
  if (result.source === 'mock') return;
  const items = result.items.map((item) => ({ ...item }));
  const pending = items.filter((item) => !item.image && !item.imageTried && item.url);
  if (!pending.length) return;

  const worker = async () => {
    for (let item = pending.shift(); item; item = pending.shift()) {
      const image = await fetchOgImage(item.url, signal);
      item.imageTried = true;
      if (image) {
        item.image = image;
        onImage?.(item.url, image);
      }
    }
  };
  await Promise.all(Array.from({ length: OG_CONCURRENCY }, worker));
  const key = cacheKey(place);
  const entry = readCacheEntry(key);
  if (entry) writeCache(key, { ...result, items }, entry.at);
}

/** Human label for the scope that produced results, e.g. "Nassau County". */
export function scopeLabel(place, scope) {
  if (scope === 'town') return place.city;
  if (scope === 'county') return place.county;
  if (scope === 'state') return place.state;
  return '';
}
