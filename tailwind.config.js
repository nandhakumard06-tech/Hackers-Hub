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
        cyber: {
          bg: '#000000',
          'bg-secondary': '#080808',
          card: '#111111',
          'card-hover': '#181818',
          border: '#2A2A2A',
          'border-red': '#FF1A1A',
          red: '#FF1A1A',
          'red-bright': '#FF3333',
          'red-dark': '#8B0000',
          'text-primary': '#FFFFFF',
          'text-secondary': '#E5E5E5',
          'text-muted': '#999999',
          success: '#22C55E',
          danger: '#FF1A1A',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'Monaco', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Rajdhani"', '"Orbitron"', 'sans-serif'],
      },
      boxShadow: {
        'red-glow': '0 0 15px rgba(255, 26, 26, 0.35), 0 0 30px rgba(255, 26, 26, 0.15)',
        'red-glow-lg': '0 0 25px rgba(255, 26, 26, 0.5), 0 0 50px rgba(255, 26, 26, 0.25)',
        'red-glow-sm': '0 0 8px rgba(255, 26, 26, 0.3)',
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)',
        'circuit-pattern': 'radial-gradient(circle at 50% 50%, rgba(255, 26, 26, 0.08) 0%, transparent 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        }
      }
    },
  },
  plugins: [],
}
