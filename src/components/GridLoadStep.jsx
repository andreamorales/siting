import React from 'react';
import { LOAD_MAX, LOAD_MIN, LOAD_STEP, LOAD_ZONES, formatLoad, loadZone, suggestLoad } from '../lib/siteModel';

const span = LOAD_MAX - LOAD_MIN;
const pct = (mw) => `${((mw - LOAD_MIN) / span) * 100}%`;

const ZONE_STOPS = LOAD_ZONES.slice(0, -1).reduce((acc, z, i) => ({ ...acc, [`--zone-${i + 1}`]: pct(z.max) }), {});

export default function GridLoadStep({ place, loadMw, onChange }) {
  const [suggested, setSuggested] = React.useState(false);
  const zone = loadZone(loadMw);

  const help = () => {
    onChange(suggestLoad(place.lat, place.lng));
    setSuggested(true);
  };

  return (
    <div className="wiz-step load-step">
      <h1 className="wiz-question">
        Based on your location, we will need to know the approximate grid load for that datacenter.
      </h1>
      <p className="wiz-sub">{place.name}</p>

      <div className="load-control">
        <div className="load-readout" aria-hidden="true">
          <span className="load-value">{formatLoad(loadMw)}</span>
          <span className={`load-zone load-zone--${zone.tone}`}>{zone.label}</span>
        </div>

        <input
          className="load-slider"
          type="range"
          min={LOAD_MIN}
          max={LOAD_MAX}
          step={LOAD_STEP}
          value={loadMw}
          style={ZONE_STOPS}
          aria-label="Approximate grid load in megawatts"
          aria-valuetext={`${formatLoad(loadMw)} — ${zone.label}`}
          onChange={(e) => { onChange(Number(e.target.value)); setSuggested(false); }}
        />

        <div className="load-legend" aria-hidden="true">
          {LOAD_ZONES.map((z, i) => {
            const lo = i === 0 ? LOAD_MIN : LOAD_ZONES[i - 1].max;
            return (
              <span key={z.tone} className="load-legend-seg" style={{ flexGrow: z.max - lo }}>
                <span>{formatLoad(lo)}</span>
                {i === LOAD_ZONES.length - 1 && <span>{formatLoad(LOAD_MAX)}</span>}
              </span>
            );
          })}
        </div>
      </div>

      <div className="load-help">
        <button type="button" className="btn btn-neutral" onClick={help}>
          <i className="hn hn-lightbulb" aria-hidden="true" />
          I don’t know, help me
        </button>
        {suggested && (
          <p className="load-help-note" role="status">
            Suggested {formatLoad(loadMw)} — estimated from comparable sites. Model coming soon.
          </p>
        )}
      </div>
    </div>
  );
}
