import React from 'react';
import { FLEET_SITES } from './HomeSiteBreakdown';

const SITE_NEWS = {
  'PB-07': [
    {
      tags: ['Data Centers', 'Grid'],
      headline: 'Permian sees surge in power, fiber needs as data centers expand',
      source: 'Midland Reporter-Telegram',
      date: 'May 14',
      dateTime: '2025-05-14',
      href: 'https://www.mrt.com/news/article/permian-ai-data-centers-power-21223990.php',
    },
    {
      tags: ['Data Centers'],
      headline: 'Collaboration secures acreage to host data center in Midland County',
      source: 'Midland Reporter-Telegram',
      date: 'Mar 6',
      dateTime: '2025-03-06',
      href: 'https://www.mrt.com/business/article/midland-data-centers-320-acres-21049718.php',
    },
  ],
  'CR-02': [
    {
      tags: ['Nuclear', 'Data Centers'],
      headline: 'TVA files first U.S. SMR construction permit application',
      source: 'Data Center Frontier',
      date: 'May 8',
      dateTime: '2025-05-08',
      href: 'https://www.datacenterfrontier.com/energy/article/55293383/tva-files-first-smr-permit-for-ge-vernova-reactor-paving-path-to-nuclear-powered-data-centers',
    },
    {
      tags: ['Nuclear'],
      headline: 'TVA to develop America’s first small modular reactor in Tennessee',
      source: 'Action News 5',
      date: 'Dec 5',
      dateTime: '2024-12-05',
      href: 'https://www.actionnews5.com/2025/12/05/tva-develop-americas-first-small-modular-reactor-tennessee/',
    },
  ],
  'SV-31': [
    {
      tags: ['Nuclear', 'Data Centers'],
      headline: 'Dominion seeking small nuclear reactor proposals',
      source: 'Virginia Mercury',
      date: 'Jul 11',
      dateTime: '2024-07-11',
      href: 'https://virginiamercury.com/2024/07/11/dominion-seeking-small-nuclear-reactor-proposals/',
    },
    {
      tags: ['Data Centers', 'Nuclear'],
      headline: 'Amazon announces deal with Dominion to develop a small modular reactor',
      source: 'Virginia Mercury',
      date: 'Oct 17',
      dateTime: '2024-10-17',
      href: 'https://virginiamercury.com/2024/10/17/amazon-announces-deal-with-dominion-energy-to-develop-a-small-nuclear-reactor/',
    },
  ],
  'CL-05': [
    {
      tags: ['Data Centers', 'Nuclear'],
      headline: 'DOE seeks clean energy projects at Savannah River Site',
      source: 'Data Center Dynamics',
      date: 'Sep 24',
      dateTime: '2024-09-24',
      href: 'https://www.datacenterdynamics.com/en/news/doe-looks-for-clean-energy-projects-at-savannah-river-south-carolina-could-include-data-centers-and-smrs/',
    },
    {
      tags: ['Data Centers'],
      headline: 'NNSA seeks proposals for AI data centers at Savannah River Site',
      source: 'U.S. Department of Energy',
      date: 'Sep 30',
      dateTime: '2025-09-30',
      href: 'https://www.energy.gov/nnsa/articles/nnsa-seeks-proposals-ai-data-centers-energy-projects-savannah-river-site-0',
    },
  ],
  'KM-11': [
    {
      tags: ['Nuclear'],
      headline: '16 locations identified to expand Nebraska nuclear footprint',
      source: 'Nebraska Examiner',
      date: 'Aug 8',
      dateTime: '2024-08-08',
      href: 'https://nebraskaexaminer.com/briefs/16-locations-identified-to-expand-nebraska-nuclear-footprint-shortlist-soon-to-be-narrowed/',
    },
    {
      tags: ['Nuclear', 'Grid'],
      headline: 'New nuclear power may come to Nebraska with promise and problems',
      source: 'Nebraska Examiner',
      date: 'Jun 1',
      dateTime: '2025-06-01',
      href: 'https://nebraskaexaminer.com/2026/06/01/new-nuclear-power-may-come-to-nebraska-with-promise-and-problems/',
    },
  ],
  'GB-19': [
    {
      tags: ['Data Centers', 'Water'],
      headline: 'Southern Nevada data centers used 716 million gallons of water in 2024',
      source: 'Las Vegas Review-Journal',
      date: 'Jul 2',
      dateTime: '2025-07-02',
      href: 'https://www.reviewjournal.com/local/local-las-vegas/southern-nevada-data-centers-used-a-ton-of-water-in-2024-heres-how-3397994/',
    },
    {
      tags: ['Nuclear', 'Data Centers'],
      headline: 'Oklo and Switch sign 12 GW nuclear power agreement',
      source: 'POWER Magazine',
      date: 'Dec 18',
      dateTime: '2024-12-18',
      href: 'https://www.powermag.com/another-big-data-center-win-for-nuclear-oklo-and-switch-sign-historic-12-gw-deal/',
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
          <article key={article.href ?? article.headline} className="home-map-news-item">
            <div className="home-map-news-rail">
              <div className="home-map-news-tags">
                {article.tags.map((tag) => (
                  <span key={tag} className="home-map-news-tag">{tag}</span>
                ))}
              </div>
              <time className="home-map-news-date" dateTime={article.dateTime}>{article.date}</time>
            </div>
            <h3 className="home-map-news-headline">
              {article.href ? (
                <a
                  className="home-map-news-headline-link"
                  href={article.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {article.headline}
                </a>
              ) : (
                article.headline
              )}
            </h3>
            <p className="home-map-news-source">{article.source}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
