import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Zenegy action tokens
        primary: {
          DEFAULT: '#6e30fd',
          hover: '#331070',
          active: '#120c2b',
          fg: '#ffffff',
        },
        // Zenegy surface tokens
        'surface-page': '#f0f0f0',
        'surface-default': '#ffffff',
        'surface-subtle': '#f7f7f7',
        'surface-brand': '#ebe6ff',
        'surface-brand-hover': '#ddd5ff',
        // Zenegy text tokens
        'text-primary': '#111111',
        'text-secondary': '#616161',
        'text-tertiary': '#999999',
        'text-disabled': '#b3b3b3',
        // Zenegy border tokens
        'border-default': '#e0e0e0',
        'border-focus': '#6e30fd',
        // Dark hero surface
        'hero-bg': '#120c2b',
      },
      fontFamily: {
        sans: ['PP Neue Montreal', 'Inter', '-apple-system', 'sans-serif'],
      },
      fontWeight: {
        // Only 500 exists in Zenegy type scale
        normal: '500',
        medium: '500',
        semibold: '500',
        bold: '500',
        extrabold: '500',
        black: '500',
      },
      borderRadius: {
        'z-xs': '4px',
        'z-s': '6px',
        'z-m': '8px',
        'z-l': '12px',
        'z-xl': '16px',
        'z-full': '9999px',
      },
    },
  },
  plugins: [],
} satisfies Config
