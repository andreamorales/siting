// Shared by api/news.js (Vercel, ?source=og) and the Vite dev middleware. Vercel skips `_`-prefixed files as routes.
const TIMEOUT_MS = 4000;
const MAX_BYTES = 512 * 1024;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36';
const PRIVATE_HOST = /^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|0\.|\[?::1\]?$|\[?f[cd])/i;
const META_KEYS = ['og:image:secure_url', 'og:image', 'og:image:url', 'twitter:image', 'twitter:image:src'];

function publicUrl(raw) {
  try {
    const url = new URL(raw);
    if ((url.protocol === 'http:' || url.protocol === 'https:') && !PRIVATE_HOST.test(url.hostname)) return url;
  } catch {}
  return null;
}

const timed = (init = {}) => ({ ...init, signal: AbortSignal.timeout(TIMEOUT_MS), headers: { 'User-Agent': UA, ...init.headers } });

/** Reads at most MAX_BYTES, stopping early once </head> has streamed past. */
async function readHead(res) {
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let html = '';
  let bytes = 0;
  while (bytes < MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.length;
    html += decoder.decode(value, { stream: true });
    if (/<\/head>/i.test(html)) break;
  }
  reader.cancel().catch(() => {});
  return html;
}

/** news.google.com/rss/articles/<id> is an opaque token; the News web app trades it for the publisher URL. */
async function decodeGoogleNews(url) {
  const id = url.pathname.split('/').pop();
  const page = await (await fetch(`https://news.google.com/articles/${id}`, timed())).text();
  const sig = page.match(/data-n-a-sg="([^"]+)"/)?.[1];
  const ts = page.match(/data-n-a-ts="([^"]+)"/)?.[1];
  if (!sig || !ts) return null;
  const req = JSON.stringify([
    'garturlreq',
    [['X', 'X', ['X', 'X'], null, null, 1, 1, 'US:en', null, 1, null, null, null, null, null, 0, 1], 'X', 'X', 1, [1, 1, 1], 1, 1, null, 0, 0, null, 0],
    id,
    Number(ts),
    sig,
  ]);
  const res = await fetch('https://news.google.com/_/DotsSplashUi/data/batchexecute', timed({
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: `f.req=${encodeURIComponent(JSON.stringify([[['Fbv4je', req, null, 'generic']]]))}`,
  }));
  const decoded = (await res.text()).match(/\\"garturlres\\",\\"(https?:[^\\"]+)\\"/)?.[1];
  return decoded ? publicUrl(decoded) : null;
}

const decodeEntities = (s) => s.replace(/&amp;/g, '&').replace(/&#x2F;/gi, '/').replace(/&#47;/g, '/').replace(/&quot;/g, '"');

function metaImage(html) {
  const found = {};
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const key = tag.match(/\b(?:property|name)\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase();
    const content = tag.match(/\bcontent\s*=\s*["']([^"']+)["']/i)?.[1];
    if (key && content && META_KEYS.includes(key) && !found[key]) found[key] = decodeEntities(content.trim());
  }
  return META_KEYS.map((k) => found[k]).find(Boolean) ?? null;
}

export async function resolveOgImage(raw) {
  let url = publicUrl(raw);
  if (!url) return null;
  if (url.hostname === 'news.google.com' && url.pathname.includes('/articles/')) url = await decodeGoogleNews(url);
  if (!url) return null;
  const res = await fetch(url, timed({ redirect: 'follow', headers: { Accept: 'text/html,application/xhtml+xml' } }));
  if (!res.ok || !/html/i.test(res.headers.get('content-type') ?? '')) return null;
  const image = metaImage(await readHead(res));
  if (!image) return null;
  try {
    return publicUrl(new URL(image, res.url))?.href ?? null;
  } catch {
    return null;
  }
}

export async function ogHandler(req, res) {
  const target = new URL(req.url, 'http://localhost').searchParams.get('url');
  let image = null;
  try {
    image = await resolveOgImage(target);
  } catch {}
  res.statusCode = 200;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', image ? 'public, s-maxage=86400, stale-while-revalidate=604800' : 'public, s-maxage=3600');
  res.end(JSON.stringify({ image }));
}
