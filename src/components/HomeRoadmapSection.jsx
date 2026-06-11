import React from 'react';

const ROADMAP_PHASES = [
  {
    id: 'past',
    label: 'Past',
    items: [
      { title: 'Award from Sloan Foundation', when: 'Dec 2025' },
      { title: 'Project kickoff', when: "Jan '26" },
      { title: 'Input data model compilation', when: "Feb–Apr '26" },
      { title: 'v0', when: "May '26" },
    ],
  },
  {
    id: 'present',
    label: 'Present',
    items: [
      { title: 'Website launch', when: "Jun '26" },
      { title: 'v1', when: "est. mid Jul '26" },
    ],
  },
  {
    id: 'future',
    label: 'Future',
    items: [
      { title: 'v2 dev with advisory board and design partners', when: "est. mid Aug–mid Oct '26" },
      { title: 'v3 dev', when: "est. Dec '26" },
      { title: 'v3 open as early partner beta', when: 'est. Feb 2027' },
      { title: 'open beta', when: 'est. Mar 2027' },
    ],
  },
];

const PHASE_STARTS = ROADMAP_PHASES.reduce((acc, phase, idx) => {
  if (idx === 0) acc.push(0);
  else acc.push(acc[idx - 1] + ROADMAP_PHASES[idx - 1].items.length);
  return acc;
}, []);

const ALL_MILESTONES = ROADMAP_PHASES.flatMap((phase) =>
  phase.items.map((item) => ({ ...item, phaseId: phase.id })),
);

const PHASE_BOUNDARIES = new Set(PHASE_STARTS.filter((_, idx) => idx > 0));

const CYCLE_MS = 4500;

function getPhaseRange(phaseIdx, milestoneEls) {
  const startIdx = PHASE_STARTS[phaseIdx];
  const endIdx = phaseIdx + 1 < PHASE_STARTS.length
    ? PHASE_STARTS[phaseIdx + 1] - 1
    : milestoneEls.length - 1;
  const startEl = milestoneEls[startIdx];
  const endEl = milestoneEls[endIdx];
  if (!startEl || !endEl) return null;

  const left = startEl.offsetLeft;
  const right = endEl.offsetLeft + endEl.offsetWidth;
  return { left, right, center: (left + right) / 2 };
}

function phaseIndexForViewport(viewport, milestoneEls) {
  if (!viewport) return 0;

  const anchor = viewport.scrollLeft + viewport.clientWidth / 2;
  let hit = 0;
  let bestDist = Infinity;

  for (let i = 0; i < PHASE_STARTS.length; i += 1) {
    const range = getPhaseRange(i, milestoneEls);
    if (!range) continue;
    if (anchor >= range.left && anchor <= range.right) return i;
    const dist = Math.abs(anchor - range.center);
    if (dist < bestDist) {
      bestDist = dist;
      hit = i;
    }
  }
  return hit;
}

function scrollLeftForPhaseCenter(phaseIdx, viewport, milestoneEls) {
  const range = getPhaseRange(phaseIdx, milestoneEls);
  if (!range || !viewport) return 0;

  const target = range.center - viewport.clientWidth / 2;
  const maxScroll = viewport.scrollWidth - viewport.clientWidth;
  return Math.max(0, Math.min(target, maxScroll));
}

