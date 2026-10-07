import React from 'react';
import Select from './Select';
import { GRADE_GROUPS, SORT_OPTIONS } from '../lib/listFilters';

/** Grade filter chips (multi-select; empty = all) + sort dropdown for the dashboard sidebar. */
export default function ListToolbar({ grades, onGradesChange, sort, onSortChange }) {
  const toggle = (g) => onGradesChange(grades.includes(g) ? grades.filter((x) => x !== g) : [...grades, g]);

  return (
    <div className="list-toolbar">
      <div className="list-toolbar-row" role="group" aria-labelledby="list-grade-label">
        <span id="list-grade-label" className="list-toolbar-label">Grade</span>
        <div className="list-chips">
          <button
            type="button"
            className={'list-chip' + (grades.length === 0 ? ' list-chip--on' : '')}
            aria-pressed={grades.length === 0}
            onClick={() => onGradesChange([])}
          >
            All
          </button>
          {GRADE_GROUPS.map((g) => (
            <button
              key={g}
              type="button"
              className={'list-chip' + (grades.includes(g) ? ' list-chip--on' : '')}
              aria-pressed={grades.includes(g)}
              aria-label={`Grade ${g}`}
              onClick={() => toggle(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <div className="list-toolbar-row">
        <span id="list-sort-label" className="list-toolbar-label">Sort</span>
        <Select
          id="list-sort"
          className="list-sort"
          value={sort}
          options={SORT_OPTIONS}
          onChange={onSortChange}
          labelledBy="list-sort-label"
        />
      </div>
    </div>
  );
}
