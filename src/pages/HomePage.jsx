import React from 'react';
import HomeLogo from '../components/HomeLogo';
import HomeMapOrb from '../components/HomeMapOrb';

export default function HomePage() {
  return (
    <div className="home-page st-board">
      <div className="home-beta-banner">
        <p className="home-beta-banner-text">MeterZero is officially in beta. Join the queue.</p>
      </div>
      <div className="home-shell">
        <div className="home-brand">
          <HomeLogo />
          <p className="home-tagline">NUCLEAR DATACENTER CO-SITING TOOL</p>
        </div>
        <HomeMapOrb />
      </div>
    </div>
  );
}
