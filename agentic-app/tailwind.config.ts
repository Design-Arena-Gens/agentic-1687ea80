import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-jetbrains)", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        midnight: "#05060f",
        "midnight-700": "#0a0f1f",
        "midnight-500": "#141c33",
        "midnight-300": "#2c3657",
        "electric-pink": "#ff6fd8",
        "electric-blue": "#38bdf8",
        "electric-violet": "#8b5cf6",
        "electric-cyan": "#22d3ee",
        "electric-lime": "#a7f3d0",
        "glass-white": "rgba(255,255,255,0.08)",
      },
      backgroundImage: {
        "grid-glow":
          "linear-gradient(115deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 35%, transparent 70%), radial-gradient(circle at 20% 20%, rgba(255,255,255,0.16), transparent 45%), radial-gradient(circle at 80% 0%, rgba(56,189,248,0.35), transparent 55%)",
        "noise-texture": "url('/textures/noise.png')",
      },
      boxShadow: {
        "glow-sm": "0 10px 40px rgba(168, 85, 247, 0.25)",
        "glow-md": "0 25px 70px rgba(59, 130, 246, 0.35)",
        "glow-lg": "0 40px 120px rgba(244, 114, 182, 0.4)",
      },
      keyframes: {
        "slow-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "hero-blob": {
          "0%, 100%": { transform: "translate3d(0px,0px,0px) scale(1)" },
          "25%": { transform: "translate3d(12px,-18px,0px) scale(1.05)" },
          "50%": { transform: "translate3d(-10px,10px,0px) scale(0.97)" },
          "75%": { transform: "translate3d(18px,4px,0px) scale(1.08)" },
        },
      },
      animation: {
        "slow-spin": "slow-spin 18s linear infinite",
        "hero-blob": "hero-blob 24s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
