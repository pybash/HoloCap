import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin")

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }: {matchUtilities: any, theme: any}) {
      matchUtilities(
        {
          'animate-delay': (value: any) => ({
            animationDelay: value,
          }),
        },
        { values: theme('transitionDelay') }
      )
    })
  ],
} satisfies Config;
