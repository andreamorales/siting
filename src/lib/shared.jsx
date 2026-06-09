import React from 'react';

// shared.jsx — data + tokens + American-Dynamism primitives for the siting tool.

// ─────────────────────────── tokens ───────────────────────────
const T = {
  paper: '#FDFDFC',
  card: '#FFFFFF',
  ink: '#1C1B1B',
  ink2: '#33373D',
  mut: '#767C84',
  faint: '#A6ABB1',
  line: '#E6E8EA',
  line2: '#F0F1F2',
  grid: 'rgba(11,12,14,0.05)',
  blue: '#1B4DD1',
  orange: '#C2410C',
  green: '#177245',
  amber: '#A4670B',
  red: '#B0201B',
  font: `'IBM Plex Mono', ui-monospace, monospace`,
  title: `'Kode Mono', ui-monospace, monospace`,
  mono: `'IBM Plex Mono', ui-monospace, monospace`,
};

// ─────────────────────────── data ───────────────────────────
const SITE = {
  codename: 'PB-07',
  name: 'Permian Basin',
  region: 'TX',
  coords: '31.997° N · 102.078° W',
  tags: ['SMR', '1.8 GW', '345kV ×2', 'GREENFIELD'],
  score: { grade: 'A+', num: 92, tier: 'PRIME', delta: '+4 vs. fleet avg' },
  verdict:
    'Exceptional co-siting candidate. Abundant interconnect headroom and a supportive zoning overlay outweigh moderate water-stress and induced-seismicity exposure.',
  subscores: [
    { k: 'Env', long: 'Environmental Risk', v: 61 },
    { k: 'Grid', long: 'Grid Capacity', v: 96 },
    { k: 'Reg', long: 'Regulatory Concerns', v: 84 },
    { k: 'Labor', long: 'Workforce Capacity', v: 78 },
    { k: 'Fiber', long: 'Fiber / Latency', v: 88 },
    { k: 'Social', long: 'Community Sentiment', v: 72 },
    { k: 'Land', long: 'Land & Zoning', v: 91 },
    { k: 'Seismic', long: 'Seismic Stability', v: 67 },
    { k: 'Water', long: 'Water Supply', v: 54 },
  ],
  risks: [
    { k: 'Water stress', level: 'HIGH', note: 'Arid basin; aquifer drawdown flagged', sev: 3 },
    { k: 'Induced seismicity', level: 'MODERATE', note: 'Proximity to injection wells', sev: 2 },
    { k: 'Air permitting (PSD)', level: 'MODERATE', note: 'Nonattainment buffer 41 mi', sev: 2 },
    { k: 'Community sentiment', level: 'LOW–MOD', note: '2 of 3 commissioners supportive', sev: 2 },
    { k: 'Protected habitat', level: 'LOW', note: 'No critical-habitat overlap', sev: 1 },
  ],
  grid: {
    sub: 'Mid-Odessa 345kV', dist: '14.2 mi', headroom: '1.8 GW',
    queue: 'ERCOT GINR #4471', energize: 'Q3 2029', newline: '22 mi · single-circuit',
  },
  capacity: [
    { p: 'PH I', mw: 600, yr: '2029' },
    { p: 'PH II', mw: 1200, yr: '2031' },
    { p: 'PH III', mw: 1800, yr: '2033' },
  ],
  capacityMax: 2000,
  news: [
    { src: 'REUTERS', t: 'ERCOT fast-tracks West Texas interconnect study', ago: '2d', tone: 'pos', url: 'https://www.reuters.com/business/energy/' },
    { src: 'E&E NEWS', t: 'Permian county approves advanced-reactor zoning overlay', ago: '6d', tone: 'pos', url: 'https://www.eenews.net/' },
    { src: 'S&P GLOBAL', t: 'SMR vendor signs LOI for 1.8 GW West Texas campus', ago: '2w', tone: 'pos', url: 'https://www.spglobal.com/commodityinsights/' },
    { src: 'ODESSA AM.', t: 'Groundwater district flags aquifer drawdown concerns', ago: '3w', tone: 'neg', url: 'https://www.oaoa.com/' },
  ],
  missing: [
    { k: 'Water rights agreement', sev: 'HIGH', note: 'No executed allocation on file' },
    { k: 'PSD air permit initiation', sev: 'MED', note: 'Application not yet filed' },
    { k: 'Community benefits agreement', sev: 'MED', note: 'In negotiation' },
    { k: 'Rail spur access study', sev: 'LOW', note: 'Feasibility pending' },
  ],
  factorDetails: {
    Env: {
      rows: [
        { label: 'Water stress', value: 'HIGH', accent: 'var(--neg)' },
        { label: 'Seismic', value: 'MODERATE', accent: 'var(--warn)' },
        { label: 'Air permit', value: 'MODERATE · 41 mi buffer' },
        { label: 'Habitat', value: 'LOW · no overlap', accent: 'var(--pos)' },
      ],
      note: 'Water rights remain the binding constraint; seismic and air risks are manageable with mitigation.',
    },
    Grid: {
      rows: [
        { label: 'Sub', value: 'Mid-Odessa 345kV', mono: false },
        { label: 'Dist', value: '14.2 mi' },
        { label: 'Headroom', value: '1.8 GW', accent: 'var(--pos)' },
        { label: 'Queue', value: 'ERCOT GINR #4471' },
        { label: 'Energize', value: 'Q3 2029' },
      ],
      note: 'Interconnect study fast-tracked; 1.8 GW headroom supports full phased campus build-out.',
    },
    Land: {
      rows: [
        { label: 'Zoning', value: 'Advanced-reactor overlay', mono: false },
        { label: 'Parcel', value: '2,840 ac · fee simple' },
        { label: 'Comp use', value: 'Industrial · unrestricted' },
        { label: 'Setback', value: 'Met · 500 ft buffer' },
      ],
      note: 'County approved zoning overlay 2–1; no conservation easements on parcel.',
    },
    Fiber: {
      rows: [
        { label: 'Nearest POP', value: '12.4 mi · I-20 corridor', mono: false },
        { label: 'Latency', value: '< 8 ms to Dallas' },
        { label: 'Paths', value: '2 diverse · buried' },
        { label: 'Capacity', value: '400 Gbps available' },
      ],
      note: 'Dual-route fiber along I-20; dark-fiber lease terms under review.',
    },
    Reg: {
      rows: [
        { label: 'NRC path', value: 'COL · anticipated', mono: false },
        { label: 'PSD air', value: 'Not yet filed' },
        { label: 'Timeline', value: '48–54 mo est.' },
        { label: 'Local board', value: 'Supportive · 2–1' },
      ],
      note: 'Federal schedule aligned with PH I; PSD initiation and water rights are primary open items.',
    },
    Labor: {
      rows: [
        { label: 'Metro', value: 'Midland–Odessa CSA', mono: false },
        { label: 'Skilled pool', value: '18.4k construction' },
        { label: 'Nuclear exp.', value: 'Limited · train-up' },
        { label: 'Competition', value: 'Moderate · O&G sector' },
      ],
      note: 'Strong regional craft labor; SMR vendor workforce MOU in draft.',
    },
    Social: {
      rows: [
        { label: 'Sentiment', value: 'Low–moderate support', mono: false },
        { label: 'Commissioners', value: '2 of 3 favorable' },
        { label: 'CBA status', value: 'In negotiation' },
        { label: 'Tax base', value: '+$42M annual est.' },
      ],
      note: 'Community benefits agreement pending; no organized opposition filed.',
    },
    Seismic: {
      rows: [
        { label: 'Exposure', value: 'Moderate · injection zone', mono: false },
        { label: 'Nearest well', value: '4.2 mi' },
        { label: 'Design basis', value: '0.15g PGA' },
        { label: 'Monitoring', value: 'NetQuake array active' },
      ],
      note: 'Induced seismicity manageable with siting buffer and monitoring plan.',
    },
    Water: {
      rows: [
        { label: 'Source', value: 'Ogallala aquifer', mono: false },
        { label: 'Stress', value: 'High · arid basin' },
        { label: 'Rights', value: 'Not executed' },
        { label: 'Demand', value: '4,200 ac-ft/yr est.' },
      ],
      note: 'Primary constraint; groundwater district flagged drawdown concerns.',
    },
  },
  // Saved fleet sites for the CONUS overview. x/y are % within the basemap.
  fleet: [
    { id: 'PB-07', g: 'A+', x: 33, y: 70, me: true },
    { id: 'CR-02', g: 'A−', x: 75, y: 56 },
    { id: 'KM-11', g: 'B+', x: 40, y: 30 },
    { id: 'CL-05', g: 'B', x: 82, y: 62 },
    { id: 'GB-19', g: 'C+', x: 22, y: 48 },
    { id: 'SV-31', g: 'B−', x: 60, y: 44 },
  ],
};

