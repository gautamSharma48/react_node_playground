/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {},
    fontFamily: {
      PoppinsMedium: ["Poppins-Medium", "sans-serif"],
    },
    fontSize: {
      "ft12-21": ["12px", "21px"],
      "ft13-15.85-0.26": [
        "13px",
        { lineHeight: "15.85px", letterSpacing: "-0.26px" },
      ],
    },
    extend: {
      spacing: {},
    },
  },
  plugins: [],
};
