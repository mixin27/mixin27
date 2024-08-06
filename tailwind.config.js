/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        '33p': '33.33%',
      },
      flex: {
        '0': '0 0 100%',
        '33p': '0 0 33.33%',
      },
      colors: {
        'pj': '#f5f8fd',
        'overlay': '#00000099',
      },
      borderRadius: {
        'half': '50%',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
