/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4070F4',
          dark: '#3060E0',
          light: '#5080FF',
        },
        navy: {
          50:  '#f5f7fa',
          100: '#e3e8f3',
          200: '#c5cbe1',
          300: '#a3afd6',
          400: '#7e93c2',
          500: '#233876',
          600: '#1b285c',
          800: '#1a237e',
          900: '#0A1B3D',
          950: '#050a1a',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};