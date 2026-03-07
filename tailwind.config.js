/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        /* Backgrounds */
        bg: {
          DEFAULT: "#FAFAF8",
          surface: "#FFFFFF",
          elevated: "#F5F2EC",
          overlay: "rgba(20,16,12,0.52)",
        },
        /* Borders */
        border: {
          DEFAULT: "#E8E2D9",
          subtle: "#F0EBE2",
          strong: "#C8BFB4",
        },
        /* Text */
        text: {
          DEFAULT: "#1C1917",
          2: "#6B6360",
          3: "#A8A09A",
          4: "#C4BCB5",
          inv: "#FAFAF8",
        },
        /* Brand: warm terracotta */
        brand: {
          DEFAULT: "#C8481C",
          hover: "#B83D14",
          light: "#FCE9E2",
          muted: "#F5D0C0",
          50: "#FFF5F2",
        },
        /* Semantic */
        success: {
          DEFAULT: "#15803D",
          bg: "#F0FDF4",
        },
        warning: {
          DEFAULT: "#B45309",
          bg: "#FFFBEB",
        },
        info: {
          DEFAULT: "#1D4ED8",
          bg: "#EFF6FF",
        },
        /* Chat */
        "user-bubble": "#1C1917",
        "user-text": "#F5F2EC",
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        full: "9999px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(28,25,23,0.06)",
        sm: "0 1px 3px rgba(28,25,23,0.08), 0 1px 2px rgba(28,25,23,0.04)",
        md: "0 4px 12px rgba(28,25,23,0.1), 0 2px 4px rgba(28,25,23,0.04)",
        lg: "0 8px 24px rgba(28,25,23,0.12), 0 4px 8px rgba(28,25,23,0.06)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
