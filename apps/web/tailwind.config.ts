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
        background: "#050505",
        "background-secondary": "#0b0b0c",

        card: "#111111",
        "card-hover": "#171717",

        border: "#1f1f22",

        foreground: "#ffffff",
        muted: "#9ca3af",

        primary: {
          DEFAULT: "#0E5BFF",
          hover: "#1B67FF",
          soft: "rgba(14,91,255,0.12)"
        },

        success: "#22C55E",
        danger: "#EF4444",

        sidebar: "#090909"
      },

      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,0.35)",

        hover:
          "0 14px 40px rgba(0,0,0,0.45)",

        blue:
          "0 0 0 4px rgba(14,91,255,0.12)",

        subtle:
          "0 2px 10px rgba(0,0,0,0.18)"
      },

      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px"
      },

      backgroundImage: {
        dashboard:
          "linear-gradient(180deg,#050505 0%,#090909 100%)",

        card:
          "linear-gradient(180deg,#111111 0%,#0d0d0d 100%)",

        primary:
          "linear-gradient(135deg,#0E5BFF 0%,#2563EB 100%)"
      },

      keyframes: {
        fadeUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },

          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },

        shimmer: {
          "0%": {
            backgroundPosition: "-400px 0"
          },

          "100%": {
            backgroundPosition: "400px 0"
          }
        }
      },

      animation: {
        fadeUp:
          "fadeUp 0.35s ease",

        shimmer:
          "shimmer 1.3s linear infinite"
      }
    }
  },

  plugins: []
};

export default config;