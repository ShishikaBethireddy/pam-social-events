import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // ----- Typography -------------------------------------------------
      // Map every utility a designer-author might reach for to the RCD
      // typefaces. `font-serif` is intentionally aliased to Isabella Grand
      // (instead of Cormorant) so existing components that use `font-serif`
      // pick up the brand title face automatically.
      // Mirrors the pam-brides Nobu Weddings prototype:
      //   sans  = Poppins   (UI + body)
      //   serif = Cormorant Garamond  (editorial, italic-friendly)
      //   display = Playfair Display  (large display headlines)
      // Isabella Grand stays in the cascade as a back-compat fallback.
      fontFamily: {
        sans: [
          "Poppins",
          "Inter",
          "Helvetica Neue",
          "system-ui",
          "sans-serif",
        ],
        serif: [
          "Cormorant Garamond",
          "Isabella Grand",
          "Playfair Display",
          "serif",
        ],
        title: [
          "Cormorant Garamond",
          "Isabella Grand",
          "Playfair Display",
          "serif",
        ],
        "title-plain": [
          "Cormorant Garamond",
          "Isabella Grand Plain",
          "serif",
        ],
        display: [
          "Playfair Display",
          "Cormorant Garamond",
          "Isabella Grand",
          "serif",
        ],
      },

      // ----- Colors -----------------------------------------------------
      // Two-layer palette:
      //   1. shadcn semantic aliases (`primary`, `accent`, `muted` …) —
      //      driven by HSL CSS vars defined in src/index.css.
      //   2. RCD direct names (`ink`, `copper`, `canvas`, `cream` …) —
      //      sourced straight from the rcd-tokens.css hex variables so
      //      new components can write `bg-ink`, `text-copper`, etc.
      colors: {
        // shadcn aliases
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          foreground: "hsl(var(--gold-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        // RCD direct palette
        ink: {
          DEFAULT: "var(--color-ink)",
          soft: "var(--color-ink-soft)",
          muted: "var(--color-ink-muted)",
        },
        paper: "var(--color-paper)",
        canvas: "var(--color-canvas)",
        cream: {
          DEFAULT: "var(--color-cream)",
          soft: "var(--color-cream-soft)",
        },
        copper: {
          DEFAULT: "var(--color-copper)",
          hover: "var(--color-copper-hover)",
          active: "var(--color-copper-active)",
          soft: "var(--color-copper-soft)",
        },
        // Cabo sunset — used on the "Social Events · Nobu Hotels" brand
        // ribbon at the top of every header. Pair with `bg-sunset-gradient`
        // for the editorial three-stop gradient (twilight → plum → rose),
        // or stick to a single solid for tighter UI moments.
        sunset: {
          DEFAULT: "var(--color-sunset)",
          hover: "var(--color-sunset-hover)",
          soft: "var(--color-sunset-soft)",
          dawn: "var(--color-sunset-dawn)",
          plum: "var(--color-sunset-plum)",
          rose: "var(--color-sunset-rose)",
        },
        disabled: {
          bg: "var(--color-disabled-bg)",
          fg: "var(--color-disabled-fg)",
        },
        "border-strong": "var(--color-border-strong)",
        "border-default": "var(--color-border-default)",
        "border-subtle": "var(--color-border-subtle)",
        "border-muted": "var(--color-border-muted)",
        "border-brand": "var(--color-border-brand)",

        // ----- PAM Partner Portal (agent prototype) -----------------------
        // Ported from the pam-brides agent flow, re-themed to the Social
        // Events purple/ink palette. Drives `bg-surface-*`, `text-text-*`,
        // `bg-action-*` used across the src/components/agent/* tree.
        surface: {
          page: "var(--color-surface-page)",
          default: "var(--color-surface-default)",
          subtle: "var(--color-surface-subtle)",
          brand: "var(--color-surface-brand)",
          feature: "var(--color-surface-feature)",
          inverse: "var(--color-surface-inverse)",
          tinted: "var(--color-surface-tinted)",
          overlay: "var(--color-surface-overlay)",
          editorial: "var(--color-surface-editorial)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
          inverse: "var(--color-text-inverse)",
          "inverse-secondary": "var(--color-text-inverse-secondary)",
          brand: "var(--color-text-brand)",
          disabled: "var(--color-text-disabled)",
        },
        action: {
          primary: "var(--color-action-primary)",
          "primary-hover": "var(--color-action-primary-hover)",
          "primary-text": "var(--color-action-primary-text)",
          secondary: "var(--color-action-secondary)",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        pill: "var(--radius-pill)",
      },

      boxShadow: {
        rcd: "var(--shadow-md)",
        "rcd-sm": "var(--shadow-sm)",
        "rcd-lg": "var(--shadow-lg)",
      },

      transitionTimingFunction: {
        rcd: "var(--ease-out)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "toast-in": {
          from: { opacity: "0", transform: "translateX(-50%) translateY(-12px)" },
          to: { opacity: "1", transform: "translateX(-50%) translateY(0)" },
        },
        "notebook-expand": {
          from: { opacity: "0", maxHeight: "0" },
          to: { opacity: "1", maxHeight: "640px" },
        },
        "bubble-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "loader-shimmer": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(450%)" },
        },
        "dot-pulse": {
          "0%, 80%, 100%": { opacity: "0.25", transform: "scale(0.8)" },
          "40%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "toast-in": "toast-in 0.25s ease-out",
        "notebook-expand": "notebook-expand 0.22s ease-out",
        "bubble-in": "bubble-in 0.32s ease-out",
        "loader-shimmer": "loader-shimmer 1.8s ease-in-out infinite",
        "dot-pulse": "dot-pulse 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
