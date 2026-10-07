import React from 'react';

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
};

// One-time CSS injection (classes are dc-prefixed so they don't collide with
// the hosted design's own styles).
if (typeof document !== 'undefined' && !document.getElementById('dc-styles')) {
  const s = document.createElement('style');
  s.id = 'dc-styles';
  s.textContent = [
    '.dc-editable{cursor:text;outline:none;white-space:nowrap;border-radius:3px;padding:0 2px;margin:0 -2px}',
    '.dc-editable:focus{background:#fff;box-shadow:0 0 0 1.5px #c96442}',
    '[data-dc-slot]{transition:transform .18s cubic-bezier(.2,.7,.3,1)}',
    '[data-dc-slot].dc-dragging{transition:none;z-index:10;pointer-events:none}',
    '[data-dc-slot].dc-dragging .dc-card{box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 2px #c96442;transform:scale(1.02)}',
    // isolation:isolate contains artboard content's z-indexes so a
    // z-indexed child (sticky navbar etc.) can't paint over .dc-header or
    // the .dc-menu popover that drops into the top of the card.
    '.dc-card{isolation:isolate;transition:box-shadow .15s,transform .15s}',
    '.dc-card *{scrollbar-width:none}',
    '.dc-card *::-webkit-scrollbar{display:none}',
    // Per-artboard header: grip + label on the left, delete/expand on the
    // right. Single flex row; when the artboard's on-screen width is too
    // narrow for both the label yields (ellipsis, then hidden entirely below
    // ~4ch via the container query) and the buttons stay on the row.
    '.dc-header{position:absolute;bottom:100%;left:-4px;margin-bottom:calc(4px * var(--dc-inv-zoom,1));z-index:2;',
    '  display:flex;align-items:center;container-type:inline-size}',
    '.dc-labelrow{display:flex;align-items:center;gap:4px;height:24px;flex:1 1 auto;min-width:0}',
    '.dc-grip{flex:0 0 auto;cursor:grab;display:flex;align-items:center;padding:5px 4px;border-radius:4px;transition:background .12s,opacity .12s}',
    '.dc-grip:hover{background:rgba(0,0,0,.08)}',
    '.dc-grip:active{cursor:grabbing}',
    '.dc-labeltext{flex:1 1 auto;min-width:0;cursor:pointer;border-radius:4px;padding:3px 6px;',
    '  display:flex;align-items:center;transition:background .12s;overflow:hidden}',
    // Below ~4ch of label room: hide the label entirely, and drop the grip to
    // hover-only (same reveal rule as .dc-btns) so a narrow header is clean
    // until the card is moused.
    '@container (max-width: 110px){',
    '  .dc-labeltext{display:none}',
    '  .dc-grip{opacity:0}',
    '  [data-dc-slot]:hover .dc-grip{opacity:1}',
    '}',
    '.dc-labeltext:hover{background:rgba(0,0,0,.05)}',
    '.dc-labeltext .dc-editable{overflow:hidden;text-overflow:ellipsis;max-width:100%}',
    '.dc-labeltext .dc-editable:focus{overflow:visible;text-overflow:clip}',
    '.dc-btns{flex:0 0 auto;margin-left:auto;display:flex;gap:2px;opacity:0;transition:opacity .12s}',
    '[data-dc-slot]:hover .dc-btns,.dc-btns:has(.dc-menu){opacity:1}',
    '.dc-expand,.dc-kebab{width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;padding:0;',
    '  background:transparent;color:rgba(60,50,40,.7);display:flex;align-items:center;justify-content:center;',
    '  font:inherit;transition:background .12s,color .12s}',
    '.dc-expand:hover,.dc-kebab:hover{background:rgba(0,0,0,.06);color:#2a251f}',
    // Slot hosting an open menu floats above later siblings (which otherwise
    // paint on top — same z-index:auto, later DOM order) so the popup isn't
    // clipped by the next card.
    '[data-dc-slot]:has(.dc-menu){z-index:10}',
    '.dc-menu{position:absolute;top:100%;right:0;margin-top:4px;background:#fff;border-radius:8px;',
    '  box-shadow:0 8px 28px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.05);padding:4px;min-width:160px;z-index:10}',
    '.dc-menu button{display:block;width:100%;padding:7px 10px;border:0;background:transparent;',
    '  border-radius:5px;font-family:inherit;font-size:13px;font-weight:500;line-height:1.2;',
    '  color:#29261b;cursor:pointer;text-align:left;transition:background .12s;white-space:nowrap}',
    '.dc-menu button:hover{background:rgba(0,0,0,.05)}',
    '.dc-menu hr{border:0;border-top:1px solid rgba(0,0,0,.08);margin:4px 2px}',
    '.dc-menu .dc-danger{color:#c96442}',
    '.dc-menu .dc-danger:hover{background:rgba(201,100,66,.1)}',
    // Chrome (titles / labels / buttons) counter-scales against the viewport
    // zoom so it stays a constant on-screen size. --dc-inv-zoom is set by
    // DCViewport on every transform update and inherits to all descendants —
    // any overlay inside the world (e.g. a TweaksPanel on an artboard) can use
    // it the same way.
    //
    // The header uses transform:scale (out-of-flow, so layout impact doesn't
    // matter) with its world-space width set to card-width / inv-zoom so that
    // after counter-scaling its on-screen width exactly matches the card's —
    // that's what lets the container query + text-overflow behave against the
    // card's visible edge at every zoom level.
    //
    // The section head uses CSS zoom instead of transform so its layout box
    // grows with the counter-scale, pushing the card row down — otherwise the
    // constant-screen-size title would overflow into the (shrinking) world-
    // space gap and overlap the artboard headers at low zoom.
    '.dc-header{width:calc((100% + 4px) / var(--dc-inv-zoom,1));',
    '  transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom left}',
    '.dc-sectionhead{zoom:var(--dc-inv-zoom,1)}',
  ].join('\n');
  document.head.appendChild(s);
}

const DCCtx = React.createContext(null);

// Recursively unwrap React.Fragment so <>…</> grouping doesn't hide
// DCSection/DCArtboard children from the type-based walks below.
function dcFlatten(children) {
  const out = [];
  React.Children.forEach(children, (c) => {
    if (c && c.type === React.Fragment) out.push(...dcFlatten(c.props.children));
    else out.push(c);
  });
  return out;
}

export { DC, DCCtx, dcFlatten };
