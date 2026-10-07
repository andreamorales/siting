import React from 'react';
import Map, { Layer, Marker, NavigationControl, Source } from 'react-map-gl/maplibre';
import MapLabels from './MapLabels';
import SiteMarkerGlyph from './SiteMarkerGlyph';
import TruncatedText from './TruncatedText';
import { withBasemapLabelsHidden } from '../lib/mapBase';
import { reversePlace, searchPlaces, specificityIssue, toPlace } from '../lib/geocode';
import { circlePolygon, nearestDatacenters, nearestViableSpots, viability } from '../lib/siteModel';
import usePresence from '../lib/usePresence';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const CONUS_BOUNDS = [[-125, 24.5], [-66.9, 49.5]];
const SEARCH_DEBOUNCE_MS = 450;
const RADIUS_KM = 12;

function readTokens(el) {
  const css = getComputedStyle(el);
  const get = (name) => css.getPropertyValue(name).trim();
  return { good: get('--green-dark'), bad: get('--red-dark') };
}

function ResultItem({ result, active, onPick, onHover }) {
  const primary = result.name || result.display_name.split(',')[0];
  return (
    <li
      role="option"
      aria-selected={active}
      className={'loc-result' + (active ? ' loc-result--active' : '')}
      onMouseDown={(e) => { e.preventDefault(); onPick(result); }}
      onMouseEnter={onHover}
    >
      <span className="loc-result-main">
        <span className="loc-result-name">{primary}</span>
        <span className="loc-result-type">{result.addresstype || result.type}</span>
      </span>
      <span className="loc-result-detail">{result.display_name}</span>
    </li>
  );
}

/** Keyed by pin in LocationStep, so a new pin resets state and re-runs the entrance. */
function ViabilityPanel({ pin, onMovePin }) {
  const [showSpots, setShowSpots] = React.useState(false);
  const spotsList = usePresence(showSpots);

  if (!pin) {
    return (
      <aside className="loc-panel">
        <span className="loc-panel-kicker">Viability</span>
        <p className="loc-panel-text">Search for a place or click the map to drop a pin. We’ll check whether the area can host a campus.</p>
      </aside>
    );
  }

  const { viable, index } = viability(pin.lat, pin.lng);
  const [nearestDc] = nearestDatacenters(pin.lat, pin.lng, 1);
  const spots = spotsList.present ? nearestViableSpots(pin.lat, pin.lng) : [];

  return (
    <aside className={'loc-panel' + (viable ? ' loc-panel--good' : ' loc-panel--bad')} aria-live="polite">
      <span className="loc-panel-kicker">
        <i className={'hn ' + (viable ? 'hn-check-circle' : 'hn-exclamation-triangle')} aria-hidden="true" />
        {viable ? 'Viable area' : 'No viable space'}
        <span className="loc-panel-index">{index}/100</span>
      </span>
      {viable ? (
        <p className="loc-panel-text">Grid, land and water in this area clear the minimum bar for a datacenter campus. You can continue, or fine-tune the pin.</p>
      ) : (
        <>
          <p className="loc-panel-text">There are no viable spaces for a datacenter in your selected area. Here are the closest minimum viable spaces.</p>
          <button type="button" className="btn btn-neutral loc-panel-btn" aria-expanded={showSpots} onClick={() => setShowSpots((v) => !v)}>
            {showSpots ? 'Hide nearest spaces' : 'Show me nearest spaces'}
          </button>
        </>
      )}
      {spots.length > 0 && (
        <ul className="loc-spots" data-state={spotsList.state}>
          {spots.map((s, i) => (
            <li key={s.id} className="loc-spot prod-stagger" style={{ '--i': i }}>
              <TruncatedText className="loc-spot-label">{`Space ${i + 1} · ${s.km} km`}</TruncatedText>
              <button type="button" className="btn btn-outline btn-sm loc-panel-btn" onClick={() => onMovePin(s)}>Move pin here</button>
            </li>
          ))}
        </ul>
      )}
      {showSpots && spots.length === 0 && (
        <p className="loc-panel-text">No viable spaces found within ~250 km. Try another region.</p>
      )}
      {nearestDc && (
        <p className="loc-panel-meta">Nearest operating campus: {nearestDc.name} ({nearestDc.km} km)</p>
      )}
    </aside>
  );
}

