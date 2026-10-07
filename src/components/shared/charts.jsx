import React from 'react';
import { T, SITE } from '../../lib/siteData.js';

// ─────────────────────────── CONUS basemap ───────────────────────────
// Geospatial scatter: graticule + coordinate ticks + faint city dots +
// fleet pins. Active site gets a pulsing ring + crosshair + callout.
function Basemap({ accent = 'var(--ink)', height = 220, showCrosshair = true, showCallout = true, hideMePin = false, dense = false, compact = false }) {
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
          {!(p.me && hideMePin) && (
            <span style={{ position: 'relative', display: 'block', width: p.me ? 11 : 7, height: p.me ? 11 : 7,
              transform: 'rotate(45deg)', background: p.me ? accent : c.pin,
              border: `1.5px solid ${p.me ? accent : c.faint}` }} />
          )}
          {p.me && showCallout && (
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

export { Basemap, RegionMap, Node, Gauge, Radar, CapacityBars, MiniMap };
