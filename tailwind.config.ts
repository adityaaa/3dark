import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#05070B",
        "bg-soft": "#0B0F18",
        neon: "#C3FF3C",
        cyan: "#53E9FF",
        magenta: "#FF2F92"
      },
      boxShadow: {
        glow: "0 0 40px rgba(195,255,60,0.35)"
      }
    }
  },
  plugins: []
};

export default config;
