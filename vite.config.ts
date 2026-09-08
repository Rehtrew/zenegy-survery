import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  // Everything — JS, CSS, fonts, logos — ends up inside index.html, so a deploy
  // is two files: index.html and api.php. That matters because Kinsta's file
  // manager uploads one file at a time.
  plugins: [react(), viteSingleFile()],
  build: {
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 4000,
  },
  // The survey is served from a folder on zenegy.com (like /CVR-Tjek and
  // /SalesTeam), so assets must be referenced relative to index.html — an
  // absolute /assets/… would resolve against the WordPress root.
  base: './',
  // In production the PHP endpoints sit next to the built site. For local work,
  // run them with `npm run api` (PHP's built-in server on :8000) and the dev
  // server forwards /api there, so the flow matches what Kinsta serves.
  server: {
    proxy: {
      '/api': { target: process.env.VITE_DEV_API ?? 'http://localhost:8000', changeOrigin: true },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
})
