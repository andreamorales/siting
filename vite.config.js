import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ogHandler } from './api/_og.js';

const ogImageApi = {
  name: 'og-image-api',
  configureServer(server) {
    server.middlewares.use('/api/og', ogHandler);
  },
};

export default defineConfig({
  plugins: [react(), ogImageApi],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api/gnews': {
        target: 'https://news.google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gnews/, '/rss/search'),
      },
      '/api/gdelt': {
        target: 'https://api.gdeltproject.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gdelt/, '/api/v2/doc/doc'),
      },
    },
  },
});
