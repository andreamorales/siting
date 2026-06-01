// homepage.jsx — Fleet command map. Full-screen geospatial map + scrollable site roster.
// Clicking the active site (PB-07) — pin or roster row — opens the analysis examples.
const HREF = 'siting-tool.html';

const FLEET = [
  { id: 'PB-07', name: 'Permian Basin', region: 'TX', coords: '31.99°N 102.07°W', x: 33, y: 70, grade: 'A+', score: 92, tier: 'PRIME', gw: '1.8', status: 'ANALYSIS COMPLETE', updated: '2d ago', href: HREF },
  { id: 'CR-02', name: 'Cumberland Ridge', region: 'TN', coords: '36.16°N 85.50°W', x: 75, y: 55, grade: 'A−', score: 88, tier: 'STRONG', gw: '1.2', status: 'IN REVIEW', updated: '5d ago' },
  { id: 'SV-31', name: 'Shenandoah Valley', region: 'VA', coords: '38.50°N 78.86°W', x: 80, y: 45, grade: 'B+', score: 81, tier: 'VIABLE', gw: '1.1', status: 'IN REVIEW', updated: '1w ago' },
  { id: 'CL-05', name: 'Coastal Lowlands', region: 'GA', coords: '31.50°N 82.00°W', x: 82, y: 64, grade: 'B', score: 76, tier: 'VIABLE', gw: '1.4', status: 'DRAFT', updated: '1w ago' },
  { id: 'KM-11', name: 'Kearney Mesa', region: 'NE', coords: '40.70°N 99.08°W', x: 45, y: 36, grade: 'B−', score: 73, tier: 'VIABLE', gw: '0.9', status: 'DRAFT', updated: '2w ago' },
  { id: 'GB-19', name: 'Great Basin', region: 'NV', coords: '39.50°N 117.00°W', x: 18, y: 48, grade: 'C+', score: 64, tier: 'MARGINAL', gw: '0.6', status: 'DRAFT', updated: '3w ago' },
];
const tierColor = (s) => (s >= 85 ? 'var(--pos)' : s >= 72 ? 'var(--warn)' : 'var(--neg)');

function Mono({ children, s = 11, c = 'var(--mut)', w = 500, ls = 0.6, style }) {
  return <span className="st-mono" style={{ fontSize: s, color: c, fontWeight: w, letterSpacing: ls, ...style }}>{children}</span>;
}

