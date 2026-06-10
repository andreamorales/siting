import React from 'react';

const PHRASES = [
  'more & more data',
  'better infrastructure',
  'nuclear energy',
];

const SIZER_PHRASE = 'increased data capacity';
const CYCLE_MS = 3500;
const FADE_MS = 520;

export default function HomeBackgroundHeadline() {
  const [shownIdx, setShownIdx] = React.useState(0);
  const [visible, setVisible] = React.useState(true);
  const [inView, setInView] = React.useState(false);
  const idxRef = React.useRef(0);

  React.useEffect(() => {
    const section = document.getElementById('background');
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

    let fadeTimer;
    const interval = setInterval(() => {
      setVisible(false);
      fadeTimer = setTimeout(() => {
        idxRef.current = (idxRef.current + 1) % PHRASES.length;
        setShownIdx(idxRef.current);
        requestAnimationFrame(() => setVisible(true));
      }, FADE_MS);
    }, CYCLE_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
    };
  }, [inView]);

  const wordClass = [
    'home-section-headline-word',
    visible ? 'home-section-headline-word--visible' : 'home-section-headline-word--hidden',
  ].join(' ');

  return (
    <h2 className="home-section-headline">
      <span className="home-section-headline-line">AI needs</span>
      <span className="home-section-headline-line home-section-headline-rotate" aria-live="polite">
        <span className="home-section-headline-rotate-sizer" aria-hidden="true">{SIZER_PHRASE}</span>
        <span className={wordClass}>{PHRASES[shownIdx]}</span>
      </span>
    </h2>
  );
}
