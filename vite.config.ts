import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
