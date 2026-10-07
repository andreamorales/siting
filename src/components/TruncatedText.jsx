import React from 'react';
import { createPortal } from 'react-dom';
import usePresence from '../lib/usePresence';

export default function TruncatedText({ children, className = '', tooltip, ...rest }) {
  const ref = React.useRef(null);
  const [tip, setTip] = React.useState(null);
  const shown = usePresence(tip);
  const label = tooltip ?? (typeof children === 'string' || typeof children === 'number' ? String(children) : null);

  const show = () => {
    const el = ref.current;
    if (!el || !label || el.scrollWidth <= el.clientWidth) return;
    const r = el.getBoundingClientRect();
    // Portal into the token scope (.st-board) so the tip's var(--s-*/--t-*) resolve.
    setTip({ x: r.left + r.width / 2, y: r.top, host: el.closest('.st-board') ?? document.body });
  };

  const hide = () => setTip(null);

  return (
    <>
      <span
        ref={ref}
        className={'truncated-text' + (className ? ` ${className}` : '')}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        {...rest}
      >
        {children}
      </span>
      {shown.present && createPortal(
        <span
          className="truncated-text-tip prod-fade"
          data-state={shown.state}
          role="tooltip"
          style={{ left: shown.value.x, top: shown.value.y }}
        >
          {label}
        </span>,
        shown.value.host,
      )}
    </>
  );
}
