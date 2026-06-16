import React from 'react';

const stackPart = (i, children) => (
  <g className="home-logo-part home-logo-part--stack" style={{ '--logo-i': i }}>
    {children}
  </g>
);

export default function HomeSquareLogo({ className = '' }) {
  return (
    <svg
      className={`home-square-logo ${className}`.trim()}
      viewBox="0 0 700 700"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="MeterZero"
    >
      {stackPart(
        0,
        <>
          <polygon points="497.2 305.8 460.4 305.8 460.4 339.9 421 381.3 280 381.3 239.6 321.4 239.6 305.8 202.8 305.8 202.8 699.3 239.6 699.3 239.6 536.5 280 495.1 421 495.1 460.4 554.5 460.4 699.3 497.2 699.3 497.2 305.8" />
          <polygon points="420 579 420 560 400.5 531 295 531 279.5 547.5 279.5 699.3 303.8 699.3 420 579" />
          <polygon points="420 630.5 353.7 699.3 420 699.3 420 630.5" />
          <polygon points="279.5 312.9 279.5 316.4 299 345.4 405 345.4 420 328.9 420 305.8 286.4 305.8 279.5 312.9" />
          <polyline points="486.9 305.8 699.5 305.8 699.5 699.3 486.9 699.3" />
          <polyline points="-1.2 305.8 211.4 305.8 211.4 699.3 -1.2 699.3" />
        </>,
      )}
      {stackPart(1, <polyline points=".2 186.8 701.6 186.8 701.6 293.1 .2 293.1" />)}
      {stackPart(2, <polyline points=".2 107.5 701.6 107.5 701.6 176.8 .2 176.8" />)}
      {stackPart(3, <polyline points=".2 53.6 701.6 53.6 701.6 99 .2 99" />)}
      {stackPart(4, <polyline points=".2 13.8 701.6 13.8 701.6 45.7 .2 45.7" />)}
      {stackPart(5, <polyline points=".2 .3 701.6 .3 701.6 6.9 .2 6.9" />)}
    </svg>
  );
}
