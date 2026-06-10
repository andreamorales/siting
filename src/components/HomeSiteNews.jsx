import React from 'react';
import { FLEET_SITES } from './HomeSiteBreakdown';

const SITE_NEWS = {
  'PB-07': [
    {
      tags: ['Data Centers', 'Grid'],
      headline: '800 MW hyperscale campus approved',
      source: 'Midland Reporter-Telegram',
      date: 'May 28',
    },
    {
      tags: ['Nuclear'],
      headline: 'Nuclear co-location study for AI load growth',
      source: 'Texas Tribune',
      date: 'May 19',
    },
  ],
  'CR-02': [
    {
      tags: ['Nuclear', 'Data Centers'],
      headline: 'TVA explores SMR siting near fiber corridors',
      source: 'Chattanooga Times Free Press',
      date: 'Jun 2',
    },
    {
      tags: ['Data Centers'],
      headline: 'Edge market drives co-location interest',
      source: 'The Tennessean',
      date: 'May 24',
    },
  ],
  'SV-31': [
    {
      tags: ['Data Centers', 'Nuclear'],
      headline: 'Data center surge renews nuclear fleet debate',
      source: 'Richmond Times-Dispatch',
      date: 'May 31',
    },
    {
      tags: ['Data Centers'],
      headline: 'Nuclear-backed power proposed for AI campus zoning',
      source: 'Winchester Star',
      date: 'May 15',
    },
  ],
  'CL-05': [
    {
      tags: ['Data Centers'],
      headline: 'New zoning for hyperscale and edge compute',
      source: 'Savannah Morning News',
      date: 'May 27',
    },
    {
      tags: ['Nuclear'],
      headline: 'Georgia Power SMR feasibility review underway',
      source: 'Atlanta Journal-Constitution',
      date: 'May 11',
    },
  ],
  'KM-11': [
    {
      tags: ['Nuclear', 'Grid'],
      headline: 'Nuclear options explored for data center load',
      source: 'Omaha World-Herald',
      date: 'Jun 1',
    },
    {
      tags: ['Data Centers'],
      headline: 'Fiber hub draws edge compute developers',
      source: 'Nebraska Examiner',
      date: 'May 22',
    },
  ],
  'GB-19': [
    {
      tags: ['Data Centers', 'Water'],
      headline: 'Desert hyperscale hearings focus on water rights',
      source: 'Las Vegas Review-Journal',
      date: 'May 29',
    },
    {
      tags: ['Nuclear'],
      headline: 'Advanced reactor demo sites shortlisted',
      source: 'Reno Gazette Journal',
      date: 'May 17',
    },
  ],
};

const FADE_MS = 520;

export default function HomeSiteNews({ activeIdx = 0 }) {
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
  const articles = SITE_NEWS[site.id] ?? [];

  const cardClass = [
    'home-map-news',
    visible ? 'home-map-news--visible' : 'home-map-news--hidden',
  ].join(' ');

  return (
    <div className={cardClass} aria-live="polite" aria-atomic="true">
      <header className="home-map-news-header">
        <span className="home-map-news-label st-title">Local News</span>
        <span className="home-map-news-region">{site.name}</span>
      </header>

      <div className="home-map-news-body">
        {articles.map((article) => (
          <article key={article.headline} className="home-map-news-item">
            <div className="home-map-news-rail">
              <div className="home-map-news-tags">
                {article.tags.map((tag) => (
                  <span key={tag} className="home-map-news-tag">{tag}</span>
                ))}
              </div>
              <time className="home-map-news-date" dateTime={article.date}>{article.date}</time>
            </div>
            <h3 className="home-map-news-headline">{article.headline}</h3>
            <p className="home-map-news-source">{article.source}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
