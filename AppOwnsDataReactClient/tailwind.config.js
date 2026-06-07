/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App/**/*.{ts,tsx,html}",
    "./App/index.html",
  ],
  theme: {
    extend: {
      colors: {
        themedred: "#D62126",
        themednavyblue_200: "#080C14",
        themednavyblue: "#0C1421",
        themedgrey: "#7084A0",
        brand: {
          DEFAULT: "#607D8B",
          dark: "#455A64",
        },
        nav: "#F3F2F1",
      },
      backgroundImage: {
        // Banner / section headers
        "brand-gradient": "linear-gradient(to bottom, #607D8B, #455A64, #607D8B)",
        // Report breadcrumb bar
        "path-gradient": "linear-gradient(to bottom, #444444, #222222, #000000, #222222, #444444)",
      },
    },
  },
  plugins: [],
};
