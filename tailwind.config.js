/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // brand: '#FDFAF7',
        // 'brand-dark': '#924A53',
        // 'brand-light': '#f4e3df',
        // 'brand-text': '#3b1e1e',
        // 'brand-circle': '#f4e8df',

        'brand-dark': '#7A3E46',       // глубокий бордово-розовый (основной)
        'brand-light': '#C98B97',            // очень светлый фон сайта
        'brand': '#FAF4F4',      // розовый из логотипа (фон карточек, иконок)
        'brand-text': '#5E2B33',       // насыщенный цвет текста
        'accent': '#DCA2AF',           // мягкий акцент (например, теги)
        'cream': '#FDF8F7',            // фоновые блоки, секции

        'card': '#ebcbcb',           // цвет карточек
        'light-violet': '#c1a8ad', // цвет текста в карточках

      },
      keyframes: {
        fadeInScale: {
          '0%': { opacity: 0, transform: 'scale(0.8)' },
          '100%': { opacity: 0.4, transform: 'scale(1)' },
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeInScale: 'fadeInScale 1.2s ease-out',
          fadeInUp: "fadeInUp 0.8s ease-out forwards",
      },

    },
  },
  plugins: [],
}
