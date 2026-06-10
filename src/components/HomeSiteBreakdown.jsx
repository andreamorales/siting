import React from 'react';
import { factorScoreColor } from '../lib/shared.jsx';

export const FLEET_SITES = [
  {
    id: 'PB-07', name: 'Permian Basin', lat: 31.99, lng: -102.07,
    grade: 'A+', tier: 'PRIME',
    subscores: [
      { k: 'Env', long: 'Environmental Risk', v: 61 },
      { k: 'Grid', long: 'Grid Capacity', v: 96 },
      { k: 'Reg', long: 'Regulatory Context', v: 84 },
      { k: 'Labor', long: 'Workforce Capacity', v: 78 },
      { k: 'Fiber', long: 'Fiber / Latency', v: 88 },
      { k: 'Social', long: 'Community Sentiment', v: 72 },
      { k: 'Land', long: 'Land & Zoning', v: 91 },
      { k: 'Water', long: 'Water Supply', v: 54 },
    ],
  },
  {
    id: 'CR-02', name: 'Cumberland Ridge', lat: 36.16, lng: -85.5,
    grade: 'A−', tier: 'PRIME',
    subscores: [
      { k: 'Env', long: 'Environmental Risk', v: 78 },
      { k: 'Grid', long: 'Grid Capacity', v: 82 },
      { k: 'Reg', long: 'Regulatory Context', v: 89 },
      { k: 'Labor', long: 'Workforce Capacity', v: 85 },
      { k: 'Fiber', long: 'Fiber / Latency', v: 76 },
      { k: 'Social', long: 'Community Sentiment', v: 81 },
      { k: 'Land', long: 'Land & Zoning', v: 88 },
      { k: 'Water', long: 'Water Supply', v: 80 },
    ],
  },
  {
    id: 'SV-31', name: 'Shenandoah Valley', lat: 38.5, lng: -78.86,
    grade: 'B+', tier: 'STRONG',
    subscores: [
      { k: 'Env', long: 'Environmental Risk', v: 82 },
      { k: 'Grid', long: 'Grid Capacity', v: 71 },
      { k: 'Reg', long: 'Regulatory Context', v: 79 },
      { k: 'Labor', long: 'Workforce Capacity', v: 74 },
      { k: 'Fiber', long: 'Fiber / Latency', v: 91 },
      { k: 'Social', long: 'Community Sentiment', v: 68 },
      { k: 'Land', long: 'Land & Zoning', v: 77 },
      { k: 'Water', long: 'Water Supply', v: 83 },
    ],
  },
  {
    id: 'CL-05', name: 'Coastal Lowlands', lat: 31.5, lng: -82.0,
    grade: 'B', tier: 'VIABLE',
    subscores: [
      { k: 'Env', long: 'Environmental Risk', v: 58 },
      { k: 'Grid', long: 'Grid Capacity', v: 74 },
      { k: 'Reg', long: 'Regulatory Context', v: 81 },
      { k: 'Labor', long: 'Workforce Capacity', v: 69 },
      { k: 'Fiber', long: 'Fiber / Latency', v: 72 },
      { k: 'Social', long: 'Community Sentiment', v: 76 },
      { k: 'Land', long: 'Land & Zoning', v: 64 },
      { k: 'Water', long: 'Water Supply', v: 51 },
    ],
  },
  {
    id: 'KM-11', name: 'Kearney Mesa', lat: 40.7, lng: -99.08,
    grade: 'B−', tier: 'VIABLE',
    subscores: [
      { k: 'Env', long: 'Environmental Risk', v: 75 },
      { k: 'Grid', long: 'Grid Capacity', v: 62 },
      { k: 'Reg', long: 'Regulatory Context', v: 77 },
      { k: 'Labor', long: 'Workforce Capacity', v: 58 },
      { k: 'Fiber', long: 'Fiber / Latency', v: 54 },
      { k: 'Social', long: 'Community Sentiment', v: 83 },
      { k: 'Land', long: 'Land & Zoning', v: 86 },
      { k: 'Water', long: 'Water Supply', v: 79 },
    ],
  },
  {
    id: 'GB-19', name: 'Great Basin', lat: 39.5, lng: -117.0,
    grade: 'C+', tier: 'REVIEW',
    subscores: [
      { k: 'Env', long: 'Environmental Risk', v: 63 },
      { k: 'Grid', long: 'Grid Capacity', v: 48 },
      { k: 'Reg', long: 'Regulatory Context', v: 71 },
      { k: 'Labor', long: 'Workforce Capacity', v: 44 },
      { k: 'Fiber', long: 'Fiber / Latency', v: 39 },
      { k: 'Social', long: 'Community Sentiment', v: 66 },
      { k: 'Land', long: 'Land & Zoning', v: 82 },
      { k: 'Water', long: 'Water Supply', v: 37 },
    ],
  },
];

const FADE_MS = 520;

export default function HomeSiteBreakdown({ activeIdx = 0 }) {
  const [shownIdx, setShownIdx] = React.useState(activeIdx);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (activeIdx === shownIdx) return undefined;

    setVisible(false);
    const timer = setTimeout(() => {
      setShownIdx(activeIdx);
      requestAnimationFrame(() => setVisible(true));
    }, FADE_MS);

    return () => clearTimeout(timer);
  }, [activeIdx, shownIdx]);

  const site = FLEET_SITES[shownIdx];
  const cardClass = [
    'home-site-card',
    visible ? 'home-site-card--visible' : 'home-site-card--hidden',
  ].join(' ');

  return (
    <div className={cardClass}>
      <div className="home-site-card-header">
        <span className="home-site-card-grade">{site.grade}</span>
        <span className="home-site-card-id">{site.id}</span>
        <span className="home-site-card-tier">{site.tier}</span>
      </div>

      <div className="home-site-card-body">
        {site.subscores.map((factor) => (
          <div key={factor.k} className="home-site-factor" title={factor.long}>
            <span className="home-site-factor-k">{factor.k}</span>
            <div className="home-site-factor-track">
              <div
                className="home-site-factor-fill"
                style={{
                  width: `${factor.v}%`,
                  background: factorScoreColor(factor.v),
                }}
              />
            </div>
            <span className="home-site-factor-v">{factor.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
