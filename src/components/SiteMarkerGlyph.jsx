export default function SiteMarkerGlyph({ active = false, variant = 'site' }) {
  return (
    <span className={`site-glyph site-glyph--${variant}` + (active ? ' site-glyph--active' : '')} aria-hidden="true">
      <span className="site-glyph-dot" />
      <span className="site-glyph-reticule">
        <span className="site-glyph-ring site-glyph-ring--a" />
        <span className="site-glyph-ring site-glyph-ring--b" />
        <span className="site-glyph-ring site-glyph-ring--c" />
        <span className="site-glyph-mark" />
      </span>
    </span>
  );
}
