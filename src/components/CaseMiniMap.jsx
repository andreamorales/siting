import React from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import MapLabels from './MapLabels';
import SiteMarkerGlyph from './SiteMarkerGlyph';
import { withBasemapLabelsHidden } from '../lib/mapBase';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

export default function CaseMiniMap({ lat, lng, label }) {
  const [ready, setReady] = React.useState(false);
  return (
    <div className={'dc-map case-minimap' + (ready ? ' map--ready' : '')}>
      <Map
        mapStyle={MAP_STYLE}
        initialViewState={{ longitude: lng, latitude: lat, zoom: 6.5 }}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        interactive={false}
        onLoad={withBasemapLabelsHidden(() => setReady(true))}
      >
        <MapLabels />
        {ready && (
          <Marker longitude={lng} latitude={lat} anchor="center" style={{ zIndex: 1 }}>
            <span className="dc-pin dc-pin--case dc-pin--active dc-pin--static" aria-label={label}>
              <SiteMarkerGlyph active variant="case" />
              <span className="dc-pin-label">{label}</span>
            </span>
          </Marker>
        )}
      </Map>
      <span className="dc-map-attrib">© OpenStreetMap · CARTO</span>
    </div>
  );
}
