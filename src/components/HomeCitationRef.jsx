import React from 'react';

export default function HomeCitationRef({ n, href, children }) {
  const label = `Citation ${n}`;
  const content = (
    <>
      {n}
      <span className="home-citation-tip" role="tooltip">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="home-citation-ref"
        aria-label={label}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className="home-citation-ref" aria-label={label}>
      {content}
    </button>
  );
}
