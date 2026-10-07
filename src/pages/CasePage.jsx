import React from 'react';
import { Link, useParams } from 'react-router-dom';
import CaseMiniMap from '../components/CaseMiniMap';
import CaseTitle from '../components/CaseTitle';
import ProductHeader from '../components/ProductHeader';
import TruncatedText from '../components/TruncatedText';
import { caseAddress, casePlaceLabel, caseUrl, getCase, regenerateCaseName, renameCase, saveCase } from '../lib/cases';
import {
  fetchLocalNews, illustrationFor, NEWS_SOURCE_LABELS, relativeAge, resolveArticleImages, scopeLabel,
} from '../lib/news';
import { buildCaseStudy, factorTone, formatLoad } from '../lib/siteModel';
import usePresence from '../lib/usePresence';

const FEEDBACK_MS = 1800;
const NEWS_SKELETONS = 4;

function newsUrl(headline, place) {
  const q = [headline, place.city || place.county || place.state].filter(Boolean).join(' ');
  return `https://news.google.com/search?q=${encodeURIComponent(q)}`;
}

/** Real local coverage, or the sample headlines from the case study if every source fails. Null while loading. */
function useLocalNews(place, sample) {
  const [news, setNews] = React.useState(null);
  const placeRef = React.useRef(place);
  const sampleRef = React.useRef(sample);
  const placeKey = place ? [place.city, place.county, place.state].join('|') : '';

  React.useEffect(() => {
    if (!placeKey) return undefined;
    const target = placeRef.current;
    const fallback = sampleRef.current.map((n) => ({ ...n, url: newsUrl(n.title, target) }));
    const controller = new AbortController();
    const onImage = (url, image) => setNews((prev) => prev && {
      ...prev,
      items: prev.items.map((item) => (item.url === url ? { ...item, image } : item)),
    });
    fetchLocalNews(target, { signal: controller.signal, fallback })
      .then((result) => {
        setNews(result);
        return resolveArticleImages(target, result, { signal: controller.signal, onImage });
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setNews({ items: fallback, source: 'mock', scope: null });
      });
    return () => controller.abort();
  }, [placeKey]);

  return news;
}

/** The illustration sits underneath as a background; the article photo fades in over it once loaded. */
function NewsThumb({ src, fallbackKey }) {
  return (
    <span className="case-news-thumb" style={{ backgroundImage: `url(${illustrationFor(fallbackKey)})` }}>
      {src && <NewsPhoto key={src} src={src} />}
    </span>
  );
}

function NewsPhoto({ src }) {
  const [state, setState] = React.useState('loading');
  if (state === 'failed') return null;
  return (
    <img
      className={'case-news-photo' + (state === 'loaded' ? ' is-loaded' : '')}
      src={src}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onLoad={() => setState('loaded')}
      onError={() => setState('failed')}
    />
  );
}

