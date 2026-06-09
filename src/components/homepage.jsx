import React from 'react';
import FleetMap from './FleetMap.jsx';
import { HeaderV1 } from './brandHeaders.jsx';

const FLEET = [
  { id: 'PB-07', name: 'Permian Basin', region: 'TX', coords: '31.99°N 102.07°W', grade: 'A+', score: 92, tier: 'PRIME', gw: '1.8', status: 'ANALYSIS COMPLETE', updated: '2d ago', clickable: true },
  { id: 'CR-02', name: 'Cumberland Ridge', region: 'TN', coords: '36.16°N 85.50°W', grade: 'A−', score: 88, tier: 'STRONG', gw: '1.2', status: 'IN REVIEW', updated: '5d ago' },
  { id: 'SV-31', name: 'Shenandoah Valley', region: 'VA', coords: '38.50°N 78.86°W', grade: 'B+', score: 81, tier: 'VIABLE', gw: '1.1', status: 'IN REVIEW', updated: '1w ago' },
  { id: 'CL-05', name: 'Coastal Lowlands', region: 'GA', coords: '31.50°N 82.00°W', grade: 'B', score: 76, tier: 'VIABLE', gw: '1.4', status: 'DRAFT', updated: '1w ago' },
  { id: 'KM-11', name: 'Kearney Mesa', region: 'NE', coords: '40.70°N 99.08°W', grade: 'B−', score: 73, tier: 'VIABLE', gw: '0.9', status: 'DRAFT', updated: '2w ago' },
  { id: 'GB-19', name: 'Great Basin', region: 'NV', coords: '39.50°N 117.00°W', grade: 'C+', score: 64, tier: 'MARGINAL', gw: '0.6', status: 'DRAFT', updated: '3w ago' },
];

const tierColor = (s) => (s >= 85 ? 'var(--pos)' : s >= 72 ? 'var(--warn)' : 'var(--neg)');

function Mono({ children, s = 11, c = 'var(--mut)', w = 500, ls = 0.6, style }) {
  return <span className="st-mono" style={{ fontSize: s, color: c, fontWeight: w, letterSpacing: ls, ...style }}>{children}</span>;
}

function SiteRow({ p, hover, setHover, go }) {
  const active = hover === p.id;
  const clickable = !!p.clickable;
  const col = tierColor(p.score);
  const accent = 'var(--ink)';

  return (
    <div
      onMouseEnter={() => setHover(p.id)}
      onMouseLeave={() => setHover(null)}
      onClick={clickable ? go : undefined}
      style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--line2)',
        cursor: clickable ? 'pointer' : 'default',
        background: active ? 'var(--line2)' : 'transparent',
        borderLeft: `2px solid ${active ? accent : 'transparent'}`,
        opacity: clickable ? 1 : 0.62,
        transition: 'background .12s, border-color .12s',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 7 }}>
        <span style={{ width: 9, height: 9, transform: 'rotate(45deg)', background: col, flexShrink: 0 }} />
        <Mono s={11} w={700} c="var(--ink)" ls={1}>{p.id}</Mono>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 18, fontWeight: 800, color: col, letterSpacing: -0.5 }}>{p.grade}</span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', letterSpacing: -0.2 }}>{p.name}</div>
      <Mono s={10.5} c="var(--mut)" style={{ display: 'block', marginTop: 2 }}>{p.region} · {p.coords}</Mono>
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
        <div style={{ marginTop: 12, paddingTop: 11, borderTop: '1px solid var(--line2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Mono s={10} w={700} ls={1.2} c="var(--ink)">OPEN ANALYSIS</Mono>
          <span style={{ color: 'var(--ink)', fontSize: 14, lineHeight: 1 }}>→</span>
        </div>
      )}
    </div>
  );
}

function FleetRoster({ hover, setHover, go, fleetAvg }) {
  return (
    <aside style={{ width: 384, flexShrink: 0, borderLeft: '1px solid var(--line)', background: 'var(--card)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
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
        {FLEET.map((p) => <SiteRow key={p.id} p={p} hover={hover} setHover={setHover} go={go} />)}
        <div style={{ padding: '18px 20px', textAlign: 'center' }}>
          <Mono s={10} c="var(--faint)">END OF FLEET · 6 OF 6</Mono>
        </div>
      </div>
    </aside>
  );
}

function FleetHome({ dark = false, onOpen, onToggleTheme }) {
  const [hover, setHover] = React.useState(null);
  const go = () => { onOpen && onOpen(); };
  const fleetAvg = Math.round(FLEET.reduce((a, p) => a + p.score, 0) / FLEET.length);
  const accent = 'var(--ink)';

  return (
    <div className={'st-board' + (dark ? ' st-dark' : '')} data-screen-label="Map · Fleet" style={{ width: '100vw', height: '100vh', background: 'var(--paper)', color: 'var(--ink)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <HeaderV1 mode="fleet" dark={dark} onToggleTheme={onToggleTheme} onPrimaryAction={go} />
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <FleetMap dark={dark} hover={hover} setHover={setHover} onOpenSite={go} accent={accent} />
        <FleetRoster hover={hover} setHover={setHover} go={go} fleetAvg={fleetAvg} />
      </div>
    </div>
  );
}

export { FleetHome };
