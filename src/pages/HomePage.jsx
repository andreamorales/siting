import React from 'react';
import HomeLogo from '../components/HomeLogo';
import HomeMapOrb from '../components/HomeMapOrb';
import HomeSiteBreakdown, { FLEET_SITES } from '../components/HomeSiteBreakdown';
import HomeTabs from '../components/HomeTabs';

const TABS = [
  { id: 'background', label: 'Background' },
  { id: 'team', label: 'Team' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'contact', label: 'Contact' },
];

const CYCLE_MS = 4000;

export default function HomePage() {
  const [activeTab, setActiveTab] = React.useState(TABS[0].id);
  const [activeIdx, setActiveIdx] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % FLEET_SITES.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="home-page st-board">
      <div className="home-reticule-bg" aria-hidden="true">
        <div className="home-reticule-bg__grid" />
        <div className="home-reticule-bg__hatch" />
      </div>
      <div className="home-beta-banner">
        <p className="home-beta-banner-text">MeterZero has officially started development. Reach out to get on the waitlist.</p>
      </div>
      <div className="home-shell">
        <div className="home-hero">
          <div className="home-hero-toolbar">
            <div className="home-hero-mark">
              <button type="button" className="home-logo-btn" aria-label="MeterZero">
                <HomeLogo />
              </button>
            </div>
            <HomeTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className="home-hero-headline">
            <h1 className="home-tagline">
              <span className="home-tagline-line">Nuclear Datacenter</span>
              <span className="home-tagline-line">Co-Siting Tool</span>
            </h1>
          </div>
        </div>
        <HomeMapOrb activeIdx={activeIdx} />
        <HomeSiteBreakdown activeIdx={activeIdx} />
        <div className="home-affil">
          <span className="home-affil-label st-title">FEATURING RESEARCHERS FROM</span>
          <div className="home-affil-logos">
            <img className="home-affil-logo" src="/logo/University_of_Michigan_logo.svg" alt="University of Michigan" />
            <img className="home-affil-logo home-affil-logo--mit" src="/logo/MIT_logo.svg" alt="MIT" />
            <img className="home-affil-logo" src="/logo/pittsburgh_technical.avif" alt="Pittsburgh Technical" />
          </div>
        </div>
      </div>
    </div>
  );
}
