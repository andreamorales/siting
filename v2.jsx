// v2.jsx — "Status Console" · DARK conjoined module grid (no white). Space Grotesk + Space Mono.
// Black instrument panel, dashed hairline dividers, steel-blue accent + functional status color.
const { SITE: S2, FakePhoto: FakePhoto2, MiniMap: MiniMap2, CapacityBars: CapBars2 } = window;

// dark palette
const P = {
  page: '#0A0B0E', panel: '#14171C', frame: '#2C313A',
  ink: '#ECEEF1', ink2: '#C4C9D0', mut: '#8A909A', faint: '#5C626B',
  line: '#2C313A', line2: '#22262C',
  acc: '#5B83D8', green: '#43BE86', amber: '#E0A53E', red: '#E26B5C',
};
const sev2 = (s) => (s >= 3 ? 'var(--neg)' : s === 2 ? 'var(--warn)' : 'var(--pos)');
const sevW2 = (w) => ({ HIGH: 'var(--neg)', MED: 'var(--warn)', 'LOW–MOD': 'var(--warn)', MODERATE: 'var(--warn)', LOW: 'var(--pos)' }[w] || 'var(--ink2)');

function M2({ children, s = 10, c = 'var(--mut)', w = 500, ls = 0.6, style }) {
  return <span className="st-mono" style={{ fontSize: s, color: c, fontWeight: w, letterSpacing: ls, ...style }}>{children}</span>;
}

function ModHead({ idx, children, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <M2 s={9.5} c={P.acc} w={700} ls={1}>{idx}</M2>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--ink2)', whiteSpace: 'nowrap' }}>{children}</span>
      <span style={{ flex: 1 }} />
      {right && <M2 s={9} c={'var(--faint)'} ls={0.5} style={{ whiteSpace: 'nowrap' }}>{right}</M2>}
    </div>
  );
}

function FactorBars2() {
  const sc = (v) => (v >= 80 ? 'var(--pos)' : v >= 65 ? 'var(--warn)' : 'var(--neg)');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {S2.subscores.slice(0, 6).map((s) => (
        <div key={s.k} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <M2 s={9.5} c={'var(--ink2)'} ls={0.4} style={{ width: 54, flexShrink: 0 }}>{s.k}</M2>
          <div style={{ flex: 1, height: 7, background: 'var(--line2)' }}>
            <div style={{ width: `${s.v}%`, height: '100%', background: sc(s.v) }} />
          </div>
          <M2 s={10} c={'var(--ink)'} w={700} style={{ width: 20, textAlign: 'right' }}>{s.v}</M2>
        </div>
      ))}
    </div>
  );
}

function RiskRow2({ r, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: last ? 'none' : `1px solid ${'var(--line2)'}` }}>
      <div style={{ display: 'flex', gap: 2, width: 26, flexShrink: 0 }}>
        {[1, 2, 3].map((n) => <span key={n} style={{ width: 6, height: 14, background: n <= r.sev ? sev2(r.sev) : 'var(--line)', borderRadius: 1 }} />)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', letterSpacing: -0.1 }}>{r.k}</div>
        <div style={{ fontSize: 11, color: 'var(--mut)', marginTop: 1 }}>{r.note}</div>
      </div>
      <M2 s={10} w={700} c={sev2(r.sev)} ls={0.8} style={{ flexShrink: 0 }}>{r.level}</M2>
    </div>
  );
}

function MissRow2({ m, last }) {
  const c = sevW2(m.sev);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: last ? 'none' : `1px solid ${'var(--line2)'}` }}>
      <span style={{ width: 14, height: 14, flexShrink: 0, border: `1.5px solid ${c}`, borderRadius: 2, position: 'relative' }}>
        <span style={{ position: 'absolute', inset: 3, background: c, opacity: m.sev === 'HIGH' ? 1 : 0.3, borderRadius: 1 }} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{m.k}</div>
        <div style={{ fontSize: 10.5, color: 'var(--mut)', marginTop: 1 }}>{m.note}</div>
      </div>
      <M2 s={9.5} w={700} c={c} ls={0.8} style={{ flexShrink: 0 }}>{m.sev}</M2>
    </div>
  );
}

