import React from 'react';
import {
  SITE, Mono, Tag, Eyebrow, RiskRow, MissingRow,
  MiniMap, FactorCard, factorByKey, NewsTicker, FactorBreakdown,
} from '../lib/shared.jsx';
import { Header } from './brandHeaders.jsx';

const F = {
  env: factorByKey('Env'),
  grid: factorByKey('Grid'),
  reg: factorByKey('Reg'),
  labor: factorByKey('Labor'),
  fiber: factorByKey('Fiber'),
  social: factorByKey('Social'),
};

const FACTOR_ROWS = [
  [
    { factor: F.env, idx: '02', details: SITE.factorDetails.Env, showNote: false, extra: 'risks' },
    { factor: F.grid, idx: '03', details: SITE.factorDetails.Grid },
  ],
  [
    { factor: F.reg, idx: '04', details: SITE.factorDetails.Reg, showNote: false, extra: 'missing' },
    { factor: F.labor, idx: '05', details: SITE.factorDetails.Labor },
  ],
  [
    { factor: F.fiber, idx: '06', details: SITE.factorDetails.Fiber },
    { factor: F.social, idx: '07', details: SITE.factorDetails.Social },
  ],
];

function FactorCell({ slot, link }) {
  const { factor, idx, details, showNote, extra } = slot;
  return (
    <FactorCard
      factor={factor}
      idx={idx}
      details={details}
      showNote={showNote}
      className="siting-factor-cell"
      {...link}
    >
      {extra === 'risks' && (
        <div className="mt-lg border-t border-[color:var(--line2)] pt-sm">
          {SITE.risks.slice(0, 3).map((r, i) => (
            <RiskRow key={r.k} r={r} last={i === 2} />
          ))}
        </div>
      )}
      {extra === 'missing' && (
        <div className="mt-lg border-t border-[color:var(--line2)] pt-sm">
          <Mono size={10} ls={1.2} color={'var(--mut)'} style={{ display: 'block', marginBottom: 8 }}>OUTSTANDING</Mono>
          {SITE.missing.slice(0, 3).map((m, i) => <MissingRow key={m.k} m={m} last={i === 2} />)}
        </div>
      )}
    </FactorCard>
  );
}

function MapView({ dark = false, mode = 'detail', onToggleTheme }) {
  const [activeFactor, setActiveFactor] = React.useState(null);
  const link = { activeKey: activeFactor, onActiveKeyChange: setActiveFactor };

  return (
    <div
      className={'st-board siting-page' + (dark ? ' st-dark' : '')}
      data-screen-label="Map · Site"
      style={{ background: 'var(--paper)', color: 'var(--ink)' }}
    >
      <Header mode={mode} dark={dark} onToggleTheme={onToggleTheme} primaryLabel="Save site" />

      <div className="siting-page-body">
        <header className="siting-site-header">
          <div>
            <div className="siting-site-meta">
              <Mono size={11} ls={1.5} color={'var(--mut)'}>SITE {SITE.codename}</Mono>
              <span className="size-[5px] shrink-0 rounded-full bg-[color:var(--pos)]" />
              <Mono size={10} ls={1} color={'var(--pos)'}>ANALYSIS COMPLETE</Mono>
            </div>
            <div className="siting-site-title-row">
              <h1 className="v-display m-0 text-xxl font-medium text-[color:var(--ink)]">{SITE.name}</h1>
              <Mono size={13} color={'var(--mut)'}>{SITE.region} · {SITE.coords}</Mono>
            </div>
            <div className="siting-tags">{SITE.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
          </div>
          <div className="siting-minimap">
            <MiniMap
              accent={'var(--ink)'}
              label="FLEET POSITION"
              showSearch
              searchValue="County Rd 240, Ector County, TX 79765"
            />
          </div>
        </header>

        <NewsTicker items={SITE.news} variant="bar" />

        <div className="siting-bento" onMouseLeave={() => setActiveFactor(null)}>
          <div className="siting-summary-col">
            <Eyebrow idx="01" right="RANK #1 OF 6">Composite Score</Eyebrow>
            <div className="siting-grade-row">
              <div className="v-display text-display font-medium text-[color:var(--ink)]">{SITE.score.grade}</div>
              <div className="siting-grade-tier">
                <div className="v-display text-xl font-semibold text-[color:var(--ink)]">{SITE.score.tier}</div>
                <div className="siting-grade-score-row">
                  <span className="text-xl font-extrabold tracking-tight text-[color:var(--ink)]">{SITE.score.num}</span>
                  <Mono size={12} color={'var(--mut)'}>/ 100</Mono>
                </div>
                <Mono size={11} color={'var(--pos)'} ls={0.5} style={{ display: 'block', marginTop: 6 }}>{SITE.score.delta}</Mono>
              </div>
            </div>
            <div className="siting-breakdown">
              <Mono size={10} ls={1.4} color={'var(--mut)'} style={{ display: 'block' }}>FACTOR BREAKDOWN</Mono>
              <FactorBreakdown {...link} />
            </div>
            <p className="siting-verdict">{SITE.verdict}</p>
          </div>

          <div className="siting-factor-stack">
            {FACTOR_ROWS.map((row, ri) => (
              <div key={ri} className="siting-factor-row">
                {row.map((slot) => (
                  <FactorCell key={slot.factor.k} slot={slot} link={link} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { MapView };