// ─────────────────────── the command map ───────────────────────
function HomeMap({ hover, setHover, go, accent = '#5B83D8' }) {
  const cities = [
    [14, 38], [20, 60], [29, 22], [38, 52], [47, 18], [52, 70], [55, 28],
    [58, 34], [66, 48], [71, 24], [78, 70], [86, 40], [90, 58], [12, 72], [62, 14], [26, 40], [70, 64], [44, 62],
  ];
  return (
    <div style={{ position: 'relative', flex: 1, minWidth: 0, overflow: 'hidden', background: 'var(--mapbg)' }}>
      {/* graticule */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage:
        `linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)`,
        backgroundSize: '5% 7.5%' }} />
      {/* terrain hatch */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage:
        `repeating-linear-gradient(135deg, var(--line2) 0 1px, transparent 1px 14px)` }} />
      {/* soft glow around active site */}
      <div style={{ position: 'absolute', left: '33%', top: '70%', width: 620, height: 620, transform: 'translate(-50%,-50%)', pointerEvents: 'none',
        background: `radial-gradient(circle, ${accent}24, transparent 62%)`, borderRadius: '50%' }} />
      {/* concentric range rings around active site */}
      {[180, 340, 520].map((d) => (
        <div key={d} style={{ position: 'absolute', left: '33%', top: '70%', width: d, height: d, transform: 'translate(-50%,-50%)',
          border: `1px solid ${accent}1f`, borderRadius: '50%', pointerEvents: 'none' }} />
      ))}
      {/* frame ticks */}
      {['nw', 'ne', 'sw', 'se'].map((cc) => (
        <div key={cc} style={{ position: 'absolute', width: 14, height: 14,
          borderTop: cc[0] === 'n' ? `1.5px solid var(--ink2)` : 'none',
          borderBottom: cc[0] === 's' ? `1.5px solid var(--ink2)` : 'none',
          borderLeft: cc[1] === 'w' ? `1.5px solid var(--ink2)` : 'none',
          borderRight: cc[1] === 'e' ? `1.5px solid var(--ink2)` : 'none',
          top: cc[0] === 'n' ? 18 : 'auto', bottom: cc[0] === 's' ? 18 : 'auto',
          left: cc[1] === 'w' ? 18 : 'auto', right: cc[1] === 'e' ? 18 : 'auto' }} />
      ))}
      {/* coordinate / region labels */}
      <Mono s={10} c="var(--faint)" ls={1} style={{ position: 'absolute', top: 18, left: 40 }}>49°N</Mono>
      <Mono s={10} c="var(--faint)" ls={1} style={{ position: 'absolute', bottom: 18, left: 40 }}>25°N</Mono>
      <Mono s={10} c="var(--faint)" ls={1.5} style={{ position: 'absolute', top: 18, right: 40 }}>CONUS · FLEET GRID</Mono>
      <Mono s={10} c="var(--faint)" ls={1} style={{ position: 'absolute', bottom: 18, right: 40 }}>125°W → 67°W</Mono>

      {/* faint city dots */}
      {cities.map(([x, y], i) => (
        <span key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: 3, height: 3, borderRadius: '50%', background: 'var(--faint)', opacity: 0.6, transform: 'translate(-50%,-50%)' }} />
      ))}

      {/* site pins */}
      {FLEET.map((p) => {
        const active = hover === p.id;
        const clickable = !!p.href;
        const col = tierColor(p.score);
        return (
          <div key={p.id}
            onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)}
            onClick={clickable ? go : undefined}
            style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%,-50%)', cursor: clickable ? 'pointer' : 'default', zIndex: active ? 5 : 2 }}>
            {clickable && (
              <React.Fragment>
                <span style={{ position: 'absolute', left: '50%', top: '50%', width: 1, height: 120, background: `${accent}40`, transform: 'translate(-50%,-50%)' }} />
                <span style={{ position: 'absolute', left: '50%', top: '50%', height: 1, width: 120, background: `${accent}40`, transform: 'translate(-50%,-50%)' }} />
                <span style={{ position: 'absolute', left: '50%', top: '50%', width: 26, height: 26, borderRadius: '50%', border: `1.5px solid ${accent}`, transform: 'translate(-50%,-50%)', animation: 'st-pulse 2.6s ease-out infinite' }} />
              </React.Fragment>
            )}
            {/* diamond marker */}
            <span style={{ position: 'relative', display: 'block', width: clickable ? 14 : 10, height: clickable ? 14 : 10,
              transform: `rotate(45deg) scale(${active ? 1.25 : 1})`, transition: 'transform .15s',
              background: clickable ? col : 'var(--card)', border: `1.5px solid ${col}`,
              boxShadow: active ? `0 0 14px ${col}` : 'none' }} />
            {/* label */}
            {(active || clickable) && (
              <div style={{ position: 'absolute', left: 16, top: -8, whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', gap: 1,
                background: 'var(--mapcall)', border: `1px solid var(--line)`, padding: '4px 8px', backdropFilter: 'blur(4px)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mono s={10} w={700} c="var(--ink)">{p.id}</Mono>
                  <Mono s={10} w={700} c={col}>{p.grade}</Mono>
                </span>
                <Mono s={9} c="var(--mut)">{p.name}, {p.region}</Mono>
              </div>
            )}
          </div>
        );
      })}

      {/* map legend */}
      <div style={{ position: 'absolute', left: 40, bottom: 50, display: 'flex', flexDirection: 'column', gap: 7, background: 'var(--mapcall)', border: `1px solid var(--line)`, padding: '11px 13px' }}>
        <Mono s={9} ls={1.2} c="var(--mut)" style={{ marginBottom: 2 }}>SUITABILITY</Mono>
        {[['PRIME / STRONG', 'var(--pos)'], ['VIABLE', 'var(--warn)'], ['MARGINAL', 'var(--neg)']].map(([l, c]) => (
          <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, transform: 'rotate(45deg)', background: c }} />
            <Mono s={9.5} c="var(--ink2)">{l}</Mono>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────── roster row ───────────────────────
function SiteRow({ p, hover, setHover, go, accent = '#5B83D8' }) {
  const active = hover === p.id;
  const clickable = !!p.href;
  const col = tierColor(p.score);
  return (
    <div
      onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)}
      onClick={clickable ? go : undefined}
      style={{ padding: '16px 20px', borderBottom: `1px solid var(--line2)`, cursor: clickable ? 'pointer' : 'default',
        background: active ? `${accent}1a` : 'transparent', borderLeft: `2px solid ${active ? accent : 'transparent'}`,
        opacity: clickable ? 1 : 0.62, transition: 'background .12s, border-color .12s', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 7 }}>
        <span style={{ width: 9, height: 9, transform: 'rotate(45deg)', background: col, flexShrink: 0 }} />
        <Mono s={11} w={700} c="var(--ink)" ls={1}>{p.id}</Mono>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 18, fontWeight: 800, color: col, letterSpacing: -0.5 }}>{p.grade}</span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', letterSpacing: -0.2 }}>{p.name}</div>
      <Mono s={10.5} c="var(--mut)" style={{ display: 'block', marginTop: 2 }}>{p.region} · {p.coords}</Mono>
      {/* score bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 11 }}>
        <div style={{ flex: 1, height: 4, background: 'var(--line)', overflow: 'hidden' }}>
          <div style={{ width: `${p.score}%`, height: '100%', background: col }} />
        </div>
        <Mono s={10.5} w={700} c="var(--ink)">{p.score}</Mono>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 11 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: clickable ? 'var(--pos)' : 'var(--faint)' }} />
          <Mono s={9} ls={0.8} c={clickable ? 'var(--pos)' : 'var(--mut)'}>{p.status}</Mono>
        </span>
        <Mono s={9.5} c="var(--ink2)" style={{ marginLeft: 'auto' }}>{p.gw} GW</Mono>
        <Mono s={9} c="var(--faint)">· {p.updated}</Mono>
      </div>
      {clickable && (
        <div style={{ marginTop: 12, paddingTop: 11, borderTop: `1px solid var(--line2)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Mono s={10} w={700} ls={1.2} c={accent}>OPEN ANALYSIS</Mono>
          <span style={{ color: accent, fontSize: 14, lineHeight: 1 }}>→</span>
        </div>
      )}
    </div>
  );
}

function FleetHome({ dark = true, onOpen, onToggleTheme, accent = '#5B83D8', fontLabel = 'V2' }) {
  const [hover, setHover] = React.useState(null);
  const go = () => { onOpen && onOpen(); };
  const fleetAvg = Math.round(FLEET.reduce((a, p) => a + p.score, 0) / FLEET.length);
  return (
    <div className={'st-board' + (dark ? ' st-dark' : '')} data-screen-label={fontLabel + ' · Fleet'} style={{ width: '100vw', height: '100vh', background: 'var(--paper)', color: 'var(--ink)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* top bar */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0 22px', height: 60, borderBottom: `1px solid var(--line)`, flexShrink: 0, background: 'var(--card)' }}>
        <span style={{ width: 28, height: 28, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15 }}>T</span>
        <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3 }}>TERRASITE</span>
        <Mono s={10} ls={1.4} c="var(--faint)">/ FLEET COMMAND</Mono>
        <nav style={{ display: 'flex', gap: 20, marginLeft: 28 }}>
          <Mono s={11.5} c="var(--ink)" w={600}>Fleet Map</Mono>
          <Mono s={11.5} c="var(--mut)">Analyses</Mono>
          <Mono s={11.5} c="var(--mut)">Reports</Mono>
        </nav>
        <span style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1px solid var(--line)`, padding: '7px 12px', minWidth: 200, color: 'var(--faint)' }}>
          <Mono s={11} c="var(--faint)">⌕  Search sites, regions…</Mono>
        </div>
        <button onClick={onToggleTheme} title="Toggle theme" style={{ border: `1px solid var(--line)`, background: 'transparent', color: 'var(--ink2)', width: 38, height: 38, cursor: 'pointer', fontFamily: 'inherit', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{dark ? '☽' : '☀'}</button>
        <button onClick={go} style={{ border: 'none', background: accent, color: '#fff', padding: '0 18px', height: 38, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+ New Analysis</button>
      </header>

      {/* body */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <HomeMap hover={hover} setHover={setHover} go={go} accent={accent} />

        {/* roster panel */}
        <aside style={{ width: 384, flexShrink: 0, borderLeft: `1px solid var(--line)`, background: 'var(--card)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '18px 20px', borderBottom: `1px solid var(--line)`, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: 0.5 }}>FLEET</span>
              <Mono s={11} c="var(--mut)">{FLEET.length} SITES ANALYZED</Mono>
            </div>
            <div style={{ display: 'flex', gap: 22, marginTop: 14 }}>
              {[['FLEET AVG', fleetAvg, 'var(--ink)'], ['PRIME', '1', 'var(--pos)'], ['IN REVIEW', '2', 'var(--warn)']].map(([l, v, c]) => (
                <div key={l}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: c, letterSpacing: -0.5 }}>{v}</span>
                  <Mono s={9} ls={1} c="var(--mut)" style={{ display: 'block', marginTop: 2 }}>{l}</Mono>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: '11px 20px 8px', flexShrink: 0 }}>
            <Mono s={9.5} ls={1.4} c="var(--faint)">SORTED BY SUITABILITY ▾</Mono>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
            {FLEET.map((p) => <SiteRow key={p.id} p={p} hover={hover} setHover={setHover} go={go} accent={accent} />)}
            <div style={{ padding: '18px 20px', textAlign: 'center' }}>
              <Mono s={10} c="var(--faint)">END OF FLEET · 6 OF 6</Mono>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

window.FleetHome = FleetHome;
