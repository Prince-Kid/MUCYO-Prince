/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'typing': 'typing 2s steps(40, end)',
        'cursor': 'blink 1s infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        'terminal': {
          'bg': '#0f172a',
          'bg-light': '#1e293b',
          'green': '#22c55e',
          'cyan': '#06b6d4',
          'yellow': '#eab308',
          'red': '#ef4444',
          'purple': '#a855f7',
          'blue': '#3b82f6',
        }
      },
      boxShadow: {
        'terminal': '0 0 20px rgba(34, 197, 94, 0.1), inset 0 0 20px rgba(34, 197, 94, 0.05)',
        'glow': '0 0 15px rgba(34, 197, 94, 0.3)',
      }
    },
  },
  plugins: [],
};
