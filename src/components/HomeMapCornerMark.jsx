import React from 'react';

export default function HomeMapCornerMark() {
  return (
    <div className="home-map-corner-mark" aria-hidden="true">
      <svg className="home-map-corner-mark__svg" viewBox="-11 -11 22 22">
        <path
          d="M 0 -11 A 11 11 0 1 1 -11 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