// ─────────────────────────── helpers ───────────────────────────
const sevColor = (sev) => (sev >= 3 ? 'var(--neg)' : sev === 2 ? 'var(--warn)' : 'var(--pos)');
const sevWord = (w) =>
  ({ HIGH: 'var(--neg)', MED: 'var(--warn)', 'LOW–MOD': 'var(--warn)', MODERATE: 'var(--warn)', LOW: 'var(--pos)' }[w] || 'var(--ink2)');

// one-time base styles + keyframes
if (typeof document !== 'undefined' && !document.getElementById('siting-base')) {
  const s = document.createElement('style');
  s.id = 'siting-base';
  s.textContent = `
    @keyframes st-pulse { 0%{transform:scale(1);opacity:.55} 70%{transform:scale(2.6);opacity:0} 100%{opacity:0} }
    @keyframes st-sweep { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes st-blink { 0%,100%{opacity:1} 50%{opacity:.25} }
    @keyframes st-ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    .st-news-ticker-track { animation: st-ticker 180s linear infinite; will-change: transform; }
    .st-news-ticker:hover .st-news-ticker-track { animation-play-state: paused; }
    .st-news-ticker-link {
      display: inline-flex; align-items: center; gap: 8px; white-space: nowrap;
      text-decoration: none; color: inherit; padding: 3px 6px; margin: -3px -6px;
      border-radius: 2px; transition: background 0.15s ease; cursor: pointer;
    }
    .st-news-ticker-link:hover { background: var(--line2); }
    .st-news-ticker-link:hover .st-news-ticker-headline { color: var(--ink); text-decoration: underline; text-underline-offset: 2px; }
    .st-board, .st-board * { box-sizing:border-box; }
    .st-board {
      --paper:#FDFDFC; --card:#FFFFFF; --ink:#1C1B1B; --ink2:#33373D; --mut:#767C84; --faint:#A6ABB1;
      --line:#E6E8EA; --line2:#F0F1F2; --grid:rgba(28,27,27,0.05);
      --solid:#1C1B1B; --solidfg:#FFFFFF; --rail:#1C1B1B; --mapbg:#FBFBFA; --mapcall:rgba(251,251,250,0.85);
      --pos:#177245; --warn:#A4670B; --neg:#B0201B; --frame:#C2C7CE;
      --scorebg:#1C1B1B; --scorefg:#F4F5F5; --scoremut:rgba(244,245,245,0.62);
      --scoreline:rgba(255,255,255,0.16); --scoreline2:rgba(255,255,255,0.08); --scoreaccent:#6EE7A8;
      font-family:${T.font}; -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility;
    }
    .st-board.st-dark {
      --paper:#0A0B0E; --card:#14171C; --ink:#ECEEF1; --ink2:#C4C9D0; --mut:#8A909A; --faint:#5C626B;
      --line:#2C313A; --line2:#22262C; --grid:rgba(255,255,255,0.06);
      --solid:#ECEEF1; --solidfg:#1C1B1B; --rail:#121110; --mapbg:#0E1116; --mapcall:rgba(14,17,22,0.85);
      --pos:#43BE86; --warn:#E0A53E; --neg:#E26B5C; --frame:#2C313A;
      --scorebg:#0E1522; --scorefg:#ECEEF1; --scoremut:rgba(236,238,241,0.58);
      --scoreline:rgba(255,255,255,0.12); --scoreline2:rgba(255,255,255,0.06); --scoreaccent:#5B83D8;
    }
    .st-score-card {
      background: var(--scorebg) !important;
      color: var(--scorefg);
      border-color: var(--scoreline) !important;
    }
    .st-mono { font-family:${T.mono}; font-variant-numeric:tabular-nums; }
    .st-title, .v-display { font-family:${T.title}; font-weight:500; }
    .st-subtitle {
      font-family:${T.title};
      font-variant-numeric:tabular-nums;
      text-transform:uppercase;
      letter-spacing:0.12em;
    }
  `;
  document.head.appendChild(s);
}

