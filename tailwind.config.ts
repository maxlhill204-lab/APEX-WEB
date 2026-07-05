import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        surface: "#111111",
        surface2: "#171717",
        line: "rgba(255,255,255,0.1)",
        gold: "#D4AF37",
        blue: "#3B82F6",
      },
      boxShadow: {
        glow: "0 0 60px rgba(212, 175, 55, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;
