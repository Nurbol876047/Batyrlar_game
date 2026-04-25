import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "rgba(255,255,255,0.1)",
        input: "rgba(255,255,255,0.08)",
        ring: "#f3c46a",
        background: "#07101d",
        foreground: "#f8f1df",
        primary: {
          DEFAULT: "#efc56d",
          foreground: "#0b1321",
        },
        secondary: {
          DEFAULT: "#163247",
          foreground: "#f7e7be",
        },
        muted: {
          DEFAULT: "#111c2d",
          foreground: "#b7c7d9",
        },
        accent: {
          DEFAULT: "#34c3b3",
          foreground: "#07101d",
        },
        destructive: {
          DEFAULT: "#f26d6d",
          foreground: "#fff2df",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-body)"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      backgroundImage: {
        "steppe-glow":
          "radial-gradient(circle at top, rgba(239,197,109,0.18), transparent 35%), radial-gradient(circle at 20% 20%, rgba(52,195,179,0.16), transparent 30%), linear-gradient(180deg, #07101d 0%, #0a1728 35%, #132138 68%, #0b1321 100%)",
        "panel-sheen":
          "linear-gradient(140deg, rgba(255,255,255,0.16), rgba(255,255,255,0.03) 30%, rgba(255,255,255,0.02) 60%, rgba(52,195,179,0.08))",
      },
      boxShadow: {
        glow: "0 20px 70px rgba(239,197,109,0.18)",
        deep: "0 30px 80px rgba(0,0,0,0.35)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        drift: "drift 18s linear infinite",
        "pulse-soft": "pulse-soft 4s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        drift: {
          from: { transform: "translateX(-8%)" },
          to: { transform: "translateX(8%)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
