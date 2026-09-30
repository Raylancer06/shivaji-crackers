import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7A121D",
          dark: "#520A10",
          light: "#A31D2A",
          deep: "#3D060B",
        },
        secondary: {
          DEFAULT: "#B85D00",
          dark: "#8C4300",
          light: "#E07B18",
        },
        festive: {
          gold: "#D4972B",
          goldLight: "#F2B84B",
          goldDark: "#9E6D18",
          marigold: "#FFF8ED",
          crimson: "#9E1C24",
          green: "#0B8043",
          greenDark: "#07542C",
        },
        heritage: {
          maroon: "#550C12",
          crimson: "#7B141C",
          gold: "#C98E2A",
          goldBright: "#F0B543",
          parchment: "#FBF7F0",
          sand: "#F2EBE0",
          border: "#E2D7C5",
          ink: "#1C1411",
          muted: "#66574F",
        },
      },
      fontFamily: {
        sans: ['"Mona Sans Variable"', '"Mona Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Mona Sans Variable"', '"Mona Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Mona Sans Variable"', '"Mona Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mona: ['"Mona Sans Variable"', '"Mona Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'regal': '0 10px 30px -5px rgba(85, 12, 18, 0.12), 0 4px 10px -2px rgba(85, 12, 18, 0.06)',
        'gold-glow': '0 0 25px -3px rgba(212, 151, 43, 0.35)',
        'deep': '0 20px 40px -15px rgba(28, 20, 17, 0.2)',
      },
    },
  },
  plugins: [],
};
export default config;
