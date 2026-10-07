// Production counterpart of the Vite dev proxy: vercel.json rewrites /api/gnews, /api/gdelt and /api/og here
// with ?source=…, and every other query param is forwarded to the upstream untouched.
import { ogHandler } from './_og.js';

const UPSTREAM = {
  google: 'https://news.google.com/rss/search',
  gdelt: 'https://api.gdeltproject.org/api/v2/doc/doc',
};

export default async function handler(req, res) {
  const params = new URL(req.url, 'http://localhost').searchParams;
  if (params.get('source') === 'og') return ogHandler(req, res);
  const base = UPSTREAM[params.get('source')];
  params.delete('source');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!base) {
    res.statusCode = 400;
    res.end('Unknown news source');
    return;
  }

  try {
    const upstream = await fetch(`${base}?${params}`, { headers: { 'User-Agent': 'MeterZero/1.0 (+news)' } });
    res.statusCode = upstream.status;
    res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', upstream.ok ? 'public, s-maxage=1800, stale-while-revalidate=3600' : 'no-store');
    res.end(await upstream.text());
  } catch {
    res.statusCode = 502;
    res.end('Upstream fetch failed');
  }
}
