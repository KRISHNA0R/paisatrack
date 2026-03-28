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
        dark: {
          bg: '#08080E',
          card: 'rgba(20, 20, 30, 0.8)',
          border: 'rgba(124, 58, 237, 0.3)',
        },
        light: {
          bg: '#F8F7FF',
          card: 'rgba(255, 255, 255, 0.8)',
          border: 'rgba(124, 58, 237, 0.2)',
        },
        accent: {
          purple: '#7B2FFF',
          purpleLight: '#A78BFA',
          teal: '#14B8A6',
          amber: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Ruckle', 'sans-serif'],
        display: ['Ruckle', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(124, 58, 237, 0.6)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
