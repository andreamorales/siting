export const BASEMAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

/** Hides every symbol layer (text labels + icons) so <MapLabels /> can draw ours in product fonts. */
export function hideBasemapLabels(map) {
  let layers;
  try {
    layers = map?.getStyle?.()?.layers;
  } catch {
    return;
  }
  if (!layers) return;
  for (const layer of layers) {
    if (layer.type === 'symbol' && layer.layout?.visibility !== 'none') {
      map.setLayoutProperty(layer.id, 'visibility', 'none');
    }
  }
}

/** Keeps basemap labels hidden across style (re)loads. Returns an unsubscribe function. */
export function watchBasemapLabels(map) {
  const hide = () => hideBasemapLabels(map);
  if (map.style?._loaded) hide();
  map.on('styledata', hide);
  return () => map.off('styledata', hide);
}

const PLACE_SOURCE_LAYER = 'place';

/** Vector source id that carries the OpenMapTiles `place` layer (CARTO: `carto`), or null. */
export function findPlaceSource(map) {
  let style;
  try {
    style = map?.getStyle?.();
  } catch {
    return null;
  }
  const layer = style?.layers?.find((l) => l['source-layer'] === PLACE_SOURCE_LAYER && l.source);
  return layer && style.sources?.[layer.source]?.type === 'vector' ? layer.source : null;
}

/**
 * Raw place features from loaded tiles (works while the basemap's place layers are hidden).
 * Returns [{ name, cls, rank, lng, lat }]; empty on any failure.
 */
export function queryBasemapPlaces(map, sourceId) {
  let features;
  try {
    features = map.querySourceFeatures(sourceId, { sourceLayer: PLACE_SOURCE_LAYER });
  } catch {
    return [];
  }
  const out = [];
  for (const f of features) {
    const p = f.properties || {};
    const coords = f.geometry?.type === 'Point' ? f.geometry.coordinates : null;
    const name = p.name_en || p.name || p['name:latin'];
    if (!coords || !name) continue;
    out.push({ name, cls: p.class, rank: Number.isFinite(p.rank) ? p.rank : 99, lng: coords[0], lat: coords[1] });
  }
  return out;
}

/** Composes an onLoad handler that hides the basemap's own labels before running `onLoad`. */
export function withBasemapLabelsHidden(onLoad) {
  return (e) => {
    hideBasemapLabels(e.target);
    onLoad?.(e);
  };
}
