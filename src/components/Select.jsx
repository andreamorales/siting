import React from 'react';
import usePresence from '../lib/usePresence';

/**
 * Product dropdown built on daisyUI `dropdown` (details/summary) + `menu`.
 * options: [{ value, label, badge? }]
 */
export default function Select({ id, value, options, onChange, labelledBy, className = '' }) {
  const rootRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const listRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const menu = usePresence(open);

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const current = options[selectedIndex];
  const listId = `${id}-listbox`;
  const valueId = `${id}-value`;

  const close = React.useCallback((refocus) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }, []);

  React.useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) close(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, close]);

  const focusOption = (index) => {
    const items = listRef.current?.querySelectorAll('[role="option"]');
    if (!items?.length) return;
    items[(index + items.length) % items.length].focus();
  };

  const openAt = (index) => {
    setOpen(true);
    requestAnimationFrame(() => focusOption(index));
  };

  const pick = (next) => {
    if (next !== value) onChange(next);
    close(true);
  };

  const handleTriggerKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      openAt(selectedIndex);
    }
  };

  const handleOptionKeyDown = (e, index) => {
    const moves = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: options.length - 1 };
    if (e.key in moves) {
      e.preventDefault();
      focusOption(moves[e.key]);
    }
  };

  // `open` on <details> follows the presence so the menu stays rendered while it animates out;
  // the summary click is handled here instead of by the native toggle.
  return (
    <details
      ref={rootRef}
      className={'dropdown prod-select' + (className ? ` ${className}` : '')}
      open={menu.present}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.preventDefault();
          close(true);
        }
      }}
      onBlur={(e) => {
        if (open && !rootRef.current?.contains(e.relatedTarget)) close(false);
      }}
    >
      <summary
        ref={triggerRef}
        id={id}
        className="input input-bordered prod-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelledBy ? `${labelledBy} ${valueId}` : valueId}
        onClick={(e) => {
          e.preventDefault();
          if (open) close(false);
          else setOpen(true);
        }}
        onKeyDown={handleTriggerKeyDown}
      >
        <span id={valueId} className="prod-select-value">{current?.label}</span>
        {current?.badge && <span className="badge badge-secondary">{current.badge}</span>}
        <i className="hn hn-chevron-down prod-select-chevron" aria-hidden="true" />
      </summary>
      {menu.present && (
        <ul
          ref={listRef}
          id={listId}
          className="dropdown-content menu prod-select-menu prod-pop"
          data-state={menu.state}
          role="listbox"
          aria-labelledby={labelledBy}
        >
          {options.map((o, i) => {
            const selected = o.value === current?.value;
            return (
              <li key={o.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={selected ? 'active' : undefined}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(o.value)}
                  onKeyDown={(e) => handleOptionKeyDown(e, i)}
                >
                  <span>{o.label}</span>
                  {o.badge && <span className="badge badge-secondary">{o.badge}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </details>
  );
}
