// ─────────────────────────── tokens ───────────────────────────
const T = {
  paper: '#FDFDFC',
  card: '#FFFFFF',
  ink: '#1C1B1B',
  ink2: '#33373D',
  mut: '#767C84',
  faint: '#A6ABB1',
  line: '#E6E8EA',
  line2: '#F0F1F2',
  grid: 'rgba(11,12,14,0.05)',
  blue: '#1B4DD1',
  orange: '#C2410C',
  green: '#177245',
  amber: '#8B5602',
  red: '#B0201B',
  font: `'IBM Plex Mono', ui-monospace, monospace`,
  title: `'Kode Mono', ui-monospace, monospace`,
  mono: `'IBM Plex Mono', ui-monospace, monospace`,
};

// ─────────────────────────── data ───────────────────────────
const SITE = {
  codename: 'PB-07',
  name: 'Permian Basin',
  region: 'TX',
  coords: '31.997° N · 102.078° W',
  tags: ['SMR', '1.8 GW', '345kV ×2', 'GREENFIELD'],
  score: { grade: 'A+', num: 92, tier: 'PRIME', delta: '+4 vs. fleet avg' },
  verdict:
    'Exceptional co-siting candidate. Abundant interconnect headroom and a supportive zoning overlay outweigh moderate water-stress and induced-seismicity exposure.',
  subscores: [
    { k: 'Env', long: 'Environmental Risk', v: 61 },
    { k: 'Grid', long: 'Grid Capacity', v: 96 },
    { k: 'Reg', long: 'Regulatory Context', v: 84 },
    { k: 'Labor', long: 'Workforce Capacity', v: 78 },
    { k: 'Fiber', long: 'Fiber / Latency', v: 88 },
    { k: 'Social', long: 'Community Sentiment', v: 72 },
    { k: 'Land', long: 'Land & Zoning', v: 91 },
    { k: 'Water', long: 'Water Supply', v: 54 },
  ],
  risks: [
    { k: 'Water stress', level: 'HIGH', note: 'Arid basin; aquifer drawdown flagged', sev: 3 },
    { k: 'Induced seismicity', level: 'MODERATE', note: 'Proximity to injection wells', sev: 2 },
    { k: 'Air permitting (PSD)', level: 'MODERATE', note: 'Nonattainment buffer 41 mi', sev: 2 },
    { k: 'Community sentiment', level: 'LOW–MOD', note: '2 of 3 commissioners supportive', sev: 2 },
    { k: 'Protected habitat', level: 'LOW', note: 'No critical-habitat overlap', sev: 1 },
  ],
  grid: {
    sub: 'Mid-Odessa 345kV', dist: '14.2 mi', headroom: '1.8 GW',
    queue: 'ERCOT GINR #4471', energize: 'Q3 2029', newline: '22 mi · single-circuit',
  },
  capacity: [
    { p: 'PH I', mw: 600, yr: '2029' },
    { p: 'PH II', mw: 1200, yr: '2031' },
    { p: 'PH III', mw: 1800, yr: '2033' },
  ],
  capacityMax: 2000,
  news: [
    { src: 'REUTERS', t: 'ERCOT fast-tracks West Texas interconnect study', ago: '2d', tone: 'pos', url: 'https://www.reuters.com/business/energy/' },
    { src: 'E&E NEWS', t: 'Permian county approves advanced-reactor zoning overlay', ago: '6d', tone: 'pos', url: 'https://www.eenews.net/' },
    { src: 'S&P GLOBAL', t: 'SMR vendor signs LOI for 1.8 GW West Texas campus', ago: '2w', tone: 'pos', url: 'https://www.spglobal.com/commodityinsights/' },
    { src: 'ODESSA AM.', t: 'Groundwater district flags aquifer drawdown concerns', ago: '3w', tone: 'neg', url: 'https://www.oaoa.com/' },
  ],
  missing: [
    { k: 'Water rights agreement', sev: 'HIGH', note: 'No executed allocation on file' },
    { k: 'PSD air permit initiation', sev: 'MED', note: 'Application not yet filed' },
    { k: 'Community benefits agreement', sev: 'MED', note: 'In negotiation' },
    { k: 'Rail spur access study', sev: 'LOW', note: 'Feasibility pending' },
  ],
  factorDetails: {
    Env: {
      rows: [
        { label: 'Water stress', value: 'HIGH', accent: 'var(--neg)' },
        { label: 'Seismic', value: 'MODERATE', accent: 'var(--warn)' },
        { label: 'Air permit', value: 'MODERATE · 41 mi buffer' },
        { label: 'Habitat', value: 'LOW · no overlap', accent: 'var(--pos)' },
      ],
      note: 'Water rights remain the binding constraint; seismic and air risks are manageable with mitigation.',
    },
    Grid: {
      rows: [
        { label: 'Sub', value: 'Mid-Odessa 345kV', mono: false },
        { label: 'Dist', value: '14.2 mi' },
        { label: 'Headroom', value: '1.8 GW', accent: 'var(--pos)' },
        { label: 'Queue', value: 'ERCOT GINR #4471' },
        { label: 'Energize', value: 'Q3 2029' },
      ],
      note: 'Interconnect study fast-tracked; 1.8 GW headroom supports full phased campus build-out.',
    },
    Land: {
      rows: [
        { label: 'Zoning', value: 'Advanced-reactor overlay', mono: false },
        { label: 'Parcel', value: '2,840 ac · fee simple' },
        { label: 'Comp use', value: 'Industrial · unrestricted' },
        { label: 'Setback', value: 'Met · 500 ft buffer' },
      ],
      note: 'County approved zoning overlay 2–1; no conservation easements on parcel.',
    },
    Fiber: {
      rows: [
        { label: 'Nearest POP', value: '12.4 mi · I-20 corridor', mono: false },
        { label: 'Latency', value: '< 8 ms to Dallas' },
        { label: 'Paths', value: '2 diverse · buried' },
        { label: 'Capacity', value: '400 Gbps available' },
      ],
      note: 'Dual-route fiber along I-20; dark-fiber lease terms under review.',
    },
    Reg: {
      rows: [
        { label: 'NRC path', value: 'COL · anticipated', mono: false },
        { label: 'PSD air', value: 'Not yet filed' },
        { label: 'Timeline', value: '48–54 mo est.' },
        { label: 'Local board', value: 'Supportive · 2–1' },
      ],
      note: 'Federal schedule aligned with PH I; PSD initiation and water rights are primary open items.',
    },
    Labor: {
      rows: [
        { label: 'Metro', value: 'Midland–Odessa CSA', mono: false },
        { label: 'Skilled pool', value: '18.4k construction' },
        { label: 'Nuclear exp.', value: 'Limited · train-up' },
        { label: 'Competition', value: 'Moderate · O&G sector' },
      ],
      note: 'Strong regional craft labor; SMR vendor workforce MOU in draft.',
    },
    Social: {
      rows: [
        { label: 'Sentiment', value: 'Low–moderate support', mono: false },
        { label: 'Commissioners', value: '2 of 3 favorable' },
        { label: 'CBA status', value: 'In negotiation' },
        { label: 'Tax base', value: '+$42M annual est.' },
      ],
      note: 'Community benefits agreement pending; no organized opposition filed.',
    },
    Seismic: {
      rows: [
        { label: 'Exposure', value: 'Moderate · injection zone', mono: false },
        { label: 'Nearest well', value: '4.2 mi' },
        { label: 'Design basis', value: '0.15g PGA' },
        { label: 'Monitoring', value: 'NetQuake array active' },
      ],
      note: 'Induced seismicity manageable with siting buffer and monitoring plan.',
    },
    Water: {
      rows: [
        { label: 'Source', value: 'Ogallala aquifer', mono: false },
        { label: 'Stress', value: 'High · arid basin' },
        { label: 'Rights', value: 'Not executed' },
        { label: 'Demand', value: '4,200 ac-ft/yr est.' },
      ],
      note: 'Primary constraint; groundwater district flagged drawdown concerns.',
    },
  },
  // Saved fleet sites for the CONUS overview. x/y are % within the basemap.
  fleet: [
    { id: 'PB-07', g: 'A+', x: 33, y: 70, me: true },
    { id: 'CR-02', g: 'A−', x: 75, y: 56 },
    { id: 'KM-11', g: 'B+', x: 40, y: 30 },
    { id: 'CL-05', g: 'B', x: 82, y: 62 },
    { id: 'GB-19', g: 'C+', x: 22, y: 48 },
    { id: 'SV-31', g: 'B−', x: 60, y: 44 },
  ],
};

// ─────────────────────────── helpers ───────────────────────────
const sevColor = (sev) => (sev >= 3 ? 'var(--neg)' : sev === 2 ? 'var(--warn)' : 'var(--pos)');
const sevWord = (w) =>
  ({ HIGH: 'var(--neg)', MED: 'var(--warn)', 'LOW–MOD': 'var(--warn)', MODERATE: 'var(--warn)', LOW: 'var(--pos)' }[w] || 'var(--ink2)');

function factorScoreColor(v) {
  return v >= 80 ? 'var(--ink)' : v >= 65 ? 'var(--warn)' : 'var(--neg)';
}

function factorByKey(key) {
  return SITE.subscores.find((s) => s.k === key);
}

export { T, SITE, sevColor, sevWord, factorScoreColor, factorByKey };
