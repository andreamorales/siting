import React from 'react';
import { matchPath, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { listCases } from '../lib/cases';
import { matchesQuery, placeLabel, writeListParams } from '../lib/listFilters';
import usePresence from '../lib/usePresence';

const MAX_SUGGESTIONS = 5;

function isEditable(el) {
  return el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}

/**
 * On the dashboard the query lives in `?q=` and filters the list live.
 * Elsewhere it is local; Enter goes to `/app?q=…` and matching cases are offered as shortcuts.
 */
export default function HeaderSearch() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const onDashboard = Boolean(matchPath('/app', pathname));
  const inputRef = React.useRef(null);
  const [localQuery, setLocalQuery] = React.useState('');
  const [focused, setFocused] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const query = onDashboard ? searchParams.get('q') ?? '' : localQuery;
  const trimmed = query.trim();

  const setQuery = (next) => {
    setActiveIndex(-1);
    if (onDashboard) setSearchParams((prev) => writeListParams(prev, { q: next }), { replace: true });
    else setLocalQuery(next);
  };

  const suggestions = React.useMemo(() => {
    if (onDashboard || !trimmed) return [];
    const cases = listCases()
      .map((r) => ({ ...r, location: placeLabel(r.place) || r.place?.name }))
      .filter((r) => matchesQuery(r, trimmed))
      .slice(0, MAX_SUGGESTIONS)
      .map((r) => ({ id: r.id, label: r.name, meta: r.location, to: `/app/site/${r.id}` }));
    return [...cases, { id: 'all', label: `Search all for “${trimmed}”`, to: `/app?q=${encodeURIComponent(trimmed)}` }];
  }, [onDashboard, trimmed]);

  const open = focused && suggestions.length > 0;
  const menu = usePresence(open ? suggestions : null);
  const listId = 'header-search-suggestions';

  React.useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey || isEditable(e.target)) return;
      e.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const go = (to) => {
    setFocused(false);
    inputRef.current?.blur();
    setLocalQuery('');
    navigate(to);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (query) setQuery('');
      else inputRef.current?.blur();
      return;
    }
    if (open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      const span = suggestions.length + 1;
      setActiveIndex((i) => ((i + 1 + step + span) % span) - 1);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (open && activeIndex >= 0 && activeIndex < suggestions.length) go(suggestions[activeIndex].to);
      else if (!onDashboard && trimmed) go(`/app?q=${encodeURIComponent(trimmed)}`);
      else inputRef.current?.blur();
    }
  };

  return (
    <div className={'dropdown header-search' + (menu.present ? ' dropdown-open' : '')}>
      <label className="input input-bordered header-search-field">
        <i className="hn hn-search header-search-icon" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          className="header-search-input"
          placeholder="Search sites…"
          aria-label="Search sites by name or location"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setActiveIndex(-1);
          }}
        />
        {query ? (
          <button
            type="button"
            className="header-search-clear"
            aria-label="Clear search"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
          >
            <i className="hn hn-times" aria-hidden="true" />
          </button>
        ) : (
          <span className="header-search-kbd" aria-hidden="true">/</span>
        )}
      </label>
      {menu.present && (
        <ul
          id={listId}
          className="dropdown-content menu header-search-menu prod-pop"
          data-state={menu.state}
          role="listbox"
          aria-label="Matching sites"
        >
          {menu.value.map((s, i) => (
            <li key={s.id} role="presentation">
              <button
                type="button"
                id={`${listId}-${i}`}
                role="option"
                tabIndex={-1}
                aria-selected={i === activeIndex}
                className={'header-search-option' + (i === activeIndex ? ' focus' : '') + (s.id === 'all' ? ' header-search-option--all' : '')}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => go(s.to)}
              >
                <span className="header-search-option-label">{s.label}</span>
                {s.meta && <span className="header-search-option-meta">{s.meta}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
