/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-purple': 'rgb(var(--brand-purple) / <alpha-value>)',
        'brand-teal': 'rgb(var(--brand-teal) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}