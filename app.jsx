// app.jsx — single-version clickable experience. Fleet map (themed to match the version)
// → click PB-07 → full-screen site detail for THIS build's version. Version set per entry file.
const VCFG = {
  v1: { label: 'Editorial', sub: 'V1', comp: window.VEditorial, accent: '#4A5568', startDark: false, font: 'V1' },
  v2: { label: 'Console', sub: 'V2', comp: window.VConsole, accent: '#5B83D8', startDark: true, font: 'V2' },
  v4: { label: 'Orange Ops', sub: 'V4', comp: window.VOrange, accent: '#D2691E', startDark: true, font: 'V4' },
};
const VERSION = window.PROTO_VERSION && VCFG[window.PROTO_VERSION] ? window.PROTO_VERSION : 'v1';
const CFG = VCFG[VERSION];

// fixed 1440×900 board scaled to fill the area; margins are paper-colored (seamless, not letterboxed)
function Stage({ children }) {
  const ref = React.useRef(null);
  const [scale, setScale] = React.useState(0.5);
  React.useLayoutEffect(() => {
    const fit = () => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      setScale(Math.max(0.1, Math.min(r.width / 1440, r.height / 900)));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div ref={ref} style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'var(--paper)' }}>
      <div style={{ width: 1440, height: 900, transform: `scale(${scale})`, flexShrink: 0 }}>
        {children}
      </div>
    </div>
  );
}

function DetailView({ dark, onToggleTheme, onBack }) {
  const Comp = CFG.comp;
  return (
    <div className={'st-board' + (dark ? ' st-dark' : '')} data-screen-label={CFG.font + ' · Shell'} style={{ width: '100vw', height: '100vh', background: 'var(--paper)', color: 'var(--ink)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* control bar */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 18px', height: 56, borderBottom: '1px solid var(--line)', flexShrink: 0, background: 'var(--card)' }}>
        <button onClick={onBack} style={{ border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink)', height: 34, padding: '0 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 14 }}>←</span> Fleet
        </button>
        <span style={{ width: 1, height: 22, background: 'var(--line)' }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3 }}>Permian Basin</span>
          <span className="st-mono" style={{ fontSize: 10.5, color: 'var(--mut)', letterSpacing: 0.5 }}>PB-07 · TX</span>
        </div>
        <span style={{ flex: 1 }} />
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--line)', padding: '0 13px', height: 32 }}>
          <span className="st-mono" style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.5, color: CFG.accent }}>{CFG.sub}</span>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink2)' }}>{CFG.label}</span>
        </span>
        <button onClick={onToggleTheme} title="Toggle theme" style={{ border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink2)', width: 36, height: 34, cursor: 'pointer', fontFamily: 'inherit', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{dark ? '☽' : '☀'}</button>
      </header>
      <Stage key={dark ? 'd' : 'l'}><Comp dark={dark} /></Stage>
    </div>
  );
}

function App() {
  const [view, setView] = React.useState('fleet');
  const [dark, setDark] = React.useState(CFG.startDark);
  const toggle = () => setDark((d) => !d);
  return view === 'fleet'
    ? <window.FleetHome dark={dark} accent={CFG.accent} fontLabel={CFG.font} onToggleTheme={toggle} onOpen={() => setView('detail')} />
    : <DetailView dark={dark} onToggleTheme={toggle} onBack={() => setView('fleet')} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
