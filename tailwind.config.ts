import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#24123F",
        rice: "#0B0B2E",
        gold: "#FFBE4D",
        moss: "#C83BFF",
        mossSoft: "#5FA8FF",
        ink: "#FFFFFF",
        warmGray: "#C9BBD8"
      },
      boxShadow: {
        app: "0 26px 70px rgba(10, 6, 36, 0.55)",
        soft: "0 14px 36px rgba(200, 59, 255, 0.18)"
      },
      borderRadius: {
        app: "24px"
      }
    }
  },
  plugins: []
};

export default config;