export default function HomeRoadmapSection() {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [inView, setInView] = React.useState(false);
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0, ready: false });
  const [dragging, setDragging] = React.useState(false);

  const idxRef = React.useRef(0);
  const tabsRef = React.useRef(null);
  const tabRefs = React.useRef({});
  const viewportRef = React.useRef(null);
  const milestoneRefs = React.useRef([]);
  const dragRef = React.useRef({ active: false, x: 0, scrollLeft: 0 });
  const scrollSyncRef = React.useRef(null);
  const userInteractingRef = React.useRef(false);

  const activePhase = ROADMAP_PHASES[activeIdx];

  const placeIndicator = React.useCallback((phaseId) => {
    const nav = tabsRef.current;
    const tab = tabRefs.current[phaseId];
    if (!nav || !tab) return;

    const navRect = nav.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();

    setIndicator({
      left: tabRect.left - navRect.left,
      width: tabRect.width,
      ready: true,
    });
  }, []);

  const scrollToPhase = React.useCallback((phaseIdx, behavior = 'smooth') => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const target = scrollLeftForPhaseCenter(phaseIdx, viewport, milestoneRefs.current);
    viewport.scrollTo({ left: target, behavior });
  }, []);

  const updateScrollPadding = React.useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.style.setProperty('--roadmap-scroll-pad', `${viewport.clientWidth / 2}px`);
  }, []);

  const syncPhaseFromScroll = React.useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const nextIdx = phaseIndexForViewport(viewport, milestoneRefs.current);
    if (nextIdx !== idxRef.current) {
      idxRef.current = nextIdx;
      setActiveIdx(nextIdx);
    }
  }, []);

  const queueScrollSync = React.useCallback(() => {
    if (scrollSyncRef.current) window.cancelAnimationFrame(scrollSyncRef.current);
    scrollSyncRef.current = window.requestAnimationFrame(syncPhaseFromScroll);
  }, [syncPhaseFromScroll]);

  React.useLayoutEffect(() => {
    updateScrollPadding();
    placeIndicator(activePhase.id);
  }, [activePhase.id, placeIndicator, updateScrollPadding]);

  React.useEffect(() => {
    const onResize = () => {
      updateScrollPadding();
      placeIndicator(activePhase.id);
      scrollToPhase(idxRef.current, 'auto');
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activePhase.id, placeIndicator, scrollToPhase, updateScrollPadding]);

  React.useEffect(() => {
    updateScrollPadding();
    scrollToPhase(0, 'auto');
  }, [scrollToPhase, updateScrollPadding]);

  React.useEffect(() => {
    const section = document.getElementById('roadmap');
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!inView) return undefined;

    const interval = setInterval(() => {
      if (userInteractingRef.current) return;
      const next = (idxRef.current + 1) % ROADMAP_PHASES.length;
      idxRef.current = next;
      setActiveIdx(next);
      scrollToPhase(next);
    }, CYCLE_MS);

    return () => clearInterval(interval);
  }, [inView, scrollToPhase]);

  const selectPhase = (idx) => {
    userInteractingRef.current = true;
    idxRef.current = idx;
    setActiveIdx(idx);
    scrollToPhase(idx);
    window.setTimeout(() => {
      userInteractingRef.current = false;
    }, CYCLE_MS);
  };

  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    dragRef.current = {
      active: true,
      x: event.clientX,
      scrollLeft: viewport.scrollLeft,
    };
    userInteractingRef.current = true;
    setDragging(true);
    viewport.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!dragRef.current.active) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    const dx = event.clientX - dragRef.current.x;
    viewport.scrollLeft = dragRef.current.scrollLeft - dx;
    queueScrollSync();
  };

  const onPointerEnd = (event) => {
    if (!dragRef.current.active) return;
    const viewport = viewportRef.current;
    dragRef.current.active = false;
    setDragging(false);
    viewport?.releasePointerCapture(event.pointerId);
    syncPhaseFromScroll();
    scrollToPhase(idxRef.current);
    window.setTimeout(() => {
      userInteractingRef.current = false;
    }, CYCLE_MS);
  };

  const onScroll = () => {
    queueScrollSync();
  };

  return (
    <div className="home-roadmap">
      <div className="home-roadmap-intro">
        <p className="home-section-eyebrow st-title">Roadmap</p>
        <h2 className="home-section-headline">
          <span className="home-section-headline-line">Deploying in cooperation</span>
          <span className="home-section-headline-line">with industry experts</span>
        </h2>
        <p className="home-section-text">
          We are developing MeterZero in close collaboration with advisors from the Nuclear Regulatory
          Commission, Constellation, Radiant Nuclear, and the International Data Center Authority.
        </p>
      </div>
      <div className="home-roadmap-phases">
        <nav
          ref={tabsRef}
          className="home-roadmap-tabs"
          role="tablist"
          aria-label="Roadmap phases"
        >
          <span
            className={
              'home-roadmap-tabs-indicator'
              + (indicator.ready ? ' home-roadmap-tabs-indicator--ready' : '')
            }
            style={{
              width: `${indicator.width}px`,
              transform: `translateX(${indicator.left}px)`,
            }}
            aria-hidden="true"
          />
          {ROADMAP_PHASES.map((phase, idx) => {
            const selected = idx === activeIdx;
            return (
              <button
                key={phase.id}
                ref={(node) => {
                  tabRefs.current[phase.id] = node;
                }}
                type="button"
                role="tab"
                id={`roadmap-tab-${phase.id}`}
                className={'home-roadmap-tab' + (selected ? ' home-roadmap-tab--active' : '')}
                aria-selected={selected}
                onClick={() => selectPhase(idx)}
              >
                {phase.label}
              </button>
            );
          })}
        </nav>
        <div className="home-roadmap-timeline">
          <div
            ref={viewportRef}
            className={'home-roadmap-viewport' + (dragging ? ' home-roadmap-viewport--dragging' : '')}
            role="tabpanel"
            id={`roadmap-panel-${activePhase.id}`}
            aria-labelledby={`roadmap-tab-${activePhase.id}`}
            aria-live="polite"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onScroll={onScroll}
          >
            <ol className="home-roadmap-milestones">
            {ALL_MILESTONES.map((item, idx) => (
              <li
                key={item.title}
                ref={(node) => {
                  milestoneRefs.current[idx] = node;
                }}
                className={
                  'home-roadmap-milestone'
                  + (item.phaseId === activePhase.id ? ' home-roadmap-milestone--active' : '')
                  + (PHASE_BOUNDARIES.has(idx) ? ' home-roadmap-milestone--phase-start' : '')
                }
                data-phase={item.phaseId}
                style={{ '--milestone-i': idx }}
              >
                <span className="home-roadmap-item-when">{item.when}</span>
                <div className="home-roadmap-milestone-track">
                  <span className="home-roadmap-marker" aria-hidden="true" />
                  {idx < ALL_MILESTONES.length - 1 ? (
                    <span
                      className={
                        'home-roadmap-connector'
                        + (PHASE_BOUNDARIES.has(idx + 1) ? ' home-roadmap-connector--phase-gap' : '')
                      }
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
                <p className="home-roadmap-item-title">{item.title}</p>
              </li>
            ))}
          </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
