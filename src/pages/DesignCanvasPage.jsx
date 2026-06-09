import React from 'react';
import { DesignCanvas, DCSection, DCArtboard } from '../components/design-canvas.jsx';
import { MapView } from '../components/map.jsx';

export default function DesignCanvasPage() {
  return (
    <DesignCanvas>
      <DCSection
        id="siting"
        title="Co-Siting Analysis · Site Detail"
        subtitle="Editorial mono · light & dark — nuclear × datacenter co-siting. Drag to reorder, click any to open fullscreen."
      >
        <DCArtboard id="mapl" label="Map · Editorial Mono — Light" width={1440} height={900}><MapView /></DCArtboard>
        <DCArtboard id="mapd" label="Map · Editorial Mono — Dark" width={1440} height={900}><MapView dark /></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}
