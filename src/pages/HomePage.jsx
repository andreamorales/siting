import React from 'react';
import HomeLogo from '../components/HomeLogo';
import HomeMapOrb from '../components/HomeMapOrb';
import HomeMapCornerMark from '../components/HomeMapCornerMark';
import HomeSiteBreakdown, { FLEET_SITES } from '../components/HomeSiteBreakdown';
import HomeSiteNews from '../components/HomeSiteNews';
import HomeBackgroundHeadline from '../components/HomeBackgroundHeadline';
import HomeCitationRef from '../components/HomeCitationRef';
import HomeTeamSection from '../components/HomeTeamSection';
import HomeRoadmapSection from '../components/HomeRoadmapSection';
import HomeContactPulses from '../components/HomeContactPulses';
import HomeTabs from '../components/HomeTabs';

const TABS = [
  { id: 'background', label: 'Background' },
  { id: 'team', label: 'Team' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'contact', label: 'Contact' },
];

const CYCLE_MS = 3000;
const WAITLIST_URL = '#';

const CONTACT_THEME = {
  bg: '#1C1B1B',
  fg: '#FDFDFC',
  line: '#3A3938',
  card: '#2A2928',
};

export default function HomePage() {
  const [activeTab, setActiveTab] = React.useState(null);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [toolbarTheme, setToolbarTheme] = React.useState(null);
  const sectionRefs = React.useRef({});
  const shellRef = React.useRef(null);
  const toolbarRef = React.useRef(null);
  const heroRef = React.useRef(null);
  const isScrolling = React.useRef(false);
  const cycleRef = React.useRef(null);

  const stopCycle = React.useCallback(() => {
    if (cycleRef.current) {
      clearInterval(cycleRef.current);
      cycleRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    cycleRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % FLEET_SITES.length);
    }, CYCLE_MS);
    return () => {
      if (cycleRef.current) clearInterval(cycleRef.current);
    };
  }, []);

  const handleSiteHover = React.useCallback((idx) => {
    stopCycle();
    setActiveIdx(idx);
  }, [stopCycle]);

  const handleSiteSelect = React.useCallback((idx) => {
    stopCycle();
    setActiveIdx(idx);
  }, [stopCycle]);

  React.useEffect(() => {
    const root = shellRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrolling.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            setActiveTab(entry.target.id);
          }
        }
      },
      { root, threshold: 0.35 },
    );
    for (const el of Object.values(sectionRefs.current)) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const root = shellRef.current;
    if (!root) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle(
            'home-section--in-view',
            entry.isIntersecting && entry.intersectionRatio >= 0.12,
          );
        }
      },
      { root, threshold: [0, 0.12, 0.25, 0.4] },
    );

    for (const el of Object.values(sectionRefs.current)) {
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const root = shellRef.current;
    const toolbar = toolbarRef.current;
    if (!root || !toolbar) return;
    const update = () => {
      const tRect = toolbar.getBoundingClientRect();
      const tMid = tRect.top + tRect.height / 2;
      let hit = null;
      for (const [id, el] of Object.entries(sectionRefs.current)) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= tMid && r.bottom >= tMid) { hit = id; break; }
      }
      setToolbarTheme(hit === 'contact' ? CONTACT_THEME : null);
    };
    root.addEventListener('scroll', update, { passive: true });
    update();
    return () => root.removeEventListener('scroll', update);
  }, []);

  const scrollToSection = React.useCallback((tabId) => {
    setActiveTab(tabId);
    isScrolling.current = true;
    sectionRefs.current[tabId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { isScrolling.current = false; }, 800);
  }, []);

  return (
    <div className="home-page st-board">
      <div className="home-shell" ref={shellRef}>
        <a
          href={WAITLIST_URL}
          className="home-beta-banner"
          onClick={WAITLIST_URL === '#' ? (e) => e.preventDefault() : undefined}
        >
          <span className="home-beta-banner-text">
            MeterZero has officially started development. Reach out to get on the waitlist.
          </span>
          <i className="hn hn-arrow-right home-beta-banner-icon" aria-hidden="true" />
        </a>
        <div
          className="home-hero-toolbar"
          ref={toolbarRef}
          style={toolbarTheme ? {
            '--tb-bg': toolbarTheme.card,
            '--tb-fg': toolbarTheme.fg,
            '--tb-line': toolbarTheme.line,
            '--tb-card': toolbarTheme.bg,
          } : undefined}
        >
          <div className="home-hero-toolbar-start">
            <div className="home-hero-mark">
              <button type="button" className="home-logo-btn" aria-label="MeterZero">
                <HomeLogo />
              </button>
            </div>
            <HomeTabs tabs={TABS} activeTab={activeTab} onTabChange={scrollToSection} />
          </div>
          <div className="home-hero-toolbar-end">
            <button type="button" className="home-signin-btn">
              Sign in
              <i className="hn hn-login home-signin-btn-icon" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="home-panel home-panel--hero" ref={heroRef}>
          <div className="home-hero-body">
            <div className="home-hero-copy">
              <h1 className="home-tagline">
                <span className="home-tagline-line">Nuclear Data Center</span>
                <span className="home-tagline-line">Co-Siting Tool</span>
              </h1>
            </div>

            <div className="home-map-cluster">
              <div className="home-map-stage">
                <div className="home-map-frame">
                  <HomeMapOrb
                    activeIdx={activeIdx}
                    onSiteHover={handleSiteHover}
                    onSiteSelect={handleSiteSelect}
                  />
                  <HomeMapCornerMark />
                </div>
              </div>
              <HomeSiteNews activeIdx={activeIdx} />
              <HomeSiteBreakdown activeIdx={activeIdx} />
            </div>
          </div>

          <div className="home-affil">
            <span className="home-affil-label st-title">MADE BY RESEARCHERS FROM</span>
            <div className="home-affil-logos">
              <img className="home-affil-logo" src="/logo/University_of_Michigan_logo.svg" alt="University of Michigan" />
              <img className="home-affil-logo home-affil-logo--mit" src="/logo/MIT_logo.svg" alt="MIT" />
              <img className="home-affil-logo" src="/logo/pittsburgh_technical.avif" alt="Pittsburgh Technical" />
            </div>
          </div>
        </div>

        {/* Content sections */}
        {TABS.map((tab) => (
          <section
            key={tab.id}
            id={tab.id}
            ref={(node) => { sectionRefs.current[tab.id] = node; }}
            className={`home-section home-section--${tab.id}`}
          >
            {tab.id === 'background' && (
              <>
                <div className="home-section-float-card home-section-float-card--left">
                  <img src="/images/datacenter.png" alt="" />
                </div>
                <div className="home-section-float-card home-section-float-card--right">
                  <img src="/images/coolingtower.png" alt="" />
                </div>
              </>
            )}
            {tab.id === 'contact' && (
              <>
                <div className="home-section-reticule" aria-hidden="true">
                  <div className="home-section-reticule__grid" />
                  <div className="home-section-reticule__hatch" />
                </div>
                <HomeContactPulses />
              </>
            )}
            <div className="home-section-inner">
              {tab.id === 'background' ? (
                <>
                  <p className="home-section-eyebrow st-title">Background</p>
                  <HomeBackgroundHeadline />
                  <p className="home-section-text">
                    Since 2017, the United States has seen a surge in data center demand due to
                    increasing interest in cryptocurrency and the use of AI
                    <HomeCitationRef n={1} href="https://doi.org/10.71468/P1WC7Q">
                      Arman Shehabi, Alex Hubbard, Alex Newkirk, Nuoa Lei, Md Abu Bakkar Siddik,
                      Billie Holecek, Jonathan Koomey, Eric Masanet, and Dale Sartor. 2024 United
                      States data center energy usage report. Lawrence Berkeley National Laboratory;
                      2025. doi:10.71468/P1WC7Q
                    </HomeCitationRef>
                    . Data center energy use is expected to continue increasing, potentially doubling
                    to account for over 9% of US electricity use by 2030 (between 325 and 580 TWh)
                    <HomeCitationRef n={2}>
                      Aljbour J, Wilson T, Patel P. Powering intelligence: Analyzing artificial
                      intelligence and data center energy consumption. EPRI White Paper no 3002028905.
                      2024.
                    </HomeCitationRef>
                    .
                  </p>
                  <p className="home-section-text">
                    Recent announcements by technology companies such as Amazon, Microsoft, and Google
                    make clear their interests in nuclear-powered data centers, largely to serve
                    growing AI data center energy demand
                    <HomeCitationRef
                      n={3}
                      href="https://www.datacenterdynamics.com/en/news/aws-acquires-talens-nuclear-data-center-campus-in-pennsylvania/"
                    >
                      AWS acquires Talen’s nuclear data center campus in Pennsylvania. 4 Mar 2024
                      [cited 25 Mar 2025]. Available: https://www.datacenterdynamics.com/en/news/aws-acquires-talens-nuclear-data-center-campus-in-pennsylvania/
                    </HomeCitationRef>
                    <HomeCitationRef
                      n={4}
                      href="https://www.orrick.com/en/News/2024/10/Carbon-Free-Energy-Microsoft-Signs-20-Year-PPA-with-Constellation"
                    >
                      Carbon-Free Energy: Microsoft Signs 20-Year PPA with Constellation to Launch
                      the Crane Clean Energy Center and Restart Three Mile Island Unit 1. [cited 25 Mar
                      2025]. Available: https://www.orrick.com/en/News/2024/10/Carbon-Free-Energy-Microsoft-Signs-20-Year-PPA-with-Constellation
                    </HomeCitationRef>
                    <HomeCitationRef n={5} href="https://doi.org/10.1063/pt.3.5020">
                      Pell H, Hearty R, Allard D. Why did the Three Mile Island Unit 1 reactor close?
                      Phys Today. 2022;75: 46–52. doi:10.1063/pt.3.5020
                    </HomeCitationRef>
                    .
                  </p>
                  <p className="home-section-text">
                    Our work aims to understand possible data center–nuclear power plant co-location
                    from multiple socio-technical dimensions, including interactions between data
                    center, nuclear plant, and electric power infrastructure development.
                  </p>
                </>
              ) : tab.id === 'team' ? (
                <HomeTeamSection />
              ) : tab.id === 'roadmap' ? (
                <HomeRoadmapSection />
              ) : tab.id === 'contact' ? (
                <div className="home-section-contact">
                  <img className="home-section-contact-logo" src="/logo/meterzero_horizontal.svg" alt="MeterZero" />
                  <form className="home-section-contact-form" onSubmit={(e) => { e.preventDefault(); }}>
                    <label className="home-section-contact-label" htmlFor="contact-email">Email</label>
                    <input id="contact-email" className="home-section-contact-input" type="email" name="email" autoComplete="email" placeholder="you@company.com" required />
                    <button type="submit" className="home-section-contact-submit">
                      Join the waitlist <i className="hn hn-arrow-right home-section-contact-icon" aria-hidden="true" />
                    </button>
                  </form>
                </div>
              ) : (
                <h2 className="home-section-title st-title">{tab.label}</h2>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
