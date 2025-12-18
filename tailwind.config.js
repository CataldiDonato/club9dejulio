/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        club: {
          black: '#000000',
          dark: '#1a1a1a',
          gray: '#333333',
          light: '#f4f4f5',
          accent: '#ffffff', // High contrast white
          blue: '#2563EB',   // Standard Blue for buttons/highlights
        }
      }
    },
  },
  plugins: [],
}
