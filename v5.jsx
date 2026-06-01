// v5.jsx — "Dual Vector" · blue+orange mission console, radar sub-scores.
// Photo news · minimap docked bottom-right.
const { T: T5, SITE: S5, Mono: Mono5, Eyebrow: Eyebrow5, Tag: Tag5, MiniMap: MiniMap5, Radar: Radar5, CapacityBars: CapBars5, RiskRow: RiskRow5, NewsFeature: NewsFeature5, NewsPhotoRow: NewsRow5, MissingRow: MissRow5, DataRow: DataRow5 } = window;
const B5 = T5.blue,O5 = T5.orange;

function VRadar() {
  const card = { background: T5.card, border: `1px solid ${T5.line}`, borderRadius: 3, padding: 20, display: 'flex', flexDirection: 'column', minWidth: 0 };
  return (
    <div className="st-board" data-screen-label="V5 · Dual Vector"
    style={{ width: '100%', height: '100%', background: T5.paper, color: T5.ink, padding: 34, display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 26, height: 26, position: 'relative', borderRadius: 2, overflow: 'hidden', display: 'flex' }}>
            <span style={{ flex: 1, background: B5 }} /><span style={{ flex: 1, background: O5 }} />
          </span>
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.4 }}>TERRASITE</span>
          <Mono5 size={10} ls={1.2} color={T5.faint}>/ VECTOR ANALYSIS</Mono5>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={{ border: `1px solid ${T5.line}`, background: T5.card, borderRadius: 2, padding: '0 14px', height: 36, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', color: T5.ink2 }}>+ Create Your Own</button>
          <button style={{ border: `1px solid ${T5.ink}`, background: T5.ink, color: '#fff', borderRadius: 2, padding: '0 20px', height: 36, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Save site</button>
        </div>
      </div>

      {/* site header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1, margin: 0 }}>{S5.name}</h1>
        <Mono5 size={12} color={T5.mut} style={{ paddingBottom: 4 }}>{S5.codename} · {S5.region} · {S5.coords}</Mono5>
        <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', paddingBottom: 3 }}>{S5.tags.map((t) => <Tag5 key={t}>{t}</Tag5>)}</div>
      </div>

      {/* bento */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gridTemplateRows: 'minmax(0,1fr) minmax(0,1fr) 170px', gap: 13,
        gridTemplateAreas: `"radar radar radar news news news" "radar radar radar news news news" "risk grid cap miss map map"` }}>

        {/* radar score */}
        <div style={{ ...card, gridArea: 'radar' }}>
          <Eyebrow5 idx="01" accent={B5} right="8 FACTORS">Composite Vector</Eyebrow5>
          <div style={{ flex: 1, display: 'flex', gap: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 68, fontWeight: 800, letterSpacing: -3, color: B5, lineHeight: 0.8 }}>{S5.score.num}</span>
                <span style={{ fontSize: 28, fontWeight: 800, color: T5.ink }}>{S5.score.grade}</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1.5, marginTop: 10 }}>{S5.score.tier}</div>
              <Mono5 size={10} color={T5.green} style={{ display: 'block', marginTop: 4 }}>{S5.score.delta}</Mono5>
              <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 7 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 18, height: 3, background: B5 }} /><Mono5 size={9.5} color={T5.mut}>FACTOR STRENGTH</Mono5></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 7, height: 7, background: O5, transform: 'rotate(45deg)' }} /><Mono5 size={9.5} color={T5.mut}>BELOW THRESHOLD</Mono5></span>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', width: "300px", alignItems: "stretch" }}><Radar5 data={S5.subscores} size={258} accent={B5} /></div>
          </div>
        </div>

        {/* news — photo */}
        <div style={{ ...card, gridArea: 'news', padding: 16 }}>
          <Eyebrow5 idx="02" accent={B5} right="LIVE">Local Related News</Eyebrow5>
          <div style={{ marginBottom: 4 }}><NewsFeature5 n={S5.news[0]} seed={0} height={128} /></div>
          <div style={{ marginTop: 4 }}>
            {S5.news.slice(1, 4).map((n, i) => <NewsRow5 key={n.t} n={n} seed={i + 1} last={i === 2} />)}
          </div>
        </div>

        {/* risk */}
        <div style={{ ...card, gridArea: 'risk' }}>
          <Eyebrow5 idx="03" accent={B5}>Risk</Eyebrow5>
          {S5.risks.slice(0, 2).map((r, i) => <RiskRow5 key={r.k} r={r} last={i === 1} />)}
        </div>

        {/* grid */}
        <div style={{ ...card, gridArea: 'grid' }}>
          <Eyebrow5 idx="04" accent={B5}>Grid</Eyebrow5>
          <DataRow5 label="Headroom" value={S5.grid.headroom} accent={B5} />
          <DataRow5 label="Dist" value={S5.grid.dist} />
          <DataRow5 label="Live" value={S5.grid.energize} last />
        </div>

        {/* capacity */}
        <div style={{ ...card, gridArea: 'cap' }}>
          <Eyebrow5 idx="05" accent={B5} right="1.8 GW">Capacity</Eyebrow5>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}><CapBars5 accent={B5} height={58} showAxis={false} /></div>
        </div>

        {/* missing */}
        <div style={{ ...card, gridArea: 'miss' }}>
          <Eyebrow5 idx="06" accent={O5}>Missing</Eyebrow5>
          {S5.missing.slice(0, 2).map((m, i) => <MissRow5 key={m.k} m={m} last={i === 1} />)}
        </div>

        {/* minimap — bottom-right */}
        <div style={{ gridArea: 'map', minWidth: 0 }}>
          <MiniMap5 accent={O5} height="100%" label="FLEET" />
        </div>
      </div>
    </div>);

}
window.VRadar = VRadar;