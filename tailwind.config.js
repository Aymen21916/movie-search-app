module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0d253f",
        'primary-dark': "#091c2e",
        secondary: "#01b4e4",
        'secondary-dark': "#0099c7",
        tertiary: "#90cea1",
        'tertiary-dark': "#7ab68e",
      }
    },
  },
  plugins: [],
}