import { T, SITE, sevColor, sevWord, factorByKey, factorScoreColor } from './siteData.js';
import { Mono, Eyebrow, Tag, RiskRow, NewsRow, MissingRow, DataRow, FactorCard, FactorBreakdown } from '../components/shared/atoms.jsx';
import { Basemap, RegionMap, Node, Gauge, Radar, CapacityBars, MiniMap } from '../components/shared/charts.jsx';
import { NewsTicker, FakePhoto, NewsFeature, NewsPhotoRow } from '../components/shared/news.jsx';

// shared.jsx — data + tokens + American-Dynamism primitives for the siting tool.

// one-time base styles + keyframes
if (typeof document !== 'undefined' && !document.getElementById('siting-base')) {
  const s = document.createElement('style');
  s.id = 'siting-base';
  s.textContent = `
    @keyframes st-pulse { 0%{transform:scale(1);opacity:.55} 70%{transform:scale(2.6);opacity:0} 100%{opacity:0} }
    @keyframes st-sweep { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes st-blink { 0%,100%{opacity:1} 50%{opacity:.25} }
    @keyframes st-ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    .st-news-ticker-track { animation: st-ticker 180s linear infinite; will-change: transform; }
    .st-news-ticker:hover .st-news-ticker-track { animation-play-state: paused; }
    .st-news-ticker-link {
      display: inline-flex; align-items: center; gap: 8px; white-space: nowrap;
      text-decoration: none; color: inherit; padding: 3px 6px; margin: -3px -6px;
      border-radius: 2px; transition: background 0.15s ease; cursor: pointer;
    }
    .st-news-ticker-link:hover { background: var(--line2); }
    .st-news-ticker-link:hover .st-news-ticker-headline { color: var(--ink); text-decoration: underline; text-underline-offset: 2px; }
    .st-board, .st-board * { box-sizing:border-box; }
    .st-board {
      --paper:#FDFDFC; --card:#FFFFFF; --ink:#1C1B1B; --ink2:#33373D; --mut:#767C84; --faint:#A6ABB1;
      --line:#E6E8EA; --line2:#F0F1F2; --grid:rgba(28,27,27,0.05);
      --solid:#1C1B1B; --solidfg:#FFFFFF; --rail:#1C1B1B; --mapbg:#FBFBFA; --mapcall:rgba(251,251,250,0.85);
      --pos:#177245; --warn:#8B5602; --neg:#B0201B; --frame:#C2C7CE;
      --scorebg:#1C1B1B; --scorefg:#F4F5F5; --scoremut:rgba(244,245,245,0.62);
      --scoreline:rgba(255,255,255,0.16); --scoreline2:rgba(255,255,255,0.08); --scoreaccent:#6EE7A8;
      --banner:var(--ink); --banner-fg:var(--solidfg);
      font-family:${T.font}; -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility;
    }
    .st-board.st-dark {
      --paper:#0A0B0E; --card:#14171C; --ink:#ECEEF1; --ink2:#C4C9D0; --mut:#8A909A; --faint:#5C626B;
      --line:#2C313A; --line2:#22262C; --grid:rgba(255,255,255,0.06);
      --solid:#ECEEF1; --solidfg:#1C1B1B; --rail:#121110; --mapbg:#0E1116; --mapcall:rgba(14,17,22,0.85);
      --pos:#43BE86; --warn:#E0A53E; --neg:#E26B5C; --frame:#2C313A;
      --scorebg:#0E1522; --scorefg:#ECEEF1; --scoremut:rgba(236,238,241,0.58);
      --scoreline:rgba(255,255,255,0.12); --scoreline2:rgba(255,255,255,0.06); --scoreaccent:#5B83D8;
    }
    .st-score-card {
      background: var(--scorebg) !important;
      color: var(--scorefg);
      border-color: var(--scoreline) !important;
    }
    .st-mono { font-family:${T.mono}; font-variant-numeric:tabular-nums; }
    .st-title, .v-display { font-family:${T.title}; font-weight:500; }
    .st-subtitle {
      font-family:${T.title};
      font-variant-numeric:tabular-nums;
      text-transform:uppercase;
      letter-spacing:0.12em;
    }
  `;
  document.head.appendChild(s);
}

export {
  T, SITE, sevColor, sevWord, factorByKey,
  Mono, Eyebrow, Tag, Basemap, RegionMap, Node, Gauge, Radar, CapacityBars,
  RiskRow, NewsRow, MissingRow, DataRow, FactorCard, FactorBreakdown, factorScoreColor, NewsTicker,
  FakePhoto, MiniMap, NewsFeature, NewsPhotoRow,
};
