/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 0.35s ease-out',
      },
      fontFamily: {
        sans: ['Geist', 'Geist Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        bg: '#070A0E',
        surface: '#0B0F14',
        border: '#202832',
        primary: '#E6EDF3',
        muted: '#7D8996',
        accent: '#3DDC84',
        link: '#58A6FF',
      },
    },
  },
  plugins: [],
};
