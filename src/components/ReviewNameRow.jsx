import React from 'react';

export default function ReviewNameRow({ value, onChange, onRegenerate }) {
  return (
    <div className="review-row review-row--control">
      <dt className="review-k">
        <label htmlFor="review-name">Name</label>
      </dt>
      <dd className="review-control review-name">
        <input
          id="review-name"
          className="review-name-input"
          value={value}
          maxLength={80}
          placeholder="Site name"
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-ghost btn-square"
          onClick={onRegenerate}
          aria-label="Generate a new random name"
          title="New random name"
        >
          <i className="hn hn-shuffle" aria-hidden="true" />
        </button>
      </dd>
    </div>
  );
}
