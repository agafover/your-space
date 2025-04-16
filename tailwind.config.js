/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#EAC6C0',
        'brand-dark': '#924A53',
      },
    },
  },
  plugins: [],
}
