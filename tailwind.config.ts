import type { Config } from "tailwindcss";

/**
 * Tailwind theme is wired to CSS variables defined in styles/tokens.css.
 * SSoT for design decisions: DESIGN.md
 */
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Material anchors
        asphalt: "var(--asphalt)",
        concrete: "var(--concrete)",
        paper: "var(--paper)",

        // Neutral ramp
        neutral: {
          0: "var(--neutral-0)",
          50: "var(--neutral-50)",
          100: "var(--neutral-100)",
          150: "var(--neutral-150)",
          200: "var(--neutral-200)",
          250: "var(--neutral-250)",
          300: "var(--neutral-300)",
          400: "var(--neutral-400)",
          450: "var(--neutral-450)",
          500: "var(--neutral-500)",
          600: "var(--neutral-600)",
          700: "var(--neutral-700)",
          800: "var(--neutral-800)",
          850: "var(--neutral-850)",
          900: "var(--neutral-900)",
          950: "var(--neutral-950)",
        },

        // Signals
        signal: {
          positive: "var(--signal-positive)",
          caution: "var(--signal-caution)",
          critical: "var(--signal-critical)",
          info: "var(--signal-info)",
        },

        // Accent
        hazard: {
          DEFAULT: "var(--hazard)",
          deep: "var(--hazard-deep)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
        },

        // Semantic aliases
        surface: {
          page: "var(--surface-page)",
          raised: "var(--surface-raised)",
          sunken: "var(--surface-sunken)",
          card: "var(--surface-card)",
          inverse: "var(--surface-inverse)",
        },
        ink: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          disabled: "var(--text-disabled)",
          "on-inverse": "var(--text-on-inverse)",
        },
        line: {
          strong: "var(--border-strong)",
          DEFAULT: "var(--border-default)",
          subtle: "var(--border-subtle)",
          divider: "var(--divider)",
        },
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        mono: "var(--font-mono)",
        jp: "var(--font-jp)",
      },
      fontSize: {
        "3xs": "var(--size-3xs)",
        "2xs": "var(--size-2xs)",
        xs: "var(--size-xs)",
        sm: "var(--size-sm)",
        md: "var(--size-md)",
        base: "var(--size-md)",
        lg: "var(--size-lg)",
        xl: "var(--size-xl)",
        "2xl": "var(--size-2xl)",
        "3xl": "var(--size-3xl)",
        "4xl": "var(--size-4xl)",
        "5xl": "var(--size-5xl)",
        "6xl": "var(--size-6xl)",
      },
      lineHeight: {
        tight: "var(--leading-tight)",
        snug: "var(--leading-snug)",
        normal: "var(--leading-normal)",
        relaxed: "var(--leading-relaxed)",
      },
      letterSpacing: {
        tight: "var(--tracking-tight)",
        snug: "var(--tracking-snug)",
        wide: "var(--tracking-wide)",
        wider: "var(--tracking-wider)",
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        7: "var(--space-7)",
        8: "var(--space-8)",
        9: "var(--space-9)",
        10: "var(--space-10)",
        11: "var(--space-11)",
      },
      maxWidth: {
        prose: "var(--container-prose)",
        narrow: "var(--container-narrow)",
        content: "var(--container-content)",
        wide: "var(--container-wide)",
      },
      borderRadius: {
        none: "0",
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        DEFAULT: "var(--radius-md)",
        lg: "var(--radius-lg)",
        pill: "var(--radius-pill)",
      },
      borderWidth: {
        DEFAULT: "1px",
        thick: "var(--border-thick)",
        rule: "var(--border-rule)",
      },
      boxShadow: {
        none: "none",
        hard: "var(--shadow-hard)",
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
        out: "var(--ease-out)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
