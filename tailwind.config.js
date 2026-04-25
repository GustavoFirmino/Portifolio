/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Páginas / Pergaminho
        parchment: '#f2e4c4',
        'parchment-dark': '#e8d0a0',
        'parchment-aged': '#d4b87a',
        // Texto
        ink: '#1c1008',
        'ink-light': '#2c1e16',
        // Capa / Couro
        leather: '#3d2008',
        'leather-light': '#5c3010',
        'leather-spine': '#2a1505',
        // Acentos
        gold: '#c8920f',
        'gold-light': '#e0aa20',
        rubric: '#8b0000',
        'rubric-light': '#a01515',
        // Fundo
        dungeon: '#050302',
        'dungeon-mid': '#0d0603',
        'dungeon-light': '#1a0e05',
      },
      fontFamily: {
        medieval: ['"Cinzel Decorative"', 'cursive'],
        cinzel: ['Cinzel', 'serif'],
        body: ['"IM Fell English"', 'serif'],
        'body-sc': ['"IM Fell English SC"', 'serif'],
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.85 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        flicker: 'flicker 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