// ─────────────────────────── small atoms ───────────────────────────
function Mono({ children, style, size = 11, color = 'var(--mut)', weight = 500, ls = 0.6 }) {
  return (
    <span className="st-mono" style={{ fontSize: size, color, fontWeight: weight, letterSpacing: ls, whiteSpace: 'nowrap', ...style }}>
      {children}
    </span>
  );
}

// section eyebrow: tiny index + label + hairline
function Eyebrow({ idx, children, accent = 'var(--ink)', right, inverted = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
      {idx != null && (
        <span className="st-mono" style={{ fontSize: 10, color: inverted ? 'var(--scoreaccent)' : accent, fontWeight: 600, letterSpacing: 1 }}>{idx}</span>
      )}
      <span className="st-subtitle" style={{ fontSize: 11, color: inverted ? 'var(--scorefg)' : 'var(--ink2)', fontWeight: 600, letterSpacing: 1.4, whiteSpace: 'nowrap' }}>
        {children}
      </span>
      <span style={{ flex: 1, height: 1, background: inverted ? 'var(--scoreline)' : 'var(--line)' }} />
      {right && <span className="st-mono" style={{ fontSize: 10, color: inverted ? 'var(--scoremut)' : 'var(--faint)', letterSpacing: 0.5 }}>{right}</span>}
    </div>
  );
}

