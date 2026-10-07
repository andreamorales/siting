import React from 'react';
import { DC, DCCtx, dcFlatten } from './design-canvas/core.js';
import { DCViewport } from './design-canvas/DCViewport.jsx';
import { DCArtboardFrame, DCEditable } from './design-canvas/DCArtboardFrame.jsx';
import { DCFocusOverlay } from './design-canvas/DCFocusOverlay.jsx';

// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// Exports (to window): DesignCanvas, DCSection, DCArtboard, DCPostIt.
// Artboards are reorderable (grip-drag), deletable, labels/titles are
// inline-editable, and any artboard can be opened in a fullscreen focus
// overlay (←/→/Esc). State persists to a .design-canvas.state.json sidecar
// via the host bridge. No assets, no deps.
//
// Usage:
//   <DesignCanvas>
//     <DCSection id="onboarding" title="Onboarding" subtitle="First-run variants">
//       <DCArtboard id="a" label="A · Dusk" width={260} height={480}>…</DCArtboard>
//       <DCArtboard id="b" label="B · Minimal" width={260} height={480}>…</DCArtboard>
//     </DCSection>
//   </DesignCanvas>
//
// Artboards are static design frames, not scroll regions — never use
// height: 100% + overflow: auto/scroll on inner elements; size each artboard
// to fit its content (explicit pixel height, or let it grow).
/* END USAGE */

// ─────────────────────────────────────────────────────────────
// DesignCanvas — stateful wrapper around the pan/zoom viewport.
// Owns runtime state (per-section order, renamed titles/labels, hidden
// artboards, focused artboard). Order/titles/labels/hidden persist to a
// .design-canvas.state.json
// sidecar next to the HTML. Reads go via plain fetch() so the saved
// arrangement is visible anywhere the HTML + sidecar are served together
// (omelette preview, direct link, downloaded zip). Writes go through the
// host's window.omelette bridge — editing requires the omelette runtime.
// Focus is ephemeral.
// ─────────────────────────────────────────────────────────────
const DC_STATE_FILE = '.design-canvas.state.json';

