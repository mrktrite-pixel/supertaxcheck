import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // font-serif → Playfair Display (headings, authority)
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        // font-sans → DM Sans (body, UI)
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        // font-mono → DM Mono (badges, labels, law citations)
        mono: ["var(--font-dm-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