export default function LocationStep({ place, onPlaceChange }) {
  const mapRef = React.useRef(null);
  const searchAbort = React.useRef(null);
  const reverseAbort = React.useRef(null);
  const timer = React.useRef(null);
  const [query, setQuery] = React.useState(place?.name ?? '');
  const [results, setResults] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState(-1);
  const [status, setStatus] = React.useState('idle');
  const [issue, setIssue] = React.useState('');
  const [pin, setPin] = React.useState(place ? { lat: place.lat, lng: place.lng } : null);
  const [colors, setColors] = React.useState(null);
  const resultsMenu = usePresence(open && results.length > 0 ? results : null);
  const mapReady = Boolean(colors);

  React.useEffect(() => () => {
    clearTimeout(timer.current);
    searchAbort.current?.abort();
    reverseAbort.current?.abort();
  }, []);

  const runSearch = (term) => {
    searchAbort.current?.abort();
    const ctrl = new AbortController();
    searchAbort.current = ctrl;
    setStatus('loading');
    searchPlaces(term, ctrl.signal)
      .then((data) => {
        setResults(data);
        setActiveIdx(-1);
        setOpen(true);
        setStatus(data.length ? 'idle' : 'empty');
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setStatus('error');
      });
  };

  const handleQuery = (value) => {
    setQuery(value);
    setIssue('');
    clearTimeout(timer.current);
    if (value.trim().length < 3) {
      searchAbort.current?.abort();
      setResults([]);
      setOpen(false);
      setStatus('idle');
      return;
    }
    timer.current = setTimeout(() => runSearch(value.trim()), SEARCH_DEBOUNCE_MS);
  };

  const flyTo = (lat, lng, zoom) => {
    mapRef.current?.getMap()?.flyTo({ center: [lng, lat], zoom, duration: 1100 });
  };

  const pickResult = (result) => {
    setOpen(false);
    const problem = specificityIssue(result);
    const next = toPlace(result);
    setQuery(next.name);
    if (problem) {
      setIssue(problem);
      onPlaceChange(null);
      return;
    }
    setIssue('');
    setPin({ lat: next.lat, lng: next.lng });
    onPlaceChange(next);
    const kind = result.addresstype || result.type;
    flyTo(next.lat, next.lng, kind === 'county' ? 8.5 : 10.5);
  };

  const movePin = ({ lat, lng }) => {
    setPin({ lat, lng });
    setIssue('');
    setStatus('locating');
    onPlaceChange(null);
    reverseAbort.current?.abort();
    const ctrl = new AbortController();
    reverseAbort.current = ctrl;
    reversePlace(lat, lng, ctrl.signal)
      .then((result) => {
        setStatus('idle');
        const problem = specificityIssue(result);
        if (problem) {
          setIssue(problem);
          return;
        }
        const next = { ...toPlace(result), lat, lng };
        setQuery(next.name);
        onPlaceChange(next);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setStatus('idle');
        if (err instanceof TypeError) {
          const coords = `${lat.toFixed(3)}°, ${lng.toFixed(3)}°`;
          setQuery(coords);
          onPlaceChange({ name: `Pinned site ${coords}`, display: `${coords} (offline — place name unavailable)`, lat, lng, city: '', county: '', state: '', stateCode: '' });
          return;
        }
        setIssue('We couldn’t identify that spot. Move the pin onto land in the U.S., or search instead.');
      });
  };

  const handleKeyDown = (e) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      pickResult(results[Math.max(activeIdx, 0)]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const hint = issue
    || (status === 'error' && 'Search is unavailable right now — check your connection, or click the map to drop a pin.')
    || (status === 'empty' && 'No U.S. matches. Try a county name, city, or full street address.')
    || (status === 'locating' && 'Locating pin…')
    || (place && `Selected: ${place.display}`)
    || 'County level or more specific. Drag the pin or click the map to adjust.';

  const viable = pin ? viability(pin.lat, pin.lng).viable : false;
  const circle = pin ? circlePolygon(pin.lat, pin.lng, RADIUS_KM) : null;
  const circleColor = colors ? (viable ? colors.good : colors.bad) : null;

  const initialViewState = place
    ? { longitude: place.lng, latitude: place.lat, zoom: 9 }
    : { bounds: CONUS_BOUNDS, fitBoundsOptions: { padding: 30 } };

  return (
    <div className="wiz-step loc-step">
      <h1 className="wiz-question">Where will this be located?</h1>

      <div className="loc-search">
        <div className="loc-search-field">
          <div className={'loc-search-box' + (issue ? ' loc-search-box--issue' : '')}>
            <i className="hn hn-search" aria-hidden="true" />
            <input
              className="loc-search-input"
              type="text"
              role="combobox"
              aria-expanded={open}
              aria-controls="loc-results"
              aria-autocomplete="list"
              aria-describedby="loc-search-hint"
              placeholder="Write in a specific address or county."
              value={query}
              onChange={(e) => handleQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => results.length && setOpen(true)}
              onBlur={() => setOpen(false)}
            />
            {(status === 'loading' || status === 'locating') && (
              <i className="hn hn-spinner-third loc-spin" aria-label={status === 'loading' ? 'Searching' : 'Locating pin'} />
            )}
          </div>
          {resultsMenu.present && (
            <ul id="loc-results" className="loc-results prod-pop" data-state={resultsMenu.state} role="listbox">
              {resultsMenu.value.map((r, i) => (
                <ResultItem
                  key={r.place_id}
                  result={r}
                  active={i === activeIdx}
                  onPick={pickResult}
                  onHover={() => setActiveIdx(i)}
                />
              ))}
            </ul>
          )}
        </div>
        <p id="loc-search-hint" className={'loc-hint' + (issue || status === 'error' ? ' loc-hint--issue' : '')} role="status">
          <span key={hint} className="loc-hint-text">{hint}</span>
        </p>
      </div>

      <div className="loc-body">
        <div className={'loc-map' + (mapReady ? ' map--ready' : '')}>
          <Map
            ref={mapRef}
            mapStyle={MAP_STYLE}
            initialViewState={initialViewState}
            style={{ width: '100%', height: '100%' }}
            attributionControl={false}
            dragRotate={false}
            pitchWithRotate={false}
            touchPitch={false}
            maxPitch={0}
            cursor="crosshair"
            onLoad={withBasemapLabelsHidden((e) => setColors(readTokens(e.target.getContainer())))}
            onClick={(e) => movePin({ lat: e.lngLat.lat, lng: e.lngLat.lng })}
          >
            <MapLabels />
            <NavigationControl position="top-right" showCompass={false} />
            {circle && circleColor && (
              <Source id="loc-radius" type="geojson" data={circle}>
                <Layer id="loc-radius-fill" type="fill" paint={{ 'fill-color': circleColor, 'fill-opacity': 0.14 }} />
                <Layer id="loc-radius-line" type="line" paint={{ 'line-color': circleColor, 'line-width': 1, 'line-opacity': 0.6 }} />
              </Source>
            )}
            {pin && mapReady && (
              <Marker
                longitude={pin.lng}
                latitude={pin.lat}
                anchor="center"
                draggable
                style={{ zIndex: 1 }}
                onDragEnd={(e) => movePin({ lat: e.lngLat.lat, lng: e.lngLat.lng })}
              >
                <span className="loc-pin" aria-label="Site pin — drag to move" title="Drag to move">
                  <SiteMarkerGlyph active variant="case" />
                </span>
              </Marker>
            )}
          </Map>
          <span className="dc-map-attrib">© OpenStreetMap · CARTO · Nominatim</span>
        </div>
        <ViabilityPanel key={pin ? `${pin.lat},${pin.lng}` : 'none'} pin={pin} onMovePin={(s) => { movePin(s); flyTo(s.lat, s.lng, 9); }} />
      </div>
    </div>
  );
}
