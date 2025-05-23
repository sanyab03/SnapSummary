/** @type {import('tailwindcss').Config} */
export default {
  darkMode:'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        secularone: ["Secular One", "sans-serif"],
        inter: ["Inter", "sans-serif"]
      },
      backgroundImage: {
        'homebg': "url('/assets/bg.jpg')",
      },
    },
  },
  plugins: [],
}

