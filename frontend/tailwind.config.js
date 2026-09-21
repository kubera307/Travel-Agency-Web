/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          bg: '#F7F1E7',
          sand: '#EFE4D2',
          dark: '#1D1B18',
          muted: '#6D6A61',
          gold: '#B99762',
          olive: '#6D725C',
          border: 'rgba(29, 27, 24, 0.12)',
          divider: 'rgba(29, 27, 24, 0.08)',
          card: '#FFFFFF'
        },
        brand: {
          dark: '#131417',
          sand: '#FAF8F5',
          gold: '#B68D40',
          goldHover: '#a77f34',
          olive: '#6D725C',
          muted: '#6D6A61'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Manrope', 'Inter', 'sans-serif'],
        display: ['"Cormorant Garamond"', '"Playfair Display"', 'serif'],
        script: ['Caveat', 'cursive']
      }
    },
  },
  plugins: [],
}
