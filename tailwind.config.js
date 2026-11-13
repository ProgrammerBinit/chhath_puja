/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: { 950: '#060a1f', 900: '#0a1030', 800: '#101a47', 700: '#18266b' },
        gold: { 300: '#ffe29a', 400: '#ffd166', 500: '#f6b93b', 600: '#d99a1c' },
        saffron: { 400: '#ff9f43', 500: '#ff8a1f', 600: '#e86a0c' },
        clay: { 500: '#a8623a', 700: '#6b3a22' },
      },
      fontFamily: {
        deva: ['"Tiro Devanagari Hindi"', '"Noto Serif Devanagari"', '"Nirmala UI"', 'serif'],
        body: ['Mukta', '"Noto Sans Devanagari"', '"Nirmala UI"', 'system-ui', 'sans-serif'],
        sub: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
