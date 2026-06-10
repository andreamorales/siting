import React from 'react';
import { renderTopoPortrait } from '../lib/topoPortrait';

export default function HomeTopoPortrait({ src, alt }) {
  const containerRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const imageRef = React.useRef(null);

  const paint = React.useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const img = imageRef.current;
    if (!canvas || !container || !img?.complete || !img.naturalWidth) return;

    const size = container.clientWidth;
    if (size < 2) return;

    renderTopoPortrait(canvas, img, { displaySize: size });
  }, []);

  React.useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    let cancelled = false;
    const img = new Image();
    imageRef.current = img;

    img.decoding = 'async';
    img.onload = () => {
      if (cancelled) return;
      requestAnimationFrame(paint);
    };
    img.src = src;

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(paint);
    });
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      imageRef.current = null;
    };
  }, [src, paint]);

  return (
    <div ref={containerRef} className="home-team-photo" role="img" aria-label={alt}>
      <canvas ref={canvasRef} className="home-team-photo-canvas" aria-hidden="true" />
    </div>
  );
}
