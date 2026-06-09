import React from 'react';
import { FleetHome } from './homepage.jsx';
import { MapView } from './map.jsx';

function DetailView({ dark, onToggleTheme }) {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <MapView dark={dark} mode="detail" onToggleTheme={onToggleTheme} />
    </div>
  );
}

export default function ExperienceApp() {
  const [view, setView] = React.useState('fleet');
  const [dark, setDark] = React.useState(false);
  const toggle = () => setDark((d) => !d);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return view === 'fleet'
    ? (
      <FleetHome
        dark={dark}
        onToggleTheme={toggle}
        onOpen={() => setView('detail')}
      />
    )
    : (
      <DetailView dark={dark} onToggleTheme={toggle} />
    );
}