function Tag({ children, accent = 'var(--ink)', filled }) {
  return (
    <span
      className="st-mono"
      style={{
        fontSize: 10.5, letterSpacing: 1, fontWeight: 600, padding: '4px 8px',
        color: filled ? '#fff' : 'var(--ink2)',
        background: filled ? accent : 'transparent',
        border: `1px solid ${filled ? accent : 'var(--line)'}`,
        borderRadius: 2, textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

// ─────────────────────────── CONUS basemap ───────────────────────────
// Geospatial scatter: graticule + coordinate ticks + faint city dots +
// fleet pins. Active site gets a pulsing ring + crosshair + callout.
function Basemap({ accent = 'var(--ink)', height = 220, showCrosshair = true, dense = false, compact = false }) {
  const c = { bg: 'var(--mapbg)', grid: 'var(--grid)', hatch: 'var(--line2)', tick: 'var(--ink2)', faint: 'var(--faint)', dot: 'var(--faint)', pin: 'var(--card)', callTx: 'var(--ink)', callBg: 'var(--mapcall)' };
  const cities = [
    [14, 38], [20, 60], [29, 22], [38, 52], [47, 18], [52, 70],
    [58, 34], [66, 48], [71, 24], [78, 70], [86, 40], [90, 58], [12, 72], [62, 14],
  ];
  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden', background: c.bg }}>
      {/* graticule */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage:
        `linear-gradient(${c.grid} 1px, transparent 1px), linear-gradient(90deg, ${c.grid} 1px, transparent 1px)`,
        backgroundSize: '11.11% 16.66%' }} />
      {/* faint diagonal terrain hatch */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.45, backgroundImage:
        `repeating-linear-gradient(135deg, ${c.hatch} 0 1px, transparent 1px 9px)` }} />
      {/* corner frame ticks */}
      {['nw', 'ne', 'sw', 'se'].map((cc) => (
        <div key={cc} style={{ position: 'absolute', width: 9, height: 9,
          borderTop: cc[0] === 'n' ? `1.5px solid ${c.tick}` : 'none',
          borderBottom: cc[0] === 's' ? `1.5px solid ${c.tick}` : 'none',
          borderLeft: cc[1] === 'w' ? `1.5px solid ${c.tick}` : 'none',
          borderRight: cc[1] === 'e' ? `1.5px solid ${c.tick}` : 'none',
          top: cc[0] === 'n' ? 8 : 'auto', bottom: cc[0] === 's' ? 8 : 'auto',
          left: cc[1] === 'w' ? 8 : 'auto', right: cc[1] === 'e' ? 8 : 'auto' }} />
      ))}
      {/* coordinate labels */}
      <span className="st-mono" style={{ position: 'absolute', top: 8, left: 22, fontSize: 9, color: c.faint, letterSpacing: 0.5 }}>49°N</span>
      <span className="st-mono" style={{ position: 'absolute', bottom: 8, left: 22, fontSize: 9, color: c.faint, letterSpacing: 0.5 }}>25°N</span>
      <span className="st-mono" style={{ position: 'absolute', top: 8, right: 22, fontSize: 9, color: c.faint, letterSpacing: 0.5 }}>CONUS</span>
      {/* faint city dots */}
      {cities.map(([x, y], i) => (
        <span key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: 2.5, height: 2.5, borderRadius: '50%', background: c.dot, transform: 'translate(-50%,-50%)' }} />
      ))}
      {/* fleet pins */}
      {SITE.fleet.map((p) => (
        <div key={p.id} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%,-50%)' }}>
          {p.me && showCrosshair && (
            <React.Fragment>
              <span style={{ position: 'absolute', left: '50%', top: '50%', width: 1, height: compact ? '120%' : '150%', background: `${accent}55`, transform: 'translate(-50%,-50%)' }} />
              <span style={{ position: 'absolute', left: '50%', top: '50%', height: 1, width: compact ? '100%' : 320, background: `${accent}55`, transform: 'translate(-50%,-50%)' }} />
              <span style={{ position: 'absolute', left: '50%', top: '50%', width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${accent}`, transform: 'translate(-50%,-50%)', animation: 'st-pulse 2.6s ease-out infinite' }} />
            </React.Fragment>
          )}
          <span style={{ position: 'relative', display: 'block', width: p.me ? 11 : 7, height: p.me ? 11 : 7,
            transform: 'rotate(45deg)', background: p.me ? accent : c.pin,
            border: `1.5px solid ${p.me ? accent : c.faint}` }} />
          {p.me && (
            <span className="st-mono" style={{ position: 'absolute', left: 14, top: -5, whiteSpace: 'nowrap',
              fontSize: 10, fontWeight: 700, color: c.callTx, background: c.callBg, padding: '1px 4px', letterSpacing: 0.5 }}>
              {p.id} · {p.g}
            </span>
          )}
        </div>
      ))}
      {dense && (
        <span className="st-mono" style={{ position: 'absolute', bottom: 8, right: 22, fontSize: 9, color: c.faint }}>
          6 SITES · FLEET
        </span>
      )}
    </div>
  );
}

// ─────────────────────────── site-level grid schematic ───────────────────────────
// SMR (diamond) — transmission line — substation (circle) — datacenter (square).
function RegionMap({ accent = 'var(--ink)', height = 200 }) {
  return (
    <div style={{ position: 'relative', width: '100%', height, background: '#FBFBFA', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage:
        `radial-gradient(${'var(--grid)'} 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />
      <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {/* transmission lines */}
        <line x1="78" y1="118" x2="190" y2="78" stroke={accent} strokeWidth="1.4" strokeDasharray="5 4" />
        <line x1="190" y1="78" x2="320" y2="118" stroke={'var(--mut)'} strokeWidth="1.4" />
        <line x1="190" y1="78" x2="190" y2="150" stroke={'var(--line)'} strokeWidth="1" />
      </svg>
      {/* SMR */}
      <Node x={18} y={59} label="SMR · 1.8 GW" shape="diamond" accent={accent} />
      {/* substation */}
      <Node x={47.5} y={39} label="MID-ODESSA 345kV" shape="circle" accent={accent} />
      {/* datacenter */}
      <Node x={80} y={59} label="DATACENTER" shape="square" accent={'var(--mut)'} />
      <span className="st-mono" style={{ position: 'absolute', left: '28%', top: '30%', fontSize: 9, color: 'var(--faint)' }}>14.2 mi</span>
      <span className="st-mono" style={{ position: 'absolute', left: '60%', top: '30%', fontSize: 9, color: 'var(--faint)' }}>22 mi NEW</span>
    </div>
  );
}
function Node({ x, y, label, shape, accent }) {
  const base = { width: 16, height: 16, background: 'var(--card)', border: `1.6px solid ${accent}` };
  const sh = shape === 'diamond' ? { ...base, transform: 'rotate(45deg)' }
    : shape === 'circle' ? { ...base, borderRadius: '50%' }
    : { ...base, borderRadius: 2 };
  return (
    <div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <span style={sh} />
      <span className="st-mono" style={{ fontSize: 8.5, fontWeight: 600, color: 'var(--ink2)', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

// ─────────────────────────── radial gauge ───────────────────────────
function Gauge({
  value, size = 132, stroke = 9, accent = 'var(--ink)', label, sub,
  centerClassName, centerStyle, subColor = 'var(--mut)', trackColor = 'var(--line)', tickInactive = 'var(--line)',
  showTicks = true, useGradient = false, gradientFrom = 'rgba(255,255,255,0.15)', gradientTo = 'rgba(255,255,255,0.75)',
}) {
  const gradId = React.useId().replace(/:/g, '');
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  const cx = size / 2, cy = size / 2;
  const tickR = r + stroke / 2 + 4;
  const ticks = Array.from({ length: 40 });
  const progressStroke = useGradient ? `url(#${gradId})` : accent;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {showTicks && (
        <svg width={size} height={size} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {ticks.map((_, i) => {
            const a = (Math.PI * 2 * i) / ticks.length - Math.PI / 2;
            const major = i % 5 === 0;
            const r1 = tickR, r2 = tickR + (major ? 5 : 3);
            const on = i / ticks.length <= value / 100;
            return (
              <line key={i} x1={cx + Math.cos(a) * r1} y1={cy + Math.sin(a) * r1}
                x2={cx + Math.cos(a) * r2} y2={cy + Math.sin(a) * r2}
                stroke={on ? accent : tickInactive} strokeWidth={major ? 1.4 : 1} strokeLinecap="round"
                opacity={on ? (major ? 1 : 0.55) : 1} />
            );
          })}
        </svg>
      )}
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {useGradient && (
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientFrom} />
              <stop offset="100%" stopColor={gradientTo} />
            </linearGradient>
          </defs>
        )}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={progressStroke} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span className={centerClassName} style={{ fontSize: size * 0.32, fontWeight: 800, color: 'var(--ink)', lineHeight: 1, letterSpacing: -1, ...centerStyle }}>{label ?? value}</span>
        {sub && <span className="st-mono" style={{ fontSize: 8.5, color: subColor, letterSpacing: 1, marginTop: 3 }}>{sub}</span>}
      </div>
    </div>
  );
}

// ─────────────────────────── radar / spider ───────────────────────────
function Radar({ data, size = 280, accent = 'var(--ink)', accent2 = T.orange, threshold = 65 }) {
  const cx = size / 2, cy = size / 2, R = size / 2 - 42;
  const n = data.length;
  const pt = (i, rad) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
  };
  const poly = data.map((d, i) => pt(i, (d.v / 100) * R).join(',')).join(' ');
  const rings = [0.25, 0.5, 0.75, 1];
  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="radarfill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.06" />
        </radialGradient>
      </defs>
      {rings.map((rr, ri) => (
        <polygon key={ri}
          points={data.map((_, i) => pt(i, rr * R).join(',')).join(' ')}
          fill="none" stroke={ri === rings.length - 1 ? 'var(--line)' : 'var(--line2)'} strokeWidth="1" />
      ))}
      {data.map((_, i) => { const [x, y] = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={'var(--line2)'} strokeWidth="1" />; })}
      {/* ring value labels along the top spoke */}
      {rings.map((rr, ri) => (
        <text key={'rl' + ri} x={cx + 4} y={cy - rr * R} className="st-mono"
          style={{ fontSize: 7.5, fill: 'var(--faint)' }}>{rr * 100}</text>
      ))}
      <polygon points={poly} fill="url(#radarfill)" stroke={accent} strokeWidth="1.8" strokeLinejoin="round" />
      {data.map((d, i) => {
        const [x, y] = pt(i, (d.v / 100) * R);
        const weak = d.v < threshold;
        return weak
          ? <rect key={i} x={x - 3} y={y - 3} width={6} height={6} fill={accent2} transform={`rotate(45 ${x} ${y})`} />
          : <circle key={i} cx={x} cy={y} r="2.8" fill={accent} stroke="#fff" strokeWidth="1" />;
      })}
      {data.map((d, i) => {
        const [x, y] = pt(i, R + 17);
        const weak = d.v < threshold;
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            className="st-mono" style={{ fontSize: 9, fontWeight: weak ? 700 : 600, fill: weak ? accent2 : 'var(--ink2)', letterSpacing: 0.5 }}>
            {d.k}
          </text>
        );
      })}
    </svg>
  );
}

// ─────────────────────────── capacity bars ───────────────────────────
// Fully fluid phased build-out chart: fills its container's height, bar heights
// and gridlines are % of the live plot area (with headroom for value labels),
// so it stays well-proportioned at any cell size.
function CapacityBars({ accent = 'var(--ink)', showAxis = true, rounded = 0 }) {
  const ink = 'var(--ink)';
  const mut = 'var(--mut)';
  const faint = 'var(--faint)';
  const line = 'var(--line)';
  const line2 = 'var(--line2)';
  const max = SITE.capacityMax; // 2000 MW
  const ticks = [0, 1000, 2000];
  const target = 1800;
  const HEAD = 0.84; // reserve ~16% at top for value labels
  const pct = (v) => (v / max) * 100 * HEAD;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', minHeight: 0 }}>
      <div style={{ position: 'relative', flex: 1, minHeight: 0, marginLeft: 26 }}>
        {/* gridlines + y labels */}
        {ticks.map((t) => (
          <div key={t} style={{ position: 'absolute', left: 0, right: 0, bottom: `${pct(t)}%` }}>
            <span className="st-mono" style={{ position: 'absolute', left: -24, top: -6, fontSize: 8.5, color: faint, width: 20, textAlign: 'right' }}>{t / 1000}</span>
            <div style={{ height: 1, background: t === 0 ? line : line2 }} />
          </div>
        ))}
        {/* dashed target line */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: `${pct(target)}%`, borderTop: `1px dashed ${accent}`, opacity: 0.5 }}>
          <span className="st-mono" style={{ position: 'absolute', right: 0, top: -11, fontSize: 8, color: accent, letterSpacing: 0.3 }}>TARGET 1.8GW</span>
        </div>
        {/* bars */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', gap: '9%', padding: '0 5%' }}>
          {SITE.capacity.map((c, i) => {
            const op = 0.34 + (0.66 * i) / (SITE.capacity.length - 1);
            return (
              <div key={c.p} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                <span className="st-mono" style={{ fontSize: 11, fontWeight: 700, color: ink, marginBottom: 5, whiteSpace: 'nowrap' }}>{(c.mw / 1000).toFixed(1)}<span style={{ color: mut, fontWeight: 500 }}>GW</span></span>
                <div style={{ width: '100%', maxWidth: 56, height: `${pct(c.mw)}%`, background: accent, opacity: op, borderRadius: rounded ? `${rounded}px ${rounded}px 0 0` : 0 }} />
              </div>
            );
          })}
        </div>
      </div>
      {/* x labels */}
      <div style={{ display: 'flex', gap: '9%', padding: '0 5%', marginLeft: 26, marginTop: 6 }}>
        {SITE.capacity.map((c) => (
          <div key={c.p} style={{ flex: 1, textAlign: 'center' }}>
            <span className="st-mono" style={{ fontSize: 9, color: 'var(--ink2)', fontWeight: 600, letterSpacing: 0.5, display: 'block', whiteSpace: 'nowrap' }}>{c.p}</span>
            {showAxis && <span className="st-mono" style={{ fontSize: 8.5, color: faint, display: 'block', marginTop: 2 }}>{c.yr}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────── lists ───────────────────────────
function RiskRow({ r, accent, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: last ? 'none' : `1px solid ${'var(--line2)'}` }}>
      <div style={{ display: 'flex', gap: 2, width: 26, flexShrink: 0 }}>
        {[1, 2, 3].map((n) => (
          <span key={n} style={{ width: 6, height: 14, background: n <= r.sev ? sevColor(r.sev) : 'var(--line)', borderRadius: 1 }} />
        ))}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', letterSpacing: -0.1 }}>{r.k}</div>
        <div style={{ fontSize: 11, color: 'var(--mut)', marginTop: 1 }}>{r.note}</div>
      </div>
      <span className="st-mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: sevColor(r.sev), flexShrink: 0 }}>{r.level}</span>
    </div>
  );
}

function NewsRow({ n, last, thumb }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: last ? 'none' : `1px solid ${'var(--line2)'}` }}>
      {thumb && (
        <div style={{ width: 44, height: 34, flexShrink: 0, position: 'relative', background: '#FBFBFA', border: `1px solid ${'var(--line)'}`, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(135deg, ${'var(--line)'} 0 1px, transparent 1px 6px)` }} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: n.tone === 'neg' ? 'var(--warn)' : 'var(--pos)', flexShrink: 0 }} />
          <span className="st-mono" style={{ fontSize: 9, fontWeight: 700, color: 'var(--mut)', letterSpacing: 1, whiteSpace: 'nowrap' }}>{n.src}</span>
          <span className="st-mono" style={{ fontSize: 9, color: 'var(--faint)', marginLeft: 'auto' }}>{n.ago}</span>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.32, fontWeight: 500 }}>{n.t}</div>
      </div>
    </div>
  );
}

function MissingRow({ m, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: last ? 'none' : `1px solid ${'var(--line2)'}` }}>
      <span style={{ width: 14, height: 14, flexShrink: 0, border: `1.5px solid ${sevWord(m.sev)}`, borderRadius: 2, position: 'relative' }}>
        <span style={{ position: 'absolute', inset: 3, background: sevWord(m.sev), opacity: m.sev === 'HIGH' ? 1 : 0.25, borderRadius: 1 }} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{m.k}</div>
        <div style={{ fontSize: 10.5, color: 'var(--mut)', marginTop: 1 }}>{m.note}</div>
      </div>
      <span className="st-mono" style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.8, color: sevWord(m.sev), flexShrink: 0 }}>{m.sev}</span>
    </div>
  );
}

// data readout row (label · value) for grid panels
function DataRow({ label, value, mono = true, last, accent = 'var(--ink)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: last ? 'none' : `1px solid ${'var(--line2)'}` }}>
      <span className="st-mono" style={{ fontSize: 10, color: 'var(--mut)', letterSpacing: 0.8, textTransform: 'uppercase', flexShrink: 0, whiteSpace: 'nowrap' }}>{label}</span>
      <span className={mono ? 'st-mono' : ''} style={{ fontSize: 12.5, fontWeight: 600, color: accent, letterSpacing: mono ? 0 : -0.1, textAlign: 'right', flex: '1 1 auto', minWidth: 0, lineHeight: 1.3 }}>{value}</span>
    </div>
  );
}

function factorScoreColor(v) {
  return v >= 80 ? 'var(--ink)' : v >= 65 ? 'var(--warn)' : 'var(--neg)';
}

// Composite score factor list — dims non-hovered rows on hover.
function FactorBreakdown({ factors = SITE.subscores.slice(0, 6), variant = 'dots', scoreColor = factorScoreColor, labelWidth = 88, activeKey = null, onActiveKeyChange, inverted = false }) {
  const labelColor = inverted ? 'var(--scorefg)' : 'var(--ink2)';
  const nameColor = inverted ? 'var(--scorefg)' : 'var(--ink)';
  const dotColor = inverted ? 'var(--scoremut)' : 'var(--faint)';
  const trackBg = inverted ? 'var(--scoreline)' : 'var(--line2)';
  const valueColor = inverted ? 'var(--scorefg)' : 'var(--ink)';
  const rowProps = (k, layout) => ({
    onMouseEnter: () => onActiveKeyChange?.(k),
    style: {
      opacity: activeKey != null && activeKey !== k ? 0.28 : 1,
      transition: 'opacity 0.18s ease',
      cursor: 'default',
      ...layout,
    },
  });

  if (variant === 'bars') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {factors.map((s) => (
          <div key={s.k} {...rowProps(s.k, { display: 'flex', alignItems: 'center', gap: 10 })}>
            <span className="st-mono" style={{ fontSize: 9, color: labelColor, letterSpacing: 0.3, width: labelWidth, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: activeKey === s.k ? 700 : 500 }}>{s.long}</span>
            <div style={{ flex: 1, height: 7, background: trackBg }}>
              <div style={{ width: `${s.v}%`, height: '100%', background: scoreColor(s.v) }} />
            </div>
            <span className="st-mono" style={{ fontSize: 10, fontWeight: 700, color: valueColor, width: 20, textAlign: 'right' }}>{s.v}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {factors.map((s) => (
        <div key={s.k} {...rowProps(s.k, { display: 'flex', alignItems: 'baseline', gap: 10 })}>
          <span style={{ fontSize: 13, fontWeight: activeKey === s.k ? 700 : 600, color: nameColor, whiteSpace: 'nowrap' }}>{s.long}</span>
          <span style={{ flex: 1, borderBottom: `1px dotted ${dotColor}`, transform: 'translateY(-4px)' }} />
          <span className="st-mono" style={{ fontSize: 11.5, fontWeight: 700, color: scoreColor(s.v) }}>{s.v}</span>
        </div>
      ))}
    </div>
  );
}

function factorByKey(key) {
  return SITE.subscores.find((s) => s.k === key);
}

// Deep-dive card for each composite subscore factor.
function FactorCard({ factor, idx, details, style = {}, cardStyle = {}, className = '', children, showNote = true, Head = Eyebrow, activeKey = null, onActiveKeyChange }) {
  const rows = details?.rows || [];
  const dimmed = activeKey != null && activeKey !== factor.k;
  const active = activeKey === factor.k;
  const showNoteNow = showNote && details?.note && (activeKey == null || active);
  return (
    <div
      onMouseEnter={() => onActiveKeyChange?.(factor.k)}
      className={[
        'siting-card',
        'siting-factor-card',
        dimmed && 'siting-factor-card--dimmed',
        active && 'siting-factor-card--active',
        className,
      ].filter(Boolean).join(' ')}
      style={{
        ...cardStyle, ...style,
        opacity: dimmed ? 0.28 : 1,
        transition: 'opacity 0.18s ease',
      }}
    >
      <Head idx={idx} right={`${factor.v} / 100`}>{factor.long}</Head>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {rows.map((r, i) => (
          <DataRow
            key={r.label}
            label={r.label}
            value={r.value}
            mono={r.mono !== false}
            accent={r.accent || 'var(--ink)'}
            last={!children && !showNoteNow && i === rows.length - 1}
          />
        ))}
        {showNoteNow && (
          <p style={{ fontSize: 12, lineHeight: 1.45, color: 'var(--ink2)', margin: children ? '12px 0 0' : '12px 0 0', paddingTop: 12, borderTop: `1px solid ${'var(--line2)'}` }}>
            {details.note}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

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

// ─────────────────────────── minimap (corner HUD) ───────────────────────────
// Compact wayfinding map — small panel meant to dock in a lower corner.
function MiniMap({
  accent = 'var(--ink)',
  height = '100%',
  rounded = 0,
  label = 'FLEET MAP',
  showSearch = false,
  searchValue = 'County Rd 240, Ector County, TX 79765',
}) {
  const grad = 'linear-gradient(180deg, var(--mapbg), transparent)';
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', width: '100%', height,
      borderRadius: rounded, overflow: 'hidden', border: `1px solid var(--line)`, background: 'var(--mapbg)',
    }}>
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <Basemap accent={accent} height="100%" dense={false} showCrosshair compact />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 9px', background: grad, pointerEvents: 'none',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, background: accent, transform: 'rotate(45deg)' }} />
            <span className="st-subtitle" style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: 'var(--ink2)' }}>{label}</span>
          </span>
          <span className="st-mono" style={{ fontSize: 8.5, color: 'var(--faint)', letterSpacing: 0.5 }}>6 SITES</span>
        </div>
      </div>
      {showSearch && (
        <div
          className="siting-minimap-search"
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '6px 9px',
            borderTop: '1px solid var(--line)',
            background: 'var(--card)',
          }}
        >
          <span className="st-mono" style={{ fontSize: 10, color: 'var(--mut)', flexShrink: 0 }}>⌕</span>
          <span className="st-mono" style={{ fontSize: 9.5, color: 'var(--ink2)', letterSpacing: 0.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {searchValue}
          </span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────── photo-led news ───────────────────────────
function NewsFeature({ n, seed = 0, accent = 'var(--ink)', rounded = 0, height = 132 }) {
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

export {
  T, SITE, sevColor, sevWord, factorByKey,
  Mono, Eyebrow, Tag, Basemap, RegionMap, Node, Gauge, Radar, CapacityBars,
  RiskRow, NewsRow, MissingRow, DataRow, FactorCard, FactorBreakdown, factorScoreColor, NewsTicker,
  FakePhoto, MiniMap, NewsFeature, NewsPhotoRow,
};
