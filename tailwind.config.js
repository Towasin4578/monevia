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
        brand: {
          navy: '#142D4E',
          'navy-dark': '#0B1B30',
          'navy-light': '#1E3E6B',
          blue: '#3563E9',
          'blue-hover': '#2B50C7',
          'blue-light': '#EEF2FF',
          emerald: '#16A36A',
          'emerald-light': '#ECFDF5',
          teal: '#0F9D8A',
          'teal-light': '#E6F8F6',
          bg: '#F5F7FB',
          'bg-dark': '#0B132B',
          'card-dark': '#111C38',
          'border-dark': '#1E2D4A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Bengali', 'sans-serif'],
        bengali: ['Noto Sans Bengali', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(20, 45, 78, 0.05)',
        'card': '0 4px 20px -2px rgba(20, 45, 78, 0.07)',
        'elevated': '0 10px 30px -5px rgba(20, 45, 78, 0.12)',
      },
    },
  },
  plugins: [],
}