function DesignCanvas({ children, minScale, maxScale, style }) {
  const [state, setState] = React.useState({ sections: {}, focus: null });
  // Hold rendering until the sidecar read settles so the saved order/titles
  // appear on first paint (no source-order flash). didRead gates writes until
  // the read settles so the empty initial state can't clobber a slow read;
  // skipNextWrite suppresses the one echo-write that would otherwise follow
  // hydration.
  const [ready, setReady] = React.useState(false);
  const didRead = React.useRef(false);
  const skipNextWrite = React.useRef(false);

  React.useEffect(() => {
    let off = false;
    fetch('./' + DC_STATE_FILE)
      .then((r) => (r.ok ? r.json() : null))
      .then((saved) => {
        if (off || !saved || !saved.sections) return;
        skipNextWrite.current = true;
        setState((s) => ({ ...s, sections: saved.sections }));
      })
      .catch(() => {})
      .finally(() => { didRead.current = true; if (!off) setReady(true); });
    const t = setTimeout(() => { if (!off) setReady(true); }, 150);
    return () => { off = true; clearTimeout(t); };
  }, []);

  React.useEffect(() => {
    if (!didRead.current) return;
    if (skipNextWrite.current) { skipNextWrite.current = false; return; }
    const t = setTimeout(() => {
      window.omelette?.writeFile(DC_STATE_FILE, JSON.stringify({ sections: state.sections })).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state.sections]);

  // Build registries synchronously from children so FocusOverlay can read
  // them in the same render. Fragments are flattened; wrapping in other
  // elements still opts out of focus/reorder.
  const registry = {};     // slotId -> { sectionId, artboard }
  const sectionMeta = {};  // sectionId -> { title, subtitle, slotIds[] }
  const sectionOrder = [];
  dcFlatten(children).forEach((sec) => {
    if (!sec || sec.type !== DCSection) return;
    const sid = sec.props.id ?? sec.props.title;
    if (!sid) return;
    sectionOrder.push(sid);
    const persisted = state.sections[sid] || {};
    const abs = [];
    dcFlatten(sec.props.children).forEach((ab) => {
      if (!ab || ab.type !== DCArtboard) return;
      const aid = ab.props.id ?? ab.props.label;
      if (aid) abs.push([aid, ab]);
    });
    // hidden is scoped to one source revision — when the agent regenerates
    // (artboard-ID set changes), prior deletes don't apply to new content.
    const srcKey = abs.map(([k]) => k).join('\x1f');
    const hidden = persisted.srcKey === srcKey ? (persisted.hidden || []) : [];
    const srcIds = [];
    abs.forEach(([aid, ab]) => {
      if (hidden.includes(aid)) return;
      registry[`${sid}/${aid}`] = { sectionId: sid, artboard: ab };
      srcIds.push(aid);
    });
    const kept = (persisted.order || []).filter((k) => srcIds.includes(k));
    sectionMeta[sid] = {
      title: persisted.title ?? sec.props.title,
      subtitle: sec.props.subtitle,
      slotIds: [...kept, ...srcIds.filter((k) => !kept.includes(k))],
    };
  });

  const api = React.useMemo(() => ({
    state,
    section: (id) => state.sections[id] || {},
    patchSection: (id, p) => setState((s) => ({
      ...s,
      sections: { ...s.sections, [id]: { ...s.sections[id], ...(typeof p === 'function' ? p(s.sections[id] || {}) : p) } },
    })),
    setFocus: (slotId) => setState((s) => ({ ...s, focus: slotId })),
  }), [state]);

  // Esc exits focus; any outside pointerdown commits an in-progress rename.
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') api.setFocus(null); };
    const onPd = (e) => {
      const ae = document.activeElement;
      if (ae && ae.isContentEditable && !ae.contains(e.target)) ae.blur();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPd, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPd, true);
    };
  }, [api]);

  return (
    <DCCtx.Provider value={api}>
      <DCViewport minScale={minScale} maxScale={maxScale} style={style}>{ready && children}</DCViewport>
      {state.focus && registry[state.focus] && (
        <DCFocusOverlay entry={registry[state.focus]} sectionMeta={sectionMeta} sectionOrder={sectionOrder} />
      )}
    </DCCtx.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
// DCSection — editable title + h-row of artboards in persisted order
// ─────────────────────────────────────────────────────────────
function DCSection({ id, title, subtitle, children, gap = 48 }) {
  const ctx = React.useContext(DCCtx);
  const sid = id ?? title;
  const all = React.Children.toArray(dcFlatten(children));
  const artboards = all.filter((c) => c && c.type === DCArtboard);
  const rest = all.filter((c) => !(c && c.type === DCArtboard));
  const sec = (ctx && sid && ctx.section(sid)) || {};
  // Must match DesignCanvas's srcKey computation exactly (it filters falsy
  // IDs), or onDelete persists a srcKey that DesignCanvas never recognizes.
  const allIds = artboards.map((a) => a.props.id ?? a.props.label).filter(Boolean);
  const srcKey = allIds.join('\x1f');
  const hidden = sec.srcKey === srcKey ? (sec.hidden || []) : [];
  const srcOrder = allIds.filter((k) => !hidden.includes(k));
  const srcOrderKey = srcOrder.join('|');

  const order = React.useMemo(() => {
    const kept = (sec.order || []).filter((k) => srcOrder.includes(k));
    return [...kept, ...srcOrder.filter((k) => !kept.includes(k))];
  }, [sec.order, srcOrderKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const byId = Object.fromEntries(artboards.map((a) => [a.props.id ?? a.props.label, a]));

  // marginBottom counter-scales so the on-screen gap between sections stays
  // constant — otherwise at low zoom the (world-space) gap collapses while
  // the screen-constant sectionhead below it doesn't, and the title reads as
  // belonging to the section above. paddingBottom below is just enough for
  // the 24px artboard-header (abs-positioned above each card) plus ~8px, so
  // the title sits tight against its own row at every zoom.
  return (
    <div data-dc-section={sid}
      style={{ marginBottom: 'calc(80px * var(--dc-inv-zoom, 1))', position: 'relative' }}>
      <div style={{ padding: '0 60px' }}>
        <div className="dc-sectionhead" style={{ paddingBottom: 36 }}>
          <DCEditable tag="div" value={sec.title ?? title}
            onChange={(v) => ctx && sid && ctx.patchSection(sid, { title: v })}
            style={{ fontSize: 28, fontWeight: 600, color: DC.title, letterSpacing: -0.4, marginBottom: 6, display: 'inline-block' }} />
          {subtitle && <div style={{ fontSize: 16, color: DC.subtitle }}>{subtitle}</div>}
        </div>
      </div>
      <div style={{ display: 'flex', gap, padding: '0 60px', alignItems: 'flex-start', width: 'max-content' }}>
        {order.map((k) => (
          <DCArtboardFrame key={k} sectionId={sid} artboard={byId[k]} order={order}
            label={(sec.labels || {})[k] ?? byId[k].props.label}
            onRename={(v) => ctx && ctx.patchSection(sid, (x) => ({ labels: { ...x.labels, [k]: v } }))}
            onReorder={(next) => ctx && ctx.patchSection(sid, { order: next })}
            onDelete={() => ctx && ctx.patchSection(sid, (x) => ({
              hidden: [...(x.srcKey === srcKey ? (x.hidden || []) : []), k],
              srcKey,
            }))}
            onFocus={() => ctx && ctx.setFocus(`${sid}/${k}`)} />
        ))}
      </div>
      {rest}
    </div>
  );
}

// DCArtboard — marker; rendered by DCArtboardFrame via DCSection.
function DCArtboard() { return null; }

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({ children, top, left, right, bottom, rotate = -2, width = 180 }) {
  return (
    <div style={{
      position: 'absolute', top, left, right, bottom, width,
      background: DC.postitBg, padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14, lineHeight: 1.4, color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5,
    }}>{children}</div>
  );
}

export { DesignCanvas, DCSection, DCArtboard, DCPostIt };
