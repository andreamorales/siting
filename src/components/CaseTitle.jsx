import React from 'react';

const MIN_INPUT_CH = 8;

export default function CaseTitle({ name, onRename, onRegenerate, children }) {
  const [draft, setDraft] = React.useState(null);
  const inputRef = React.useRef(null);
  const editing = draft !== null;

  React.useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const start = () => setDraft(name);
  const cancel = () => setDraft(null);
  const commit = () => {
    if (draft === null) return;
    if (draft.trim()) onRename(draft);
    setDraft(null);
  };

  return (
    <div className="case-title-row">
      {editing ? (
        <input
          ref={inputRef}
          className="case-title case-title-input"
          aria-label="Site name"
          value={draft}
          size={Math.max(draft.length + 1, MIN_INPUT_CH)}
          maxLength={80}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              cancel();
            }
          }}
        />
      ) : (
        <h1 className="case-title case-title--editable" onClick={start} title="Click to rename">
          {name}
        </h1>
      )}
      <div className="case-actions">
        <button
          type="button"
          className="btn btn-ghost btn-square"
          onMouseDown={(e) => e.preventDefault()}
          onClick={editing ? commit : start}
          aria-label={editing ? 'Save site name' : 'Rename site'}
          title={editing ? 'Save name' : 'Rename'}
        >
          <i className={'hn ' + (editing ? 'hn-check' : 'hn-pen')} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-square"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setDraft(null);
            onRegenerate();
          }}
          aria-label="Generate a new random name"
          title="New random name"
        >
          <i className="hn hn-shuffle" aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
}