function LocalNews({ news }) {
  if (!news) {
    return (
      <ul className="case-list" aria-busy="true" aria-label="Loading local news">
        {Array.from({ length: NEWS_SKELETONS }, (_, i) => (
          <li key={i} className="case-news case-news--skeleton" aria-hidden="true">
            <span className="case-news-thumb" />
            <span className="case-news-body">
              <span className="case-news-bar" />
              <span className="case-news-bar case-news-bar--short" />
            </span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="case-list">
      {news.items.map((n) => (
        <li key={n.url || n.title}>
          <a className="case-news" href={n.url} target="_blank" rel="noreferrer" title={n.title}>
            <NewsThumb src={n.image} fallbackKey={n.title} />
            <span className="case-news-body">
              <span className="case-item-title case-news-title">{n.title}</span>
              <TruncatedText className="case-news-meta">{`${n.source} · ${n.age ?? relativeAge(n.date)}`}</TruncatedText>
            </span>
            <i className="hn hn-external-link case-news-icon" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}

function newsCaption(news, place) {
  if (!news) return 'Searching local coverage…';
  if (news.source === 'mock') return 'Sample headlines';
  return [`via ${NEWS_SOURCE_LABELS[news.source]}`, scopeLabel(place, news.scope)].filter(Boolean).join(' · ');
}

function useFlash() {
  const [on, setOn] = React.useState(false);
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const flash = () => {
    setOn(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOn(false), FEEDBACK_MS);
  };
  return [on, flash];
}

function CaseSection({ title, caption, children, className = '' }) {
  return (
    <section className={'case-section' + (className ? ` ${className}` : '')}>
      {caption ? (
        <header className="case-section-head">
          <h2 className="case-section-title">{title}</h2>
          <p className="case-section-caption" aria-live="polite">{caption}</p>
        </header>
      ) : (
        <h2 className="case-section-title">{title}</h2>
      )}
      {children}
    </section>
  );
}

function CapacityChart({ bars }) {
  const max = Math.max(...bars.map((b) => b.mw));
  return (
    <div className="case-chart" role="img" aria-label={bars.map((b) => `${b.label} ${formatLoad(b.mw)}`).join(', ')}>
      {bars.map((b, i) => (
        <div key={b.label} className={'case-chart-col' + (b.reference ? ' case-chart-col--ref' : '')} style={{ '--i': i }}>
          <span className="case-chart-v">{formatLoad(b.mw)}</span>
          <div className="case-chart-track">
            <div className="case-chart-bar" style={{ height: `${(b.mw / max) * 100}%` }} />
          </div>
          <span className="case-chart-k">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function CasePage() {
  const { id } = useParams();
  return <CaseView key={id} id={id} />;
}

function CaseView({ id }) {
  const [record, setRecord] = React.useState(() => getCase(id));
  const [copied, flashCopied] = useFlash();
  const [saved, flashSaved] = useFlash();
  const status = usePresence(copied ? 'Link copied' : saved ? 'Saved' : '');
  const study = React.useMemo(() => (record ? buildCaseStudy(record) : null), [record]);
  const news = useLocalNews(record?.place, study?.news ?? []);
  const caseName = record?.name;

  React.useEffect(() => {
    if (!caseName) return undefined;
    const previous = document.title;
    document.title = `${caseName} · MeterZero`;
    return () => { document.title = previous; };
  }, [caseName]);

  if (!record) {
    return (
      <div className="product-page st-board" data-theme="meterzero">
        <ProductHeader />
        <main className="prod-main">
          <div className="case-missing prod-frame">
            <h1 className="wiz-question">Site not found</h1>
            <p className="wiz-sub">This site isn’t saved in this browser. Sites are stored locally for now.</p>
            <Link to="/app/new" className="btn btn-neutral">
              <i className="hn hn-plus" aria-hidden="true" />
              Create a new site
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(caseUrl(record.id));
      flashCopied();
    } catch {
      window.prompt('Copy this link', caseUrl(record.id));
    }
  };

  const save = () => {
    setRecord(saveCase(record));
    flashSaved();
  };

  return (
    <div className="product-page st-board" data-theme="meterzero">
      <ProductHeader />

      <main className="prod-main">
        <article className="case">
          <header className="case-head">
            <CaseTitle
              name={record.name}
              onRename={(name) => setRecord(renameCase(record, name))}
              onRegenerate={() => setRecord(regenerateCaseName(record))}
            >
              <button
                type="button"
                className="btn btn-ghost btn-square"
                onClick={copyLink}
                aria-label="Copy link to this site"
                title="Copy link"
              >
                <i className={'hn ' + (copied ? 'hn-check' : 'hn-link')} aria-hidden="true" />
              </button>
              <button type="button" className="btn btn-neutral" onClick={save} title="Save site">
                <i className={'hn ' + (saved ? 'hn-check' : 'hn-save')} aria-hidden="true" />
                Save
              </button>
              <span className="case-action-status" role="status">
                {status.present && (
                  <span key={status.value} className="prod-fade" data-state={status.state}>{status.value}</span>
                )}
              </span>
            </CaseTitle>
            <p className="case-meta">
              <span className="case-meta-place">{casePlaceLabel(record)}</span>
              {caseAddress(record) && <TruncatedText className="case-meta-address">{`· ${caseAddress(record)}`}</TruncatedText>}
            </p>
            <ul className="case-tags dc-card-tags" aria-label="Site attributes">
              {study.labels.map((label, i) => (
                <li key={i} className="dc-tag"><TruncatedText>{label}</TruncatedText></li>
              ))}
            </ul>
          </header>

          <div className="case-body">
            <div className="case-col case-col--score">
              <div className="case-grade-card prod-frame">
                <div className="case-grade">
                  <span className="case-grade-letter">{study.grade}</span>
                  <span className="case-grade-score">{study.score}/100</span>
                </div>
                <div className="case-grade-body">
                  <div className="case-verdict">
                    <p className="case-verdict-text">{study.summary}</p>
                  </div>
                  <div className="case-factors">
                    {study.factors.map((f, i) => (
                      <div key={f.k} className="case-factor" title={f.long} style={{ '--i': i }}>
                        <span className="case-factor-k">{f.k}</span>
                        <div className="case-factor-track">
                          <div className={`case-factor-fill case-factor-fill--${factorTone(f.v)}`} style={{ width: `${f.v}%` }} />
                        </div>
                        <span className="case-factor-v">{f.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <CaseMiniMap lat={record.place.lat} lng={record.place.lng} label={record.name} />
            </div>

            <div className="case-col">
              <CaseSection title="Environmental Risks">
                <ul className="case-list">
                  {study.risks.map((r) => (
                    <li key={r.label} className="case-item">
                      <span className="case-item-head">
                        <span className="case-item-title">{r.label}</span>
                        <span className={`case-level case-level--${r.level.toLowerCase()}`}>{r.level}</span>
                      </span>
                      <span className="case-item-detail">{r.detail}</span>
                    </li>
                  ))}
                </ul>
              </CaseSection>
              <CaseSection title="Related Local Policies">
                <ul className="case-list">
                  {study.policies.map((p) => (
                    <li key={p.title} className="case-item">
                      <span className="case-item-title">{p.title}</span>
                      <span className="case-item-detail">{p.detail}</span>
                    </li>
                  ))}
                </ul>
              </CaseSection>
            </div>

            <div className="case-col">
              <CaseSection title="Expected Datacenter Capacity">
                <CapacityChart bars={study.capacity} />
                <p className="case-item-detail">Phased build-out of {formatLoad(record.loadMw)} against estimated local grid headroom.</p>
              </CaseSection>
              <CaseSection title="Local Related News" caption={newsCaption(news, record.place)}>
                <LocalNews news={news} />
              </CaseSection>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
