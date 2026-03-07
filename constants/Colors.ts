export const Colors = {
  bg: {
    DEFAULT: "#FAFAF8",
    surface: "#FFFFFF",
    elevated: "#F5F2EC",
    overlay: "rgba(20, 16, 12, 0.52)",
  },
  border: {
    DEFAULT: "#E8E2D9",
    subtle: "#F0EBE2",
    strong: "#C8BFB4",
  },
  text: {
    DEFAULT: "#1C1917",
    secondary: "#6B6360",
    tertiary: "#A8A09A",
    quaternary: "#C4BCB5",
    inverse: "#FAFAF8",
  },
  brand: {
    DEFAULT: "#C8481C",
    hover: "#B83D14",
    light: "#FCE9E2",
    muted: "#F5D0C0",
    50: "#FFF5F2",
  },
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
  chat: {
    userBubble: "#1C1917",
    userText: "#F5F2EC",
  },
} as const;

export type ColorToken = typeof Colors;
