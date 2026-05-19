import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ffx: {
          bg: "#070B14",
          panel: "#111827",
          purple: "#7C3AED",
          blue: "#00E5FF",
          pink: "#FF0080",
          cyan: "#22D3EE",
          muted: "#94A3B8"
        }
      },
      boxShadow: {
        neon: "0 0 32px rgba(34,211,238,.25), 0 0 64px rgba(255,0,128,.12)",
        purple: "0 0 36px rgba(124,58,237,.24)"
      },
      animation: {
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "particle-float": "particleFloat 12s linear infinite"
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(34,211,238,.18)" },
          "50%": { boxShadow: "0 0 42px rgba(255,0,128,.25)" }
        },
        particleFloat: {
          "0%": { transform: "translate3d(0, 0, 0)", opacity: ".35" },
          "50%": { opacity: ".85" },
          "100%": { transform: "translate3d(24px, -90px, 0)", opacity: ".2" }
        }
      }
    }
  },
  plugins: []
};

export default config;
