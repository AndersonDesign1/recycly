/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Your custom theme extensions can go here
      // The main configuration is now in your CSS file
    },
  },
  plugins: [],
  // Tailwind v4 configuration
  future: {
    hoverOnlyWhenSupported: true,
  },
}
