import { SITE } from '../../lib/siteData.js';

function NewsTicker({ items = SITE.news, variant = 'embedded' }) {
  const track = [...items, ...items];
  const isBar = variant === 'bar';
  const label = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0, ...(isBar ? {} : { marginBottom: 8 }) }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--pos)', animation: 'st-blink 1.4s infinite', flexShrink: 0 }} />
      <span className="st-subtitle" style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.1, color: 'var(--mut)', whiteSpace: 'nowrap' }}>Local News</span>
    </div>
  );
  const scroll = (
    <div
      style={{
        overflow: 'hidden', flex: isBar ? 1 : undefined, minWidth: 0,
        maskImage: isBar ? 'linear-gradient(90deg, #000 92%, transparent)' : 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
      }}
    >
      <div className="st-news-ticker-track" style={{ display: 'flex', width: 'max-content', gap: 28 }}>
        {track.map((n, i) => (
          <a
            key={`${n.src}-${i}`}
            className="st-news-ticker-link"
            href={n.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={!n.url ? (e) => e.preventDefault() : undefined}
          >
            <span className="st-mono" style={{ fontSize: 8.5, fontWeight: 700, color: n.tone === 'neg' ? 'var(--warn)' : 'var(--mut)', letterSpacing: 0.6 }}>{n.src}</span>
            <span className="st-news-ticker-headline" style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--ink2)' }}>{n.t}</span>
            <span className="st-mono" style={{ fontSize: 8.5, color: 'var(--faint)' }}>{n.ago}</span>
          </a>
        ))}
      </div>
    </div>
  );

  if (isBar) {
    return (
      <div
        className="st-news-ticker"
        style={{
          display: 'flex', alignItems: 'center', gap: 16, minWidth: 0,
          background: 'var(--card)', border: `1px solid ${'var(--line)'}`, borderRadius: 0, padding: '10px 18px',
        }}
      >
        {label}
        <span style={{ width: 1, alignSelf: 'stretch', background: 'var(--line)', flexShrink: 0 }} />
        {scroll}
      </div>
    );
  }

  return (
    <div className="st-news-ticker" style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${'var(--line2)'}` }}>
      {label}
      {scroll}
    </div>
  );
}

// ─────────────────────────── fake aerial/satellite photo ───────────────────────────
// Duotone land-imagery placeholder (parcel grid + terrain blobs + contour) — reads as
// a satellite tile, fitting for siting. Swap for real photos later.
const PHOTO_PAL = [
  ['#cdc6b4', '#8d8770', '#b6ad95'], // tan / arid
  ['#c2c8bd', '#828b7c', '#aab2a2'], // sage
  ['#bcc3cb', '#7f8893', '#a6aeb8'], // slate
  ['#d0c4b2', '#998463', '#bda988'], // ochre
];
function FakePhoto({ seed = 0, label, sub, height = 120, radius = 0, style }) {
  const p = PHOTO_PAL[seed % PHOTO_PAL.length];
  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: radius, overflow: 'hidden', background: p[1],
      backgroundImage: `radial-gradient(120% 90% at 18% 22%, ${p[2]} 0%, transparent 45%),
        radial-gradient(90% 80% at 82% 78%, ${p[0]} 0%, transparent 55%),
        linear-gradient(125deg, ${p[0]} 0%, ${p[1]} 100%)`, ...style }}>
      {/* parcel / section grid */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage:
        `linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)`,
        backgroundSize: '26px 26px' }} />
      {/* contour streaks */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.18, backgroundImage:
        `repeating-linear-gradient(58deg, rgba(0,0,0,.5) 0 1px, transparent 1px 14px)` }} />
      {/* vignette */}
      <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 40px rgba(0,0,0,.28)' }} />
      {/* corner reticle */}
      <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderTop: '1.5px solid rgba(255,255,255,.7)', borderRight: '1.5px solid rgba(255,255,255,.7)' }} />
      {label && (
        <span className="st-mono" style={{ position: 'absolute', left: 8, bottom: 7, fontSize: 8.5, fontWeight: 600, letterSpacing: 0.6, color: '#fff', background: 'rgba(15,16,18,.55)', padding: '2px 5px', borderRadius: radius ? 3 : 0 }}>{label}</span>
      )}
      {sub && (
        <span className="st-mono" style={{ position: 'absolute', right: 8, bottom: 7, fontSize: 8, color: 'rgba(255,255,255,.85)' }}>{sub}</span>
      )}
    </div>
  );
}

// ─────────────────────────── photo-led news ───────────────────────────
function NewsFeature({ n, seed = 0, accent: _accent = 'var(--ink)', rounded = 0, height = 132 }) {
  return (
    <div style={{ borderRadius: rounded, overflow: 'hidden', border: `1px solid ${'var(--line)'}` }}>
      <FakePhoto seed={seed} height={height} label={n.src} sub="AERIAL · 32.0°N" />
      <div style={{ padding: '11px 13px', background: 'var(--card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: n.tone === 'neg' ? 'var(--warn)' : 'var(--pos)' }} />
          <span className="st-mono" style={{ fontSize: 8.5, fontWeight: 700, color: n.tone === 'neg' ? 'var(--warn)' : 'var(--pos)', letterSpacing: 0.8 }}>{n.tone === 'neg' ? 'WATCH' : 'TAILWIND'}</span>
          <span className="st-mono" style={{ fontSize: 8.5, color: 'var(--faint)', marginLeft: 'auto' }}>{n.ago}</span>
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3, letterSpacing: -0.1 }}>{n.t}</div>
      </div>
    </div>
  );
}

function NewsPhotoRow({ n, seed = 0, last, rounded = 0 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 11, padding: '9px 0', borderBottom: last ? 'none' : `1px solid ${'var(--line2)'}` }}>
      <div style={{ width: 76, flexShrink: 0, borderRadius: rounded, overflow: 'hidden' }}>
        <FakePhoto seed={seed} height={56} />
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <span style={{ width: 4.5, height: 4.5, borderRadius: '50%', background: n.tone === 'neg' ? 'var(--warn)' : 'var(--pos)', flexShrink: 0 }} />
          <span className="st-mono" style={{ fontSize: 8.5, fontWeight: 700, color: 'var(--mut)', letterSpacing: 0.8, whiteSpace: 'nowrap' }}>{n.src}</span>
          <span className="st-mono" style={{ fontSize: 8.5, color: 'var(--faint)', marginLeft: 'auto' }}>{n.ago}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.28, fontWeight: 500 }}>{n.t}</div>
      </div>
    </div>
  );
}

export { NewsTicker, FakePhoto, NewsFeature, NewsPhotoRow };
