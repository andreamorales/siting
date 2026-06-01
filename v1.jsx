// v1.jsx — "Editorial Mono" · airy, ink-on-paper, SHARP corners (r0), giant letter grade.
// Photo-led news column · minimap docked bottom-left.
function VEditorial({ dark = false }) {
  const card = { background: 'var(--card)', border: `1px solid ${'var(--line)'}`, borderRadius: 0, padding: 22, minWidth: 0, display: 'flex', flexDirection: 'column' };
  return (
    <div className={'st-board' + (dark ? ' st-dark' : '')} data-screen-label="V1 · Editorial Mono"
      style={{ width: '100%', height: '100%', background: 'var(--paper)', color: 'var(--ink)', padding: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${'var(--line)'}`, paddingBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.6 }}>TERRA<span style={{ fontWeight: 400 }}>SITE</span></span>
          <Mono size={10} ls={1.5} color={'var(--faint)'}>CO-SITING INTELLIGENCE</Mono>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Mono size={11} ls={0.5} color={'var(--mut)'}>FLEET</Mono>
          <Mono size={11} ls={0.5} color={'var(--mut)'}>ANALYSIS</Mono>
          <span style={{ border: `1px solid ${'var(--ink)'}`, borderRadius: 0, padding: '7px 14px', fontSize: 12, fontWeight: 600 }}>+ Create Your Own</span>
        </div>
      </div>

      {/* site header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Mono size={11} ls={1.5} color={'var(--mut)'}>SITE {SITE.codename}</Mono>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--pos)' }} />
            <Mono size={10} ls={1} color={'var(--pos)'}>ANALYSIS COMPLETE</Mono>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <h1 className="v-display" style={{ fontSize: 40, fontWeight: 500, letterSpacing: -1, margin: 0 }}>{SITE.name}</h1>
            <Mono size={13} color={'var(--mut)'}>{SITE.region} · {SITE.coords}</Mono>
          </div>
          <div style={{ display: 'flex', gap: 7, marginTop: 12 }}>{SITE.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ border: `1px solid ${'var(--line)'}`, background: 'var(--card)', borderRadius: 0, width: 38, height: 38, cursor: 'pointer', color: 'var(--ink2)' }}>⧉</button>
          <button style={{ border: `1px solid ${'var(--solid)'}`, background: 'var(--solid)', color: 'var(--solidfg)', borderRadius: 0, padding: '0 22px', height: 38, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save site</button>
        </div>
      </div>

      {/* bento */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gridTemplateRows: '1fr 1fr 190px', gap: 13,
        gridTemplateAreas: `"score score risk risk news news" "score score grid cap news news" "map map grid miss news news"` }}>

        {/* score hero */}
        <div style={{ ...card, gridArea: 'score' }}>
          <Eyebrow idx="01" right="RANK #1 OF 6">Composite Score</Eyebrow>

          {/* grade + tier, aligned with a rule */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 26, marginTop: 6 }}>
            <div className="v-display" style={{ fontSize: 120, fontWeight: 500, letterSpacing: -4, lineHeight: 0.74 }}>{SITE.score.grade}</div>
            <div style={{ paddingLeft: 26, borderLeft: `1px solid ${'var(--line)'}`, alignSelf: 'stretch', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="v-display" style={{ fontSize: 30, fontWeight: 600, letterSpacing: 0.5 }}>{SITE.score.tier}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
                <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1 }}>{SITE.score.num}</span>
                <Mono size={12} color={'var(--mut)'}>/ 100</Mono>
              </div>
              <Mono size={11} color={'var(--pos)'} ls={0.5} style={{ display: 'block', marginTop: 6 }}>{SITE.score.delta}</Mono>
            </div>
          </div>

          {/* factor breakdown — editorial leader rows, fills the middle */}
          <div style={{ flex: 1, minHeight: 0, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${'var(--line)'}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Mono size={10} ls={1.4} color={'var(--mut)'} style={{ display: 'block' }}>FACTOR BREAKDOWN</Mono>
            {SITE.subscores.slice(0, 6).map((s) => (
              <div key={s.k} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{s.long}</span>
                <span style={{ flex: 1, borderBottom: `1px dotted ${'var(--faint)'}`, transform: 'translateY(-4px)' }} />
                <Mono size={11.5} weight={700} color={s.v >= 80 ? 'var(--ink)' : s.v >= 65 ? 'var(--warn)' : 'var(--neg)'}>{s.v}</Mono>
              </div>
            ))}
          </div>

          {/* verdict */}
          <p style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--ink2)', margin: 0, marginTop: 16, paddingTop: 14, borderTop: `1px solid ${'var(--line)'}`, textWrap: 'pretty' }}>{SITE.verdict}</p>
        </div>

        {/* risks */}
        <div style={{ ...card, gridArea: 'risk' }}>
          <Eyebrow idx="02">Environmental & Societal Risk</Eyebrow>
          {SITE.risks.slice(0, 3).map((r, i) => <RiskRow key={r.k} r={r} last={i === 2} />)}
        </div>

        {/* grid */}
        <div style={{ ...card, gridArea: 'grid' }}>
          <Eyebrow idx="03">Grid</Eyebrow>
          <DataRow label="Sub" value={SITE.grid.sub} mono={false} />
          <DataRow label="Dist" value={SITE.grid.dist} />
          <DataRow label="Headroom" value={SITE.grid.headroom} />
          <DataRow label="Energize" value={SITE.grid.energize} last />
        </div>

        {/* capacity */}
        <div style={{ ...card, gridArea: 'cap' }}>
          <Eyebrow idx="04" right="1.8 GW">Capacity</Eyebrow>
          <div style={{ flex: 1, minHeight: 0 }}><CapacityBars accent={'var(--ink)'} showAxis={false} /></div>
        </div>

        {/* missing */}
        <div style={{ ...card, gridArea: 'miss' }}>
          <Eyebrow idx="05" right="4">Missing</Eyebrow>
          {SITE.missing.slice(0, 2).map((m, i) => <MissingRow key={m.k} m={m} last={i === 1} />)}
        </div>

        {/* news — photo-led, prominent */}
        <div style={{ ...card, gridArea: 'news', padding: 18 }}>
          <Eyebrow idx="06" right="LIVE">Local Related News</Eyebrow>
          <div style={{ marginBottom: 4 }}><NewsFeature n={SITE.news[0]} seed={0} /></div>
          <div style={{ marginTop: 6 }}>
            {SITE.news.slice(1, 4).map((n, i) => <NewsPhotoRow key={n.t} n={n} seed={i + 1} last={i === 2} />)}
          </div>
        </div>

        {/* minimap — bottom-left */}
        <div style={{ gridArea: 'map', minWidth: 0 }}>
          <MiniMap accent={'var(--ink)'} height="100%" label="FLEET POSITION" />
        </div>
      </div>
    </div>
  );
}
window.VEditorial = VEditorial;
