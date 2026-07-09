/** @type {import('tailwindcss').Config} */
const withOpacity = (variable) => `rgb(var(${variable}) / <alpha-value>)`;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./node_modules/flowbite-react/**/*.js",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Sora'", "'DM Sans'", "sans-serif"],
        body: ["'Inter'", "'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        // --- Semantic, theme-aware tokens (defined in index.css) ---
        canvas: withOpacity("--bg"),
        surface: withOpacity("--surface"),
        elevated: withOpacity("--elevated"),
        line: withOpacity("--border"),
        fg: {
          DEFAULT: withOpacity("--fg"),
          muted: withOpacity("--fg-muted"),
          subtle: withOpacity("--fg-subtle"),
        },
        primary: {
          DEFAULT: withOpacity("--primary"),
          fg: withOpacity("--primary-fg"),
          hover: withOpacity("--primary-hover"),
          soft: withOpacity("--primary-soft"),
        },

        // --- Indigo/violet accent scale (brand-* keeps working everywhere) ---
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        // Kept so any stray references still resolve; mapped to neutral darks.
        dark: {
          900: "#0b0c14",
          800: "#12131c",
          700: "#1a1c28",
          600: "#242636",
          500: "#2e3145",
        },
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse at 25% 20%, rgb(var(--primary) / 0.18) 0%, transparent 55%), radial-gradient(ellipse at 85% 80%, rgb(var(--accent-2) / 0.16) 0%, transparent 55%)",
        "card-gradient":
          "linear-gradient(135deg, rgb(var(--fg) / 0.04) 0%, rgb(var(--fg) / 0.01) 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
        "slide-right": "slideRight 0.5s ease forwards",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: "translateY(24px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideRight: {
          from: { opacity: 0, transform: "translateX(-24px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        glow: "0 0 40px rgb(var(--primary) / 0.28)",
        "glow-sm": "0 0 20px rgb(var(--primary) / 0.18)",
        card: "0 1px 2px rgb(15 18 30 / 0.04), 0 8px 24px rgb(15 18 30 / 0.06)",
        "card-lg": "0 2px 4px rgb(15 18 30 / 0.05), 0 18px 48px rgb(15 18 30 / 0.10)",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
  darkMode: "class",
};
