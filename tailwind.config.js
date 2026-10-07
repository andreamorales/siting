import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}', './src/**/*.css'],
  theme: {
    extend: {
      fontFamily: {
        title: ['Kode Mono', 'ui-monospace', 'monospace'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      /* Uniform scale — values resolve on .st-board (see src/styles/tokens.css) */
      spacing: {
        xxs: 'var(--s-xxs)',
        xs: 'var(--s-xs)',
        sm: 'var(--s-sm)',
        md: 'var(--s-md)',
        lg: 'var(--s-lg)',
        xl: 'var(--s-xl)',
        xxl: 'var(--s-xxl)',
        '3xl': 'var(--s-3xl)',
      },
      fontSize: {
        xxs: ['var(--t-xxs)', { lineHeight: '1.35' }],
        xs: ['var(--t-xs)', { lineHeight: '1.4' }],
        sm: ['var(--t-sm)', { lineHeight: '1.45' }],
        md: ['var(--t-md)', { lineHeight: '1.5' }],
        lg: ['var(--t-lg)', { lineHeight: '1.35' }],
        xl: ['var(--t-xl)', { lineHeight: '1.2' }],
        xxl: ['var(--t-xxl)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        hero: ['var(--t-hero)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        display: ['var(--t-display)', { lineHeight: '0.74', letterSpacing: '-0.04em' }],
      },
      minHeight: {
        'factor-row': 'var(--layout-factor-row-min)',
        'factor-card': 'var(--layout-factor-card-min)',
      },
      maxWidth: {
        summary: 'var(--layout-summary-max)',
      },
      minWidth: {
        summary: 'var(--layout-summary-min)',
      },
      width: {
        minimap: 'var(--layout-minimap-w)',
      },
      height: {
        header: 'var(--layout-header-h)',
        minimap: 'var(--layout-minimap-h)',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    /* light/dark stay first so :root (marketing homepage) is unchanged; product roots opt in via data-theme="meterzero" */
    themes: [
      'light',
      'dark',
      {
        /* literal hex mirrors src/styles/tokens.css — daisy derives its oklch channels from these at build time */
        meterzero: {
          'color-scheme': 'light',
          primary: '#1C1B1B',
          'primary-content': '#FFFFFF',
          secondary: '#E4DCFF',
          'secondary-content': '#674FA8',
          accent: '#FCD5E6',
          'accent-content': '#983B6D',
          neutral: '#1C1B1B',
          'neutral-content': '#FFFFFF',
          'base-100': '#FFFFFF',
          'base-200': '#FDFDFC',
          'base-300': '#E6E8EA',
          'base-content': '#1C1B1B',
          info: '#1E5FAA',
          'info-content': '#FFFFFF',
          success: '#177245',
          'success-content': '#FFFFFF',
          warning: '#8B5602',
          'warning-content': '#FFFFFF',
          error: '#B0201B',
          'error-content': '#FFFFFF',
          '--rounded-box': 'var(--r-md)',
          '--rounded-btn': 'var(--r-sm)',
          '--rounded-badge': 'var(--r-xs)',
          '--animation-btn': '0',
          '--animation-input': '0',
          '--btn-focus-scale': '1',
          '--border-btn': '1px',
          '--tab-border': '1px',
          '--tab-radius': 'var(--r-sm)',
          'font-family': 'var(--font-content)',
        },
      },
    ],
  },
};
