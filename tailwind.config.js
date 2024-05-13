
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "2xs": ".65rem",
        "3xs": ".5rem",
        "4xs": ".4rem"
      },
      keyframes: {
        "linear-move": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-out": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
          // "0%": { opacity: 1, transform: "perspective(20px) translateZ(0)" },
          // "100%": { opacity: 0, transform: "perspective(20px) translateZ(-100px)" },
        }
      },
      animation: {
        "linear": "linear-move 10s linear infinite",
        "fadeOut": "fade-out 1s ease-out forwards"
      },
    },
  },
  plugins: [],
}