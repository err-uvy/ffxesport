import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ffx: {
          bg: "#020817",
          panel: "#111827",
          black: "#7C3AED",
          blue: "#00E5FF",
          pink: "#FF0080",
          blue: "#22D3EE",
          muted: "#94A3B8"
        }
      },
      boxShadow: {
        neon: "0 0 32px rgba(34,211,238,.22), 0 0 48px rgba(255,0,128,.12)"
      }
    }
  },
  plugins: []
};

export default config;
