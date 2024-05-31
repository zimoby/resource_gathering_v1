
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        uitext: 'var(--color-uitext)',
        uilines: 'var(--color-uilines)',
      },
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