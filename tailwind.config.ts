/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: ({ colors }) => ({
        inherit: colors.inherit,
        current: colors.current,
        transparent: "transparent",
        black: "#22292F",
        white: "#fff",
        "smoke-light": "rgba(0, 0, 0, 0.4)",

        foreground: "var(--foreground)",
        background: "var(--background)",
        card: "var(--card)",
        "card-border": "var(--card-border)",

        primary: {
          20: "#CCFCFF",
          30: "#B0F9FE",
          40: "#61F0FE",
          50: "#1ADEF5",
          60: "#03C1DB",
          70: "#019AB8",
          90: "#112C35",
        },
        gray: {
          50: "#808B9B",
          60: "#4B5565",
          70: "#202E3C",
          80: "#151E27",
          90: "#101820",
          100: "#0C131B",
          200: "#EEEEEE",
          300: "#E0E0E0",
          400: "#BDBDBD",
          500: "#9E9E9E",
          DEFAULT: "#9E9E9E",
          600: "#757575",
          700: "#616161",
          800: "#424242",
          900: "#212121",
          A100: "#D5D5D5",
          A200: "#AAAAAA",
          A400: "#303030",
          A700: "#616161",
        },
        error: {
          40: "#F97066",
          90: "#381D1E",
        },
        success: {
          40: "#47CD89",
          90: "#11322D",
        },
        warning: {
          40: "#CDA747",
          90: "#322D11",
        },
      }),
      fontSize: {
        10: "10px",
        12: "12px",
        14: "14px",
        16: "16px",
        18: "18px",
        20: "20px",
        24: "24px",
        28: "28px",
        32: "32px",
        35: "35px",
        40: "40px",
        48: "48px",
        64: "64px",
      },
      fontFamily: {
        space: ["Space Grotesk", "sans-serif"],
        sans: [
          "Inter var",
          "Roboto",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans"',
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        serif: [
          "ui-serif",
          "Georgia",
          "Cambria",
          '"Times New Roman"',
          "Times",
          "serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          "monospace",
        ],
      },
    },
  },
};
