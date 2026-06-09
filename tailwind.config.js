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
      },
      fontSize: {
        xxs: ['var(--t-xxs)', { lineHeight: '1.35' }],
        xs: ['var(--t-xs)', { lineHeight: '1.4' }],
        sm: ['var(--t-sm)', { lineHeight: '1.45' }],
        md: ['var(--t-md)', { lineHeight: '1.5' }],
        lg: ['var(--t-lg)', { lineHeight: '1.35' }],
        xl: ['var(--t-xl)', { lineHeight: '1.2' }],
        xxl: ['var(--t-xxl)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
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
    themes: ['light', 'dark'],
  },
};
