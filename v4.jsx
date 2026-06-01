// v4.jsx — "Orange Ops" · dense console, DARK sidebar rail, safety-orange, signals ticker.
// Compact photo news · minimap docked bottom-left.
const { T: T4, SITE: S4, Mono: Mono4, Tag: Tag4, MiniMap: MiniMap4, Gauge: Gauge4, CapacityBars: CapBars4, RiskRow: RiskRow4, NewsFeature: NewsFeat4, NewsPhotoRow: NewsRow4, MissingRow: MissRow4, DataRow: DataRow4 } = window;
const ORG = T4.orange;

function subColor4(v) { return v >= 80 ? 'var(--ink)' : v >= 65 ? ORG : 'var(--neg)'; }

function VOrange({ dark = false }) {
  const card = { background: 'var(--card)', border: `1px solid ${'var(--line)'}`, borderRadius: 2, padding: 15, display: 'flex', flexDirection: 'column', minWidth: 0 };
  const head = (idx, label, right) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <span className="st-mono" style={{ fontSize: 9, color: ORG, fontWeight: 700, letterSpacing: 0.8 }}>{idx}</span>
      <span className="st-mono" style={{ fontSize: 10, color: 'var(--ink2)', fontWeight: 700, letterSpacing: 1.2, whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      {right && <span className="st-mono" style={{ fontSize: 8.5, color: 'var(--faint)', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{right}</span>}
    </div>
  );
  return (
    <div className={'st-board' + (dark ? ' st-dark' : '')} data-screen-label="V4 · Orange Ops"
      style={{ width: '100%', height: '100%', background: 'var(--paper)', color: 'var(--ink)', display: 'flex' }}>

      {/* dark sidebar rail */}
      <div style={{ width: 68, flexShrink: 0, background: 'var(--rail)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '18px 0' }}>
        <span style={{ width: 32, height: 32, background: ORG, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16, borderRadius: 3 }}>T</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 28 }}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ width: 18, height: 18, border: `1.5px solid ${i === 1 ? ORG : 'rgba(255,255,255,.28)'}`, background: i === 1 ? 'rgba(194,65,12,.25)' : 'transparent', borderRadius: 3 }} />
          ))}
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <span className="st-mono" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,.55)' }}>{S4.codename} · ACTIVE</span>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pos)', animation: 'st-blink 1.8s infinite' }} />
        </div>
      </div>

      {/* main */}
      <div style={{ flex: 1, minWidth: 0, minHeight: 0, padding: 24, display: 'flex', flexDirection: 'column', gap: 11 }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3 }}>{S4.name}</span>
            <Mono4 size={10} color={ORG}>{S4.codename}</Mono4>
            <span style={{ height: 16, width: 1, background: 'var(--line)' }} />
            <Mono4 size={10} ls={0.5} color={'var(--mut)'}>{S4.region} · {S4.coords}</Mono4>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {S4.tags.map((t) => <Tag4 key={t}>{t}</Tag4>)}
            <button style={{ border: `1px solid ${ORG}`, background: ORG, color: '#fff', borderRadius: 2, padding: '0 16px', height: 32, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>SAVE</button>
          </div>
        </div>

        {/* signals ticker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--rail)', borderRadius: 2, padding: '8px 14px', overflow: 'hidden' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: ORG, animation: 'st-blink 1.4s infinite' }} />
            <Mono4 size={9.5} ls={1.2} weight={700} color="#fff">SIGNALS</Mono4>
          </span>
          <div style={{ display: 'flex', gap: 22, whiteSpace: 'nowrap', overflow: 'hidden' }}>
            {['ERCOT interconnect study fast-tracked', 'Zoning overlay approved 2–1', '1.8 GW LOI signed', 'Aquifer drawdown notice filed', 'Fleet rank ↑ to #1'].map((t, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Mono4 size={10} color="rgba(255,255,255,.85)" ls={0.3}>{t}</Mono4>
                <span className="st-mono" style={{ color: ORG, fontSize: 10 }}>·</span>
              </span>
            ))}
          </div>
        </div>

        {/* bento — 3 balanced rows */}
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gridTemplateRows: 'repeat(3, minmax(0, 1fr))', gap: 10,
          gridTemplateAreas: `"score score score score grid grid grid grid news news news news" "score score score score risk risk risk risk news news news news" "cap cap cap cap map map map map miss miss miss miss"` }}>

          {/* score */}
          <div style={{ ...card, gridArea: 'score' }}>
            {head('01', 'COMPOSITE', 'RANK #1/6')}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <Gauge4 value={S4.score.num} size={118} stroke={10} accent={ORG} sub="GRADE A+" />
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 1 }}>{S4.score.tier}</div>
                <Mono4 size={10} color={'var(--pos)'} style={{ display: 'block', marginTop: 5 }}>{S4.score.delta}</Mono4>
                <Mono4 size={9.5} color={'var(--mut)'} style={{ display: 'block', marginTop: 8 }}>FLEET RANK 1 / 6</Mono4>
              </div>
            </div>
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: `1px solid ${'var(--line)'}`, marginTop: 14, paddingTop: 14 }}>
              {S4.subscores.slice(0, 6).map((s) => (
                <div key={s.k} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Mono4 size={9.5} color={'var(--ink2)'} style={{ width: 42 }}>{s.k}</Mono4>
                  <div style={{ flex: 1, height: 6, background: 'var(--line)' }}><div style={{ width: `${s.v}%`, height: '100%', background: subColor4(s.v) }} /></div>
                  <Mono4 size={9.5} weight={700} color={'var(--ink)'} style={{ width: 18, textAlign: 'right' }}>{s.v}</Mono4>
                </div>
              ))}
            </div>
          </div>

          {/* risk */}
          <div style={{ ...card, gridArea: 'risk' }}>
            {head('02', 'RISK MATRIX')}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {S4.risks.slice(0, 3).map((r, i) => <RiskRow4 key={r.k} r={r} last={i === 2} />)}
            </div>
          </div>
          {/* grid */}
          <div style={{ ...card, gridArea: 'grid' }}>
            {head('03', 'GRID')}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <DataRow4 label="Sub" value={S4.grid.sub} mono={false} />
              <DataRow4 label="Dist" value={S4.grid.dist} />
              <DataRow4 label="Headroom" value={S4.grid.headroom} accent={ORG} />
              <DataRow4 label="Queue" value={S4.grid.queue} />
              <DataRow4 label="Energize" value={S4.grid.energize} last />
            </div>
          </div>

          {/* capacity */}
          <div style={{ ...card, gridArea: 'cap' }}>
            {head('04', 'CAP')}
            <div style={{ flex: 1, minHeight: 0 }}><CapBars4 accent={ORG} showAxis={false} /></div>
          </div>

          {/* missing */}
          <div style={{ ...card, gridArea: 'miss' }}>
            {head('05', 'MISSING', '4')}
            {S4.missing.slice(0, 3).map((m, i) => <MissRow4 key={m.k} m={m} last={i === 2} />)}
          </div>

          {/* news — photo */}
          <div style={{ ...card, gridArea: 'news' }}>
            {head('06', 'LOCAL NEWS', 'LIVE')}
            <div style={{ marginBottom: 6 }}><NewsFeat4 n={S4.news[0]} seed={0} height={132} /></div>
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {S4.news.slice(1, 4).map((n, i) => <NewsRow4 key={n.t} n={n} seed={i + 1} last={i === 2} />)}
            </div>
          </div>

          {/* minimap — bottom-left */}
          <div style={{ gridArea: 'map', minWidth: 0 }}>
            <MiniMap4 accent={ORG} height="100%" label="FLEET" />
          </div>
        </div>
      </div>
    </div>
  );
}
window.VOrange = VOrange;
