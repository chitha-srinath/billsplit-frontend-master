/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        accent: "#f59e0b",
        background: "#f3f4f6",
        text: "#1f2937",
      },
    },
  },
  plugins: [require("tailwindcss-motion")],
};
