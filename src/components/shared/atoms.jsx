import { SITE, sevColor, sevWord, factorScoreColor } from '../../lib/siteData.js';

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

// ─────────────────────────── lists ───────────────────────────
function RiskRow({ r, accent: _accent, last }) {
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

// Deep-dive card for each composite subscore factor.
// eslint-disable-next-line no-unused-vars
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

export { Mono, Eyebrow, Tag, RiskRow, NewsRow, MissingRow, DataRow, FactorBreakdown, FactorCard };
