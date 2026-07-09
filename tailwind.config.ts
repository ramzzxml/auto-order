import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dfe9ff",
          200: "#c0d3ff",
          300: "#93b2ff",
          400: "#5f87ff",
          500: "#3a5eff",
          600: "#2540f2",
          700: "#1e31d6",
          800: "#1f2ba8",
          900: "#1f2984",
          950: "#161a4d"
        }
      }
    }
  },
  plugins: []
};

export default config;
