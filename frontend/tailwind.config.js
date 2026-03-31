/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          deep: 'var(--bg-deep)',
        },
        glass: {
          surface: 'var(--glass-surface)',
          border: 'var(--glass-border)',
          highlight: 'var(--glass-highlight)',
        },
        accent: {
          orange: 'var(--accent-orange)',
          orangeGlow: 'var(--accent-orange-glow)',
          green: 'var(--accent-green)',
          red: 'var(--accent-red)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px var(--accent-orange-glow)' },
          '100%': { boxShadow: '0 0 20px var(--accent-orange), 0 0 40px var(--accent-orange-glow)' }
        }
      }
    },
  },
  plugins: [],
}
