import React from 'react';
import { Basemap } from '../lib/shared.jsx';

export default function HomeMapOrb() {
  return (
    <div className="home-map-orb" aria-hidden="true">
      <div className="home-map-orb-inner">
        <Basemap accent="var(--ink)" height="100%" showCrosshair compact />
      </div>
    </div>
  );
}
