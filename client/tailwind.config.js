/** @type {import('tailwindcss').Config} */
export default {
  content: ['index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          50: '#f6f7fb',
          100: '#e0e4f5',
          900: '#0c0f1c',
        },
        primary: {
          200: '#a5b4fc',
          400: '#6366f1',
          500: '#4f46e5',
          600: '#4338ca',
        },
        accent: {
          200: '#67e8f9',
          400: '#22d3ee',
          500: '#0ea5e9',
        },
        success: '#34d399',
        error: '#f87171',
      },
      boxShadow: {
        glass: '0 20px 45px rgba(15, 23, 42, 0.35)',
        glow: '0 0 30px rgba(99, 102, 241, 0.45)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

