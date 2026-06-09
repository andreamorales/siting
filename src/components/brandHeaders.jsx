import React from 'react';

export function AtomGridWordmark({ variant = 'split', size = 20 }) {
  if (variant === 'split') {
    return (
      <span className="st-title" style={{ fontSize: size, fontWeight: 800, letterSpacing: -0.6, color: 'var(--ink)' }}>
        ATOM<span style={{ fontWeight: 400 }}>GRID</span>
      </span>
    );
  }
  return (
    <span className="st-title" style={{ fontSize: size, fontWeight: 700, letterSpacing: 0.5, color: 'var(--ink)' }}>
      ATOMGRID
    </span>
  );
}

function Mono({ children, s = 11, c = 'var(--mut)', w = 500, ls = 0.6, style }) {
  return <span className="st-mono" style={{ fontSize: s, color: c, fontWeight: w, letterSpacing: ls, ...style }}>{children}</span>;
}

export function HeaderV1({
  mode = 'fleet',
  dark = false,
  onToggleTheme,
  onPrimaryAction,
  primaryLabel = '+ Create Your Own',
}) {
  return (
    <header className="flex h-header w-full shrink-0 items-center justify-between border-b border-[color:var(--line)] bg-[color:var(--paper)] px-xxl box-border">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <AtomGridWordmark variant="split" size={20} />
        <span className="st-subtitle" style={{ fontSize: 10, color: 'var(--faint)', letterSpacing: '0.14em' }}>CO-SITING INTELLIGENCE</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {onToggleTheme && (
          <button onClick={onToggleTheme} title="Toggle theme" type="button" style={{ border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--ink2)', width: 38, height: 38, cursor: 'pointer', fontFamily: 'inherit', fontSize: 15, borderRadius: 0 }}>{dark ? '☽' : '☀'}</button>
        )}
        {(onPrimaryAction || (mode === 'detail' && primaryLabel)) && (
          <button onClick={onPrimaryAction} type="button" style={{ border: '1px solid var(--ink)', background: mode === 'detail' ? 'var(--solid)' : 'transparent', color: mode === 'detail' ? 'var(--solidfg)' : 'var(--ink)', borderRadius: 0, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: onPrimaryAction ? 'pointer' : 'default', fontFamily: 'inherit' }}>{primaryLabel}</button>
        )}
      </div>
    </header>
  );
}
