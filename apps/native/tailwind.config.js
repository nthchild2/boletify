const path = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "../../packages/ui/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#E4E4EB",
          100: "#E4E4EB",
          200: "#C2C2D0",
          300: "#9B9BB3",
          400: "#787891",
          500: "#55556A",
          600: "#2E2E3E",
          700: "#2E2E3E",
          800: "#1F1F2B",
          850: "#161620",
          900: "#0F0F15",
          950: "#08080C",
          1000: "#000000",
        },
        bone: {
          50: "#F6F2EA",
          100: "#EFE9DC",
        },
        signal: {
          400: "#D7FF3A",
          500: "#C6FF2E",
          600: "#9FE600",
          900: "#2B3300",
        },
        rosa: {
          400: "#FF6AA9",
          500: "#FF2E88",
          600: "#D6005F",
        },
        oxblood: {
          400: "#A32438",
          500: "#7A1020",
        },
        leaf: {
          400: "#55EBA6",
          500: "#20D987",
        },
        sun: {
          400: "#FFB85C",
          500: "#FF9E00",
        },
        cenote: {
          500: "#00B3C7",
        },
      },
      fontFamily: {
        display: ["Bricolage Grotesque", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-2xl": "128px",
        "display-xl": "96px",
        "display-lg": "72px",
        "display-md": "56px",
        "display-sm": "40px",
        "heading-lg": "32px",
        "heading-md": "24px",
        "heading-sm": "18px",
        "body-lg": "18px",
        "body-md": "16px",
        "body-sm": "14px",
        label: "13px",
        caption: "12px",
        overline: "11px",
        "mono-md": "14px",
        "mono-sm": "12px",
      },
      boxShadow: {
        "brick-sm": "3px 3px 0 0 #000000",
        "brick-md": "6px 6px 0 0 #000000",
        "brick-lg": "10px 10px 0 0 #000000",
        "brick-signal": "6px 6px 0 0 #C6FF2E",
        "brick-rosa": "6px 6px 0 0 #FF2E88",
        "glass-sm":
          "0 1px 1px 0 rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)",
        "glass-md":
          "0 8px 24px -4px rgba(0,0,0,0.35), 0 2px 8px -2px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.10)",
        "glass-lg":
          "0 24px 64px -12px rgba(0,0,0,0.45), 0 8px 20px -4px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.12)",
        "glow-signal":
          "0 0 32px rgba(198,255,46,0.35), 0 0 64px rgba(198,255,46,0.15)",
        "glow-rosa":
          "0 0 32px rgba(255,46,136,0.35), 0 0 64px rgba(255,46,136,0.15)",
        "glow-focus":
          "0 0 0 2px #C6FF2E, 0 0 16px rgba(198,255,46,0.45)",
      },
      borderRadius: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "14px",
        xl: "22px",
        "2xl": "28px",
        "3xl": "40px",
      },
    },
  },
  plugins: [],
};
