# Siting

Design prototypes for the Siting tool (Cursor design canvas export).

## Run locally

```bash
npm install
npm run dev
```

Then open:

- **Home:** http://localhost:5173/
- **Map experience:** http://localhost:5173/map
- **Design canvas:** http://localhost:5173/canvas

## Stack

- **Vite + React** — dev server and bundling
- **DaisyUI** — Tailwind component library (theme toggle, buttons)
- **react-map-gl + MapLibre GL** — vector fleet map with CARTO basemaps (same engine as mapcn, no shadcn)

## Legacy static previews

The original HTML exports (`siting-tool.html`, `experience-v*.html`) still work with a static server:

```bash
python3 -m http.server 8080
```
