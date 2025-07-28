import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
// import { redirects } from './src/data/redirects.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://soberlivingapp.com',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      customPages: [],
      filter: (page) => page !== 'https://soberlivingapp.com/404',
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  trailingSlash: 'never',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  output: 'static',
  compressHTML: true,
  vite: {
    build: {
      cssMinify: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  },
  experimental: {
    contentIntellisense: true,
  },
  // Redirects are handled via middleware to avoid conflicts
});