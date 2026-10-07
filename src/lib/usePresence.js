import React from 'react';

/** Keep in sync with --dur-exit in src/styles/tokens.css. */
export const EXIT_MS = 140;

/**
 * Keeps an element mounted for its exit animation.
 * `value` is truthy while shown; pass a stable value (primitive, state, or memoized object) —
 * the last truthy one is held during the exit so content doesn't blank out mid-fade.
 * Render while `present`, and put `data-state={state}` on the animated node.
 */
export default function usePresence(value, exitMs = EXIT_MS) {
  const open = Boolean(value);
  const [held, setHeld] = React.useState(open ? value : null);
  if (open && !Object.is(held, value)) setHeld(value);

  React.useEffect(() => {
    if (open) return undefined;
    const timer = setTimeout(() => setHeld(null), exitMs);
    return () => clearTimeout(timer);
  }, [open, exitMs]);

  return {
    present: open || held !== null,
    state: open ? 'open' : 'closed',
    value: open ? value : held,
  };
}

/** Render-prop wrapper: `<Presence when={x}>{(state, value) => <Menu data-state={state} />}</Presence>`. */
export function Presence({ when, exitMs, children }) {
  const { present, state, value } = usePresence(when, exitMs);
  return present ? children(state, value) : null;
}
