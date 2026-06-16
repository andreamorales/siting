import React from 'react';
import HomeLabel from './HomeLabel';

const CYCLE_MS = 4500;
const MOBILE_MQ = '(max-width: 960px)';

const TEAM_MEMBERS = [
  {
    name: 'Aditi Verma',
    institution: 'UMich',
    photo: '/headshots/aditi_verma.jpg',
    bio: 'Aditi Verma is an assistant professor of Nuclear Engineering and Radiological Sciences at the University of Michigan (UM), where she directs the Critical Masses research group. Her research and teaching focus on the participatory design and siting of nuclear energy infrastructure. Her research team builds tools for gathering public perspectives on, as well as visualizing and prototyping energy infrastructure.',
  },
  {
    name: 'Marija Ilic',
    institution: 'MIT',
    photo: '/headshots/marija_ilic.jpeg',
    bio: 'Marija Ilic is a Senior Research Scientist at the MIT Laboratory for Information and Decision Systems and Adjunct Professor in Electrical Engineering and Computer Science at MIT, where she leads the Electric Energy Systems Group. She has over 30 years of teaching and research experience in power systems modeling and control, and power systems operations, planning, and economics.',
  },
  {
    name: 'Ash Bharatkumar',
    institution: 'MIT',
    photo: '/headshots/ash_bharatkumar.jpg',
    bio: 'Ash Bharatkumar is an Electrical Engineering and Computer Science PhD student at MIT (Fall 2025 matriculation). Previously, she obtained a JD from Harvard Law School, practiced federal and state energy and telecom law in D.C., and was an electricity market design analyst at ISO New England.',
  },
  {
    name: 'Tanmay Deshmukh',
    institution: 'UMich',
    photo: '/headshots/tanmay_deshmukh.jpeg',
    bio: 'Tanmay Deshmukh is a master’s student, planning to pursue a PhD, in the Department of Nuclear Engineering and Radiological Sciences at UM. His ongoing work using geospatial analysis to assess co-location potential of data center sites has supported the development of this proposal.',
  },
  {
    name: 'Justice Esiri',
    institution: 'UMich',
    photo: '/headshots/justice_esiri.png',
    photoPosition: 'center top',
    bio: 'Justice Esiri is a master’s student in the Department of Nuclear Engineering and Radiological Sciences at the University of Michigan. He is an intern at Pittsburgh Technical, where he conducts research on the safety and siting analysis of advanced nuclear reactors co-located with data centers.',
  },
  {
    name: 'Sola Talabi',
    institution: 'Pittsburgh Technical',
    photo: '/headshots/sola_talabi.avif',
    bio: 'Sola Talabi is the President of Pittsburgh Technical, a nuclear engineering consulting practice focused on advanced reactor safety analysis. Dr. Talabi is also adjunct faculty at UM and the University of Pittsburgh.',
  },
  {
    name: 'Katie Snyder',
    institution: 'UMich',
    photo: '/headshots/katie_snyder.jpeg',
    bio: 'Katie Snyder is a lecturer in the Program in Technical Communication at UM. She has been teaching communication, ethics, and design to engineering students for 18 years. She holds a Ph.D. in Rhetoric, Theory and Culture from Michigan Technical University.',
  },
  {
    name: 'Andrea Morales Coto',
    institution: 'UMich',
    photo: '/headshots/andrea_morales.jpeg',
    bio: 'Andrea Morales Coto is a Parsons trained transdisciplinary designer and UX/UI developer at UM, with over a decade of industry experience at companies like MongoDB and Roblox. She leads the design of the web-based siting assessment tool.',
  },
  {
    name: 'Gabrielle Hoelzle',
    institution: 'UMich',
    photo: '/headshots/gabrielle_hoezle.jpeg',
    bio: 'Gabrielle Hoelzle is a senior program manager at UM’s Fastest Path to Zero initiative. She is the lead developer of several open-source GIS-based decision support tools, including, notably, STAND.',
  },
  {
    name: 'Kevin Daley',
    institution: 'UMich',
    photo: '/headshots/kevin_daley.jpg',
    bio: 'Kevin Daley is a Data Scientist at UM’s Fastest Path to Zero Initiative. He oversees web application development, cloud maintenance, and data processing and analysis. Previously, Kevin provided GIS support for civil engineering, utilities, municipal government, and natural resource management.',
  },
];

