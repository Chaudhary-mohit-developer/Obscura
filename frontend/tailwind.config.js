/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obscura: {
          violet: '#8B5CF6',
          purple: '#A855F7',
          teal: '#06B6D4',
          cyan: '#22D3EE',
          rose: '#F43F5E',
          pink: '#EC4899',
          amber: '#F59E0B',
          lens: '#3B82F6',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.72)',
          'light-border': 'rgba(255, 255, 255, 0.65)',
          dark: 'rgba(15, 23, 42, 0.75)',
          'dark-border': 'rgba(255, 255, 255, 0.12)',
        }
      },
      backgroundImage: {
        'aurora-light': 'radial-gradient(ellipse at top left, rgba(139, 92, 246, 0.18), transparent 50%), radial-gradient(ellipse at bottom right, rgba(6, 182, 212, 0.18), transparent 50%), radial-gradient(ellipse at center, rgba(244, 63, 94, 0.10), transparent 60%)',
        'aurora-dark': 'radial-gradient(ellipse at top left, rgba(139, 92, 246, 0.22), transparent 50%), radial-gradient(ellipse at bottom right, rgba(6, 182, 212, 0.20), transparent 50%), radial-gradient(ellipse at center, rgba(244, 63, 94, 0.12), transparent 60%)',
        'hologram-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #F43F5E 100%)',
        'aperture-glow': 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 75%)',
      },
      boxShadow: {
        'glass-card': '0 20px 40px -15px rgba(100, 116, 139, 0.15), 0 0 15px rgba(255, 255, 255, 0.5) inset',
        'glass-card-hover': '0 25px 50px -12px rgba(139, 92, 246, 0.20), 0 0 20px rgba(255, 255, 255, 0.7) inset',
        'lens-glow': '0 0 30px rgba(6, 182, 212, 0.45)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
