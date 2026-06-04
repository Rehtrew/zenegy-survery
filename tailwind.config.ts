import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#00C896', dark: '#00A07A', light: '#F0FDF9' },
        'app-bg': '#F5F6FA',
        'text-main': '#1a1a2e',
        'text-muted': '#6B7280',
        'app-border': '#E8EAED',
        'dark-bg': '#1a1a2e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
