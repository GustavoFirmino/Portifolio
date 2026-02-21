/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pergaminho: '#f4e4bc', // Uma cor de papel antigo base
        tinta: '#2c1e16',      // Marrom bem escuro para o texto
      },
      fontFamily: {
        medieval: ['"Cinzel Decorative"', 'cursive'], // Usaremos essa fonte do Google Fonts depois
        texto: ['"Cormorant Garamond"', 'serif'],
      }
    },
  },
  plugins: [],
}