function NewsFeat2({ n }) {
  return (
    <div style={{ overflow: 'hidden', border: `1px solid ${'var(--line)'}` }}>
      <FakePhoto2 seed={0} height={118} label={n.src} sub="AERIAL · 32.0°N" />
      <div style={{ padding: '10px 12px', background: 'var(--card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: n.tone === 'neg' ? 'var(--warn)' : 'var(--pos)' }} />
          <M2 s={8.5} w={700} c={n.tone === 'neg' ? 'var(--warn)' : 'var(--pos)'} ls={0.8}>{n.tone === 'neg' ? 'WATCH' : 'TAILWIND'}</M2>
          <M2 s={8.5} c={'var(--faint)'} style={{ marginLeft: 'auto' }}>{n.ago}</M2>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>{n.t}</div>
      </div>
    </div>
  );
}

function NewsRow2({ n, seed, last }) {
  return (
    <div style={{ display: 'flex', gap: 11, padding: '9px 0', borderBottom: last ? 'none' : `1px solid ${'var(--line2)'}` }}>
      <div style={{ width: 70, flexShrink: 0, overflow: 'hidden', border: `1px solid ${'var(--line)'}` }}><FakePhoto2 seed={seed} height={50} /></div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <span style={{ width: 4.5, height: 4.5, borderRadius: '50%', background: n.tone === 'neg' ? 'var(--warn)' : 'var(--pos)', flexShrink: 0 }} />
          <M2 s={8.5} w={700} c={'var(--mut)'} ls={0.8} style={{ whiteSpace: 'nowrap' }}>{n.src}</M2>
          <M2 s={8.5} c={'var(--faint)'} style={{ marginLeft: 'auto' }}>{n.ago}</M2>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.28, fontWeight: 500 }}>{n.t}</div>
      </div>
    </div>
  );
}

