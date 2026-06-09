import React from 'react';

export default function HomeTabs({ tabs, activeTab, onTabChange }) {
  const navRef = React.useRef(null);
  const tabRefs = React.useRef({});
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0, ready: false });

  const placeIndicator = React.useCallback((tabId) => {
    const nav = navRef.current;
    const tab = tabRefs.current[tabId];
    if (!nav || !tab) return;

    const navRect = nav.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();

    setIndicator({
      left: tabRect.left - navRect.left,
      width: tabRect.width,
      ready: true,
    });
  }, []);

  React.useLayoutEffect(() => {
    placeIndicator(activeTab);
  }, [activeTab, placeIndicator]);

  React.useEffect(() => {
    const onResize = () => placeIndicator(activeTab);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeTab, placeIndicator]);

  return (
    <nav
      ref={navRef}
      className="home-tabs"
      role="tablist"
      aria-label="Site sections"
      onMouseLeave={() => placeIndicator(activeTab)}
    >
      <span
        className={'home-tabs-indicator' + (indicator.ready ? ' home-tabs-indicator--ready' : '')}
        style={{
          width: `${indicator.width}px`,
          transform: `translateX(${indicator.left}px)`,
        }}
        aria-hidden="true"
      />
      {tabs.map((tab) => {
        const selected = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={(node) => {
              tabRefs.current[tab.id] = node;
            }}
            type="button"
            role="tab"
            id={`home-tab-${tab.id}`}
            className={'home-tab' + (selected ? ' home-tab--active' : '')}
            aria-selected={selected}
            onMouseEnter={() => placeIndicator(tab.id)}
            onFocus={() => placeIndicator(tab.id)}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
