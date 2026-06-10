import React from 'react';
import HomeTopoPortrait from './HomeTopoPortrait';

const TEAM_MEMBERS = [
  {
    name: 'Aditi Verma',
    photo: '/headshots/aditi_verma.jpg',
    bio: 'Aditi Verma is an assistant professor of Nuclear Engineering and Radiological Sciences at the University of Michigan (UM), where she directs the Critical Masses research group. Her research and teaching focus on the participatory design and siting of nuclear energy infrastructure. Her research team builds tools for gathering public perspectives on, as well as visualizing and prototyping energy infrastructure.',
  },
  {
    name: 'Marija Ilic',
    photo: '/headshots/marija_ilic.jpeg',
    bio: 'Marija Ilic is a Senior Research Scientist at the MIT Laboratory for Information and Decision Systems and Adjunct Professor in Electrical Engineering and Computer Science at MIT, where she leads the Electric Energy Systems Group. She has over 30 years of teaching and research experience in power systems modeling and control, and power systems operations, planning, and economics.',
  },
  {
    name: 'Ash Bharatkumar',
    photo: '/headshots/ash_bharatkumar.jpg',
    bio: 'Ash Bharatkumar is an Electrical Engineering and Computer Science PhD student at MIT (Fall 2025 matriculation). Previously, she obtained a JD from Harvard Law School, practiced federal and state energy and telecom law in D.C., and was an electricity market design analyst at ISO New England.',
  },
  {
    name: 'Tanmay Deshmukh',
    photo: '/headshots/tanmay_deshmukh.jpeg',
    bio: 'Tanmay Deshmukh is a master’s student, planning to pursue a PhD, in the Department of Nuclear Engineering and Radiological Sciences at UM. His ongoing work using geospatial analysis to assess co-location potential of data center sites has supported the development of this proposal.',
  },
  {
    name: 'Sola Talabi',
    photo: '/headshots/sola_talabi.avif',
    bio: 'Sola Talabi is the President of Pittsburgh Technical, a nuclear engineering consulting practice focused on advanced reactor safety analysis. Dr. Talabi is also adjunct faculty at UM and the University of Pittsburgh.',
  },
  {
    name: 'Katie Snyder',
    photo: '/headshots/katie_snyder.jpeg',
    bio: 'Katie Snyder is a lecturer in the Program in Technical Communication at UM. She has been teaching communication, ethics, and design to engineering students for 18 years. She holds a Ph.D. in Rhetoric, Theory and Culture from Michigan Technical University.',
  },
  {
    name: 'Andrea Morales Coto',
    photo: '/headshots/andrea_morales.jpeg',
    bio: 'Andrea Morales Coto is a Parsons trained transdisciplinary designer and UX/UI developer at UM, with over a decade of industry experience at companies like MongoDB and Roblox. She leads the design of the web-based siting assessment tool.',
  },
  {
    name: 'Gabrielle Hoelzle',
    photo: '/headshots/gabrielle_hoezle.jpeg',
    bio: 'Gabrielle Hoelzle is a senior program manager at UM’s Fastest Path to Zero initiative. She is the lead developer of several open-source GIS-based decision support tools, including, notably, STAND.',
  },
  {
    name: 'Kevin Daley',
    photo: '/headshots/kevin_daley.jpg',
    bio: 'Kevin Daley is a Data Scientist at UM’s Fastest Path to Zero Initiative. He oversees web application development, cloud maintenance, and data processing and analysis. Previously, Kevin provided GIS support for civil engineering, utilities, municipal government, and natural resource management.',
  },
];

function bioBody(name, bio) {
  return bio.startsWith(name) ? bio.slice(name.length).trimStart() : bio;
}

function HomeTeamMember({ member }) {
  const [expanded, setExpanded] = React.useState(false);
  const [clampable, setClampable] = React.useState(false);
  const bioRef = React.useRef(null);
  const body = bioBody(member.name, member.bio);

  React.useLayoutEffect(() => {
    const el = bioRef.current;
    if (!el || expanded) return undefined;

    const measure = () => {
      setClampable(el.scrollHeight > el.clientHeight + 1);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [member.bio, expanded]);

  const showToggle = clampable || expanded;

  return (
    <article className="home-team-member">
      <HomeTopoPortrait src={member.photo} alt={`Portrait of ${member.name}`} />
      <div className="home-team-copy">
        <p
          ref={bioRef}
          className={[
            'home-team-bio',
            !expanded ? 'home-team-bio--clamped' : 'home-team-bio--expanded',
          ].join(' ')}
        >
          <strong className="home-team-name">{member.name}</strong>
          {body ? ` ${body}` : null}
        </p>
        {showToggle ? (
          <button
            type="button"
            className="home-team-bio-toggle"
            aria-expanded={expanded}
            aria-label={expanded ? `Show less for ${member.name}` : `Show more for ${member.name}`}
            onClick={() => setExpanded((open) => !open)}
          >
            <i className={`hn ${expanded ? 'hn-minus' : 'hn-plus'}`} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </article>
  );
}

export default function HomeTeamSection() {
  return (
    <>
      <p className="home-section-eyebrow st-title">Team</p>
      <h2 className="home-section-headline home-section-headline--static">
        <span className="home-section-headline-line">Researchers from top scientific institutions</span>
      </h2>
      <div className="home-team-grid">
        {TEAM_MEMBERS.map((member) => (
          <HomeTeamMember key={member.name} member={member} />
        ))}
      </div>
    </>
  );
}
