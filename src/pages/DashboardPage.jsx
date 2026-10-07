import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DatacenterMap from '../components/DatacenterMap';
import ListToolbar from '../components/ListToolbar';
import ProductHeader from '../components/ProductHeader';
import TruncatedText from '../components/TruncatedText';
import { casePlaceLabel, listCases } from '../lib/cases';
import { DATACENTER_SITES, filterSites, placeLabel, readListParams, sortSites, writeListParams } from '../lib/listFilters';
import { buildCaseStudy } from '../lib/siteModel';

const INTRO_MS = 800;
const TECH_PHOTOS = { Microreactor: '/images/smr.png', SMR: '/images/smr.png', AP1000: '/images/coolingtower.png' };

function caseToSite(record) {
  const study = buildCaseStudy(record);
  const [technology, demand, transmission] = study.labels;
  return {
    id: record.id,
    kind: 'case',
    name: record.name,
    grade: study.grade,
    score: study.score,
    loadMw: record.loadMw,
    createdAt: record.createdAt,
    place: record.place,
    location: casePlaceLabel(record) || placeLabel(record.place),
    lat: record.place.lat,
    lng: record.place.lng,
    photo: TECH_PHOTOS[record.technology] ?? '/images/datacenter.png',
    technology,
    demand,
    transmission,
  };
}

function DatacenterCard({ dc, index, active, selected, onHover, onSelect, cardRef }) {
  const isCase = dc.kind === 'case';
  const toggle = () => onSelect(selected ? null : dc.id);
  return (
    <article
      ref={cardRef}
      className={'card dc-card prod-stagger' + (isCase ? ' dc-card--case' : '') + (active ? ' dc-card--active' : '') + (selected ? ' dc-card--selected' : '')}
      style={{ '--i': index }}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget || (e.key !== 'Enter' && e.key !== ' ')) return;
        e.preventDefault();
        toggle();
      }}
      onMouseEnter={() => onHover(dc.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="dc-card-photo">
        <img src={dc.photo} alt={`${dc.name} illustration`} loading="lazy" />
      </div>
      {isCase ? (
        <div className="dc-card-title-row dc-card-title-row--stacked">
          <div className="dc-card-head">
            <h2 className="dc-card-name"><TruncatedText>{dc.name}</TruncatedText></h2>
            <TruncatedText className="dc-card-loc">{dc.location}</TruncatedText>
          </div>
          <span className="dc-card-grade" aria-label={`Grade ${dc.grade}`}>{dc.grade}</span>
        </div>
      ) : (
        <div className="dc-card-title-row dc-card-title-row--stacked">
          <div className="dc-card-head">
            <h2 className="dc-card-name">{dc.name}</h2>
            <span className="dc-card-loc">{dc.location}</span>
          </div>
          <span className="dc-card-grade" aria-label={`Grade ${dc.grade}`}>{dc.grade}</span>
        </div>
      )}
      <ul className="dc-card-tags" aria-label="Site attributes">
        <li className="badge badge-secondary dc-tag"><TruncatedText>{dc.technology}</TruncatedText></li>
        <li className="badge badge-secondary dc-tag"><TruncatedText>{dc.demand}</TruncatedText></li>
        <li className="badge badge-secondary dc-tag"><TruncatedText>{dc.transmission}</TruncatedText></li>
      </ul>
      {isCase && (
        <div className="card-actions dc-card-actions">
          <Link
            to={`/app/site/${dc.id}`}
            className="btn btn-neutral dc-card-btn"
            onClick={(e) => e.stopPropagation()}
          >
            Open site
          </Link>
        </div>
      )}
    </article>
  );
}

export default function DashboardPage() {
  const [hoverId, setHoverId] = React.useState(null);
  const [pickedId, setSelectedId] = React.useState(null);
  const cardRefs = React.useRef({});
  // stagger only the first paint; cards revealed later by filters fade in together
  const [intro, setIntro] = React.useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { q, grades, sort } = readListParams(searchParams);
  const gradeKey = grades.join(',');
  const caseSites = React.useMemo(() => listCases().map(caseToSite), []);
  const visibleCases = React.useMemo(
    () => sortSites(filterSites(caseSites, { q, grades: gradeKey.split(',').filter(Boolean) }), sort),
    [caseSites, q, gradeKey, sort],
  );
  const visibleDatacenters = React.useMemo(
    () => sortSites(filterSites(DATACENTER_SITES, { q, grades: gradeKey.split(',').filter(Boolean) }), sort),
    [q, gradeKey, sort],
  );
  const allSites = React.useMemo(() => [...visibleCases, ...visibleDatacenters], [visibleCases, visibleDatacenters]);
  const filtered = Boolean(q.trim() || grades.length);
  const selectedId = allSites.some((s) => s.id === pickedId) ? pickedId : null;

  const updateParams = (patch) => setSearchParams((prev) => writeListParams(prev, patch), { replace: true });
  const clearFilters = () => updateParams({ q: '', grades: [] });

  React.useEffect(() => {
    if (selectedId) cardRefs.current[selectedId]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [selectedId]);

  React.useEffect(() => {
    const timer = setTimeout(() => setIntro(false), INTRO_MS);
    return () => clearTimeout(timer);
  }, []);

  const renderEmpty = (noun) => (
    <div className="dash-list-empty">
      <span>No matching {noun}</span>
      {filtered && (
        <button type="button" className="dash-list-clear" onClick={clearFilters}>Clear filters</button>
      )}
    </div>
  );

  const renderCard = (offset) => (dc, i) => (
    <DatacenterCard
      key={dc.id}
      dc={dc}
      index={intro ? offset + i : 0}
      active={hoverId === dc.id}
      selected={selectedId === dc.id}
      onHover={setHoverId}
      onSelect={setSelectedId}
      cardRef={(el) => { cardRefs.current[dc.id] = el; }}
    />
  );

  return (
    <div className="dash-page st-board" data-theme="meterzero">
      <ProductHeader />

      <main className="dash-body">
        <aside className="dash-list" aria-label="Sites">
          <ListToolbar
            grades={grades}
            onGradesChange={(next) => updateParams({ grades: next })}
            sort={sort}
            onSortChange={(next) => updateParams({ sort: next })}
          />
          {caseSites.length > 0 && (
            <>
              <div className="dash-list-head">
                <span className="dash-list-title">Your sites</span>
                <span className="dash-list-count">{visibleCases.length} {visibleCases.length === 1 ? 'site' : 'sites'}</span>
              </div>
              {visibleCases.length ? visibleCases.map(renderCard(0)) : renderEmpty('sites')}
            </>
          )}
          <div className="dash-list-head">
            <span className="dash-list-title">Sites</span>
            <span className="dash-list-count">{visibleDatacenters.length} {visibleDatacenters.length === 1 ? 'site' : 'sites'}</span>
          </div>
          {visibleDatacenters.length ? visibleDatacenters.map(renderCard(visibleCases.length)) : renderEmpty('sites')}
        </aside>

        <section className="dash-map-wrap" aria-label="Map of sites">
          <DatacenterMap
            datacenters={allSites}
            activeId={hoverId}
            selectedId={selectedId}
            onHover={setHoverId}
            onSelect={setSelectedId}
          />
        </section>
      </main>
    </div>
  );
}