function bioBody(name, bio) {
  return bio.startsWith(name) ? bio.slice(name.length).trimStart() : bio;
}

export default function HomeTeamSection() {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [inView, setInView] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_MQ).matches,
  );
  const [indicator, setIndicator] = React.useState({ top: 0, height: 0, ready: false });
  const idxRef = React.useRef(0);
  const userPickedRef = React.useRef(false);
  const navRef = React.useRef(null);
  const tabRefs = React.useRef([]);

  const active = TEAM_MEMBERS[activeIdx];
  const body = bioBody(active.name, active.bio);

  const placeIndicator = React.useCallback((idx) => {
    const nav = navRef.current;
    const tab = tabRefs.current[idx];
    if (!nav || !tab) return;

    const navRect = nav.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();

    setIndicator({
      top: tabRect.top - navRect.top,
      height: tabRect.height,
      ready: true,
    });
  }, []);

  React.useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  React.useLayoutEffect(() => {
    if (isMobile) return;
    placeIndicator(activeIdx);
  }, [activeIdx, isMobile, placeIndicator]);

  React.useEffect(() => {
    if (isMobile) return undefined;
    const onResize = () => placeIndicator(activeIdx);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeIdx, isMobile, placeIndicator]);

  React.useEffect(() => {
    const section = document.getElementById('team');
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!inView || userPickedRef.current) return undefined;

    const interval = setInterval(() => {
      const next = (idxRef.current + 1) % TEAM_MEMBERS.length;
      idxRef.current = next;
      setActiveIdx(next);
    }, CYCLE_MS);

    return () => clearInterval(interval);
  }, [inView]);

  const selectMember = (idx) => {
    userPickedRef.current = true;
    idxRef.current = idx;
    setActiveIdx(idx);
  };

  return (
    <div className="home-team">
      <HomeLabel>Team</HomeLabel>
      <h2 className="home-section-headline home-section-headline--static">
        <span className="home-section-headline-line">Researchers from top scientific institutions</span>
      </h2>

      <div className="home-team-panel">
        <div className="home-team-select-wrap">
          <select
            id="home-team-select"
            className="home-team-select"
            value={activeIdx}
            aria-label="Team member"
            aria-controls="home-team-detail"
            onChange={(event) => selectMember(Number(event.target.value))}
          >
            {TEAM_MEMBERS.map((member, index) => (
              <option key={member.name} value={index}>
                {member.name} — {member.institution}
              </option>
            ))}
          </select>
          <i className="hn hn-chevron-down home-team-select-icon" aria-hidden="true" />
        </div>

        <nav
          ref={navRef}
          className="home-tabs home-team-tabs"
          role="tablist"
          aria-label="Team members"
          onMouseLeave={() => placeIndicator(activeIdx)}
        >
          <span
            className={'home-team-tabs-indicator' + (indicator.ready ? ' home-team-tabs-indicator--ready' : '')}
            style={{
              height: `${indicator.height}px`,
              transform: `translateY(${indicator.top}px)`,
            }}
            aria-hidden="true"
          />
          {TEAM_MEMBERS.map((member, index) => {
            const isActive = index === activeIdx;
            return (
              <button
                key={member.name}
                ref={(node) => { tabRefs.current[index] = node; }}
                type="button"
                role="tab"
                id={`home-team-tab-${index}`}
                aria-selected={isActive}
                aria-controls="home-team-detail"
                className={'home-tab home-team-tab' + (isActive ? ' home-tab--active' : '')}
                style={{ '--tab-i': index }}
                onMouseEnter={() => placeIndicator(index)}
                onFocus={() => placeIndicator(index)}
                onClick={() => selectMember(index)}
              >
                <span className="home-team-tab-name">{member.name}</span>
                <HomeLabel className="home-team-tab-inst">{member.institution}</HomeLabel>
              </button>
            );
          })}
        </nav>

        <div
          className="home-team-detail"
          id="home-team-detail"
          role="tabpanel"
          aria-labelledby={isMobile ? 'home-team-select' : `home-team-tab-${activeIdx}`}
          key={activeIdx}
        >
          <div className="home-team-photo">
            <img
              src={active.photo}
              alt={`Portrait of ${active.name}`}
              style={{ objectPosition: active.photoPosition ?? 'center center' }}
            />
          </div>
          <div className="home-team-detail-copy">
            <p className="home-team-bio">
              <strong className="home-team-name">{active.name}</strong>
              {body ? ` ${body}` : null}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
