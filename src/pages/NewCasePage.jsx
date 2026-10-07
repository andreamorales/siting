import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GridLoadStep from '../components/GridLoadStep';
import LocationStep from '../components/LocationStep';
import ProductHeader from '../components/ProductHeader';
import ReviewNameRow from '../components/ReviewNameRow';
import Select from '../components/Select';
import { createCase, suggestCaseName } from '../lib/cases';
import { TECHNOLOGIES, formatLoad, loadZone, suggestTechnology, viability } from '../lib/siteModel';
import { EXIT_MS } from '../lib/usePresence';

const STEPS = ['Location', 'Grid load', 'Site report'];

function Stepper({ step, onJump }) {
  return (
    <ol className="steps wiz-steps" aria-label="Progress">
      {STEPS.map((label, i) => {
        const state = i < step ? 'complete' : i === step ? 'current' : 'upcoming';
        return (
          <li
            key={label}
            className={'step' + (state === 'upcoming' ? '' : ' step-primary') + (state === 'complete' ? ' wiz-step--complete' : '')}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            <button type="button" className="wiz-steps-btn" disabled={state !== 'complete'} onClick={() => onJump(i)}>
              <span className="wiz-steps-label">{label}</span>
              {state === 'complete' && <span className="sr-only"> (completed)</span>}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function ReviewStep({ place, loadMw, technology, onTechnology, name, onName, onRegenerateName }) {
  const { viable } = viability(place.lat, place.lng);
  const suggested = suggestTechnology(loadMw);
  const rows = [
    ['Location', place.name],
    ['Coordinates', `${place.lat.toFixed(3)}°, ${place.lng.toFixed(3)}°`],
    ['Viability', viable ? 'Viable area' : 'Below minimum — review advised'],
    ['Grid load', `${formatLoad(loadMw)} · ${loadZone(loadMw).label}`],
  ];

  return (
    <div className="wiz-step review-step">
      <h1 className="wiz-question">Ready to generate your site report</h1>
      <p className="wiz-sub">Confirm the inputs and pick a generation technology.</p>

      <dl className="review-rows">
        <ReviewNameRow value={name} onChange={onName} onRegenerate={onRegenerateName} />
        {rows.map(([k, v]) => (
          <div key={k} className="review-row">
            <dt className="review-k">{k}</dt>
            <dd className="review-v">{v}</dd>
          </div>
        ))}
        <div className="review-row review-row--control">
          <dt className="review-k" id="review-technology-label">Technology</dt>
          <dd className="review-control">
            <Select
              id="review-technology"
              labelledBy="review-technology-label"
              value={technology}
              options={TECHNOLOGIES.map((t) => ({ value: t, label: t, badge: t === suggested ? 'Suggested' : null }))}
              onChange={onTechnology}
            />
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default function NewCasePage() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(0);
  // the outgoing step stays on screen for its exit animation before `shown` catches up to `step`
  const [shown, setShown] = React.useState(0);
  const [dir, setDir] = React.useState(0);
  const [place, setPlace] = React.useState(null);
  const [loadMw, setLoadMw] = React.useState(1000);
  const [technology, setTechnology] = React.useState(null);
  const [naming, setNaming] = React.useState({ place: null, name: '', suggested: '' });

  React.useEffect(() => {
    if (step === shown) return undefined;
    const timer = setTimeout(() => setShown(step), EXIT_MS);
    return () => clearTimeout(timer);
  }, [step, shown]);

  const goTo = (target) => {
    setDir(target > step ? 1 : -1);
    setStep(target);
  };

  const valid = step === 0 ? Boolean(place) : true;
  const isLast = step === STEPS.length - 1;
  const tech = technology ?? suggestTechnology(loadMw);

  const rollName = () => {
    const suggested = suggestCaseName(place, { current: naming.name });
    setNaming({ place, name: suggested, suggested });
  };

  const next = () => {
    if (!valid) return;
    if (isLast) {
      const name = naming.name.trim();
      const record = createCase({ place, loadMw, technology: tech, name, nameGenerated: name === naming.suggested });
      navigate(`/app/site/${record.id}`);
      return;
    }
    if (step + 1 === STEPS.length - 1 && naming.place !== place) rollName();
    goTo(step + 1);
  };

  return (
    <div className="product-page st-board" data-theme="meterzero">
      <ProductHeader />

      <main className="prod-main">
        <section className="wiz prod-frame">
          <div className="wiz-top">
            <Stepper step={step} onJump={goTo} />
          </div>

          <div
            key={shown}
            className="wiz-stage"
            data-state={step === shown ? 'open' : 'closed'}
            data-dir={dir || undefined}
            style={dir ? { '--dir': dir } : undefined}
          >
            {shown === 0 && <LocationStep place={place} onPlaceChange={setPlace} />}
            {shown === 1 && <GridLoadStep place={place} loadMw={loadMw} onChange={setLoadMw} />}
            {shown === 2 && (
              <ReviewStep
                place={place}
                loadMw={loadMw}
                technology={tech}
                onTechnology={setTechnology}
                name={naming.name}
                onName={(name) => setNaming((n) => ({ ...n, name }))}
                onRegenerateName={rollName}
              />
            )}
          </div>

          <footer className="wiz-footer">
            {step === 0 ? (
              <Link to="/app" className="btn btn-outline">Cancel</Link>
            ) : (
              <button type="button" className="btn btn-outline" onClick={() => goTo(step - 1)}>
                <i className="hn hn-arrow-left" aria-hidden="true" />
                Back
              </button>
            )}
            <button type="button" className="btn btn-neutral" disabled={!valid} onClick={next}>
              {isLast ? 'Generate site report' : 'Next question'}
              <i className="hn hn-arrow-right" aria-hidden="true" />
            </button>
          </footer>
        </section>
      </main>
    </div>
  );
}