function VConsole({ dark = false }) {
  const cell = { background: 'var(--card)', padding: 18, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' };
  const kpi = (ga, label, value, accent, sub) => (
    <div style={{ ...cell, gridArea: ga, padding: '14px 18px', justifyContent: 'center' }}>
      <M2 s={9.5} ls={1.2} c={'var(--mut)'}>{label}</M2>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
        <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: -1, color: accent, lineHeight: 1 }}>{value}</span>
        {sub && <M2 s={11} c={'var(--mut)'}>{sub}</M2>}
      </div>
    </div>
  );
  const dataRow = (label, value, accent, last) => (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, padding: '9px 0', borderBottom: last ? 'none' : `1px solid ${'var(--line2)'}` }}>
      <M2 s={9.5} ls={0.8} c={'var(--mut)'}>{label}</M2>
      <M2 s={12} w={700} c={accent || 'var(--ink)'} style={{ textAlign: 'right' }}>{value}</M2>
    </div>
  );
  return (
    <div className={'st-board' + (dark ? ' st-dark' : '')} data-screen-label="V2 · Status Console"
      style={{ width: '100%', height: '100%', background: 'var(--paper)', color: 'var(--ink)', padding: 28, display: 'flex' }}>

      {/* one enclosed conjoined grid */}
      <div className="v2grid" style={{ flex: 1, border: `1px solid ${'var(--frame)'}`, background: 'var(--card)', display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'auto auto minmax(0,1fr) 214px', gap: 0,
        gridTemplateAreas: `
          "brand brand brand brand brand brand brand brand brand brand brand brand"
          "k1 k1 k1 k2 k2 k2 k3 k3 k3 k4 k4 k4"
          "score score score score news news news news news grid grid grid"
          "risk risk risk cap cap cap miss miss miss map map map"` }}>

        {/* brand bar */}
        <div style={{ ...cell, gridArea: 'brand', flexDirection: 'row', alignItems: 'center', gap: 13, padding: '13px 18px' }}>
          <span style={{ width: 26, height: 26, background: P.acc, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>T</span>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 0.5, color: 'var(--ink)' }}>TERRASITE</span>
          <M2 s={10} ls={1.2} c={'var(--faint)'}>/ SITE ANALYSIS</M2>
          <span style={{ width: 1, height: 22, background: 'var(--line)', margin: '0 4px' }} />
          <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3, whiteSpace: 'nowrap', color: 'var(--ink)' }}>{S2.name}</span>
          <M2 s={11} c={'var(--mut)'} style={{ whiteSpace: 'nowrap' }}>{S2.codename} · {S2.coords}</M2>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            {S2.tags.map((t) => (
              <span key={t} className="st-mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: 'var(--ink2)', border: `1px solid ${'var(--line)'}`, padding: '4px 8px' }}>{t}</span>
            ))}
            <button style={{ border: 'none', background: P.acc, color: '#fff', padding: '0 20px', height: 34, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>SAVE SITE</button>
          </span>
        </div>

        {/* KPI modules */}
        {kpi('k1', 'COMPOSITE SCORE', S2.score.num, 'var(--pos)', '/100')}
        {kpi('k2', 'FLEET RANK', '#1', P.acc, 'of 6')}
        {kpi('k3', 'READINESS', '71%', 'var(--warn)')}
        {kpi('k4', 'OPEN BLOCKERS', '1', 'var(--neg)', 'high')}

        {/* score */}
        <div style={{ ...cell, gridArea: 'score' }}>
          <ModHead idx="01" right="GRADE A+">Composite Breakdown</ModHead>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginBottom: 16 }}>
            <span style={{ fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 0.8, color: P.acc }}>{S2.score.num}</span>
            <div style={{ paddingBottom: 6 }}>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 1, color: 'var(--ink)' }}>{S2.score.tier}</div>
              <M2 s={10} c={'var(--pos)'} style={{ display: 'block', marginTop: 3 }}>{S2.score.delta}</M2>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${'var(--line)'}`, paddingTop: 14, marginBottom: 12 }}>
            <M2 s={9.5} ls={1} c={'var(--mut)'} style={{ display: 'block', marginBottom: 11 }}>FACTOR BREAKDOWN</M2>
            <FactorBars2 />
          </div>
          <p style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--ink2)', margin: 'auto 0 0', textWrap: 'pretty' }}>{S2.verdict}</p>
        </div>

        {/* news */}
        <div style={{ ...cell, gridArea: 'news' }}>
          <ModHead idx="02" right="LIVE">Local Related News</ModHead>
          <div style={{ marginBottom: 5 }}><NewsFeat2 n={S2.news[0]} /></div>
          {S2.news.slice(1, 3).map((n, i) => <NewsRow2 key={n.t} n={n} seed={i + 1} last={i === 1} />)}
        </div>

        {/* grid connection */}
        <div style={{ ...cell, gridArea: 'grid' }}>
          <ModHead idx="03">Grid Connection</ModHead>
          {dataRow('INTERCONNECT', S2.grid.sub)}
          {dataRow('DISTANCE', S2.grid.dist)}
          {dataRow('HEADROOM', S2.grid.headroom, 'var(--pos)')}
          {dataRow('QUEUE', S2.grid.queue)}
          {dataRow('NEW LINE', S2.grid.newline)}
          {dataRow('ENERGIZE', S2.grid.energize, 'var(--ink)', true)}
        </div>

        {/* risk */}
        <div style={{ ...cell, gridArea: 'risk' }}>
          <ModHead idx="04">Environmental & Societal Risk</ModHead>
          {S2.risks.slice(0, 3).map((r, i) => <RiskRow2 key={r.k} r={r} last={i === 2} />)}
        </div>

        {/* capacity */}
        <div style={{ ...cell, gridArea: 'cap' }}>
          <ModHead idx="05" right="1.8 GW">Datacenter Capacity</ModHead>
          <div style={{ flex: 1, minHeight: 0 }}><CapBars2 accent={P.acc} dark /></div>
        </div>

        {/* missing */}
        <div style={{ ...cell, gridArea: 'miss' }}>
          <ModHead idx="06" right="4 ITEMS">Outstanding Requirements</ModHead>
          {S2.missing.slice(0, 3).map((m, i) => <MissRow2 key={m.k} m={m} last={i === 2} />)}
        </div>

        {/* minimap */}
        <div style={{ gridArea: 'map', minWidth: 0, background: 'var(--card)' }}>
          <MiniMap2 accent={P.acc} height="100%" label="FLEET" dark />
        </div>
      </div>
    </div>
  );
}
window.VConsole = VConsole;
