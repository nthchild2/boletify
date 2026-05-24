const path = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(__dirname, "apps/**/*.{js,jsx,ts,tsx}"),
    path.join(__dirname, "packages/**/*.{js,jsx,ts,tsx}"),
  ],
  presets: [require("nativewind/preset")],
  // Dark mode is opt-in via the `.dark` class applied to the root element.
  // ThemeProviders (web + native) toggle this class based on user preference
  // (light / dark / system). Light is the Tailwind default; `dark:` variants
  // override for dark mode.
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ---------------------------------------------------------------
        // SEMANTIC TOKENS — these flip with the active theme via CSS vars
        // defined in apps/web/styles/global.css and apps/native/tailwind.css.
        // Use these for new code: bg-bg, text-fg, border-border, etc.
        // The literal tokens below (ink-, bone-, signal-, ...) are preserved
        // for backwards compatibility and for places where the brand color
        // should NOT change between themes (e.g. signal-lime always lime).
        // ---------------------------------------------------------------

        // Surfaces
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-raised": "rgb(var(--color-surface-raised) / <alpha-value>)",
        "surface-sunken": "rgb(var(--color-surface-sunken) / <alpha-value>)",

        // Foreground / text
        fg: "rgb(var(--color-fg) / <alpha-value>)",
        "fg-secondary": "rgb(var(--color-fg-secondary) / <alpha-value>)",
        "fg-muted": "rgb(var(--color-fg-muted) / <alpha-value>)",
        "fg-subtle": "rgb(var(--color-fg-subtle) / <alpha-value>)",

        // Borders
        border: "rgb(var(--color-border) / <alpha-value>)",
        "border-strong": "rgb(var(--color-border-strong) / <alpha-value>)",
        // Load-bearing brutal border — always ink-1000 in both themes.
        "border-ink": "rgb(var(--color-border-ink) / <alpha-value>)",

        // Primary CTA — flips between signal-on-ink (dark) and ink-on-bone (light)
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "primary-fg": "rgb(var(--color-primary-fg) / <alpha-value>)",
        "primary-hover": "rgb(var(--color-primary-hover) / <alpha-value>)",
        "primary-pressed": "rgb(var(--color-primary-pressed) / <alpha-value>)",

        // Accent — Rosa Mexicano. Slightly deeper hue in light for AA contrast.
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-fg": "rgb(var(--color-accent-fg) / <alpha-value>)",
        "accent-hover": "rgb(var(--color-accent-hover) / <alpha-value>)",

        // States
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        "danger-fg": "rgb(var(--color-danger-fg) / <alpha-value>)",
        "danger-hover": "rgb(var(--color-danger-hover) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        info: "rgb(var(--color-info) / <alpha-value>)",

        // Inverse — used by elements that flip ground (e.g. brick-shadow CTA
        // which is dark fill on light page, light fill on dark page).
        inverse: "rgb(var(--color-inverse) / <alpha-value>)",
        "inverse-fg": "rgb(var(--color-inverse-fg) / <alpha-value>)",

        // ---------------------------------------------------------------
        // LITERAL TOKENS (Ánima Nocturna palette) — preserved as-is.
        // ---------------------------------------------------------------
        ink: {
          50: '#E4E4EB',
          100: '#E4E4EB',
          200: '#C2C2D0',
          300: '#9B9BB3',
          400: '#787891',
          500: '#55556A',
          600: '#2E2E3E',
          700: '#2E2E3E',
          800: '#1F1F2B',
          850: '#161620',
          900: '#0F0F15',
          950: '#08080C',
          1000: '#000000',
        },
        bone: {
          50: '#F6F2EA',
          100: '#EFE9DC',
        },
        signal: {
          400: '#D7FF3A',
          500: '#C6FF2E',
          600: '#9FE600',
          900: '#2B3300',
        },
        rosa: {
          400: '#FF6AA9',
          500: '#FF2E88',
          600: '#D6005F',
        },
        oxblood: {
          400: '#A32438',
          500: '#7A1020',
        },
        leaf: {
          400: '#55EBA6',
          500: '#20D987',
        },
        sun: {
          400: '#FFB85C',
          500: '#FF9E00',
        },
        cenote: {
          500: '#00B3C7',
        },
      },

      // Translucent surfaces (alpha is part of the token, no opacity modifier)
      backgroundColor: {
        'glass-tint': 'var(--color-glass-tint)',
        'nav-tint': 'var(--color-nav-tint)',
      },
      borderColor: {
        'glass-edge': 'var(--color-glass-edge)',
      },

      backgroundImage: {
        // Themeable mesh — defined in CSS so it swaps with the active theme.
        mesh: 'var(--bg-mesh)',
        'mesh-ambient': 'var(--bg-mesh-ambient)',

        // Static mesh utilities preserved for explicit dark/light usage.
        'mesh-gradient': 'radial-gradient(1200px 600px at 15% 10%, rgba(198,255,46,0.18), transparent 60%), radial-gradient(900px 700px at 85% 20%, rgba(255,46,136,0.22), transparent 55%), radial-gradient(800px 800px at 50% 110%, rgba(122,16,32,0.35), transparent 60%), #08080C',
        'mesh-gradient-light': 'radial-gradient(1200px 600px at 15% 10%, rgba(198,255,46,0.20), transparent 60%), radial-gradient(900px 700px at 85% 20%, rgba(255,46,136,0.18), transparent 55%), radial-gradient(800px 800px at 50% 110%, rgba(255,158,0,0.18), transparent 60%), #F4F4F8',
      },

      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['128px', { lineHeight: '112px', fontWeight: '900', letterSpacing: '-4%' }],
        'display-xl': ['96px', { lineHeight: '88px', fontWeight: '900', letterSpacing: '-3.5%' }],
        'display-lg': ['72px', { lineHeight: '68px', fontWeight: '850', letterSpacing: '-3%' }],
        'display-md': ['56px', { lineHeight: '56px', fontWeight: '800', letterSpacing: '-2.5%' }],
        'display-sm': ['40px', { lineHeight: '44px', fontWeight: '800', letterSpacing: '-2%' }],
        'heading-lg': ['32px', { lineHeight: '36px', fontWeight: '700', letterSpacing: '-1.5%' }],
        'heading-md': ['24px', { lineHeight: '30px', fontWeight: '700', letterSpacing: '-1%' }],
        'heading-sm': ['18px', { lineHeight: '24px', fontWeight: '600', letterSpacing: '-0.5%' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'label': ['13px', { lineHeight: '16px', fontWeight: '600', letterSpacing: '4%' }],
        'caption': ['12px', { lineHeight: '16px', fontWeight: '400', letterSpacing: '2%' }],
        'overline': ['11px', { lineHeight: '16px', fontWeight: '700', letterSpacing: '16%' }],
        'mono-md': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'mono-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],
      },
      spacing: {
        '0': '0',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      borderRadius: {
        '0': '0',
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '14px',
        'xl': '22px',
        '2xl': '28px',
        '3xl': '40px',
        'full': '9999px',
      },
      boxShadow: {
        // Brick shadows reference --color-brick so the brick stays black on
        // both bone (light) and ink (dark) page backgrounds — per docs §6.1.
        'brick-sm': '3px 3px 0 0 var(--color-brick)',
        'brick-md': '6px 6px 0 0 var(--color-brick)',
        'brick-lg': '10px 10px 0 0 var(--color-brick)',
        'brick-signal': '6px 6px 0 0 #C6FF2E',
        'brick-rosa': '6px 6px 0 0 #FF2E88',
        // Glass shadows are theme-aware: the inner catch-light gets stronger
        // on dark and softer on light. Outer drops adjust accordingly.
        'glass-sm': 'var(--shadow-glass-sm)',
        'glass-md': 'var(--shadow-glass-md)',
        'glass-lg': 'var(--shadow-glass-lg)',
        // Glow shadows — signal/rosa are constant; focus uses the signal hue.
        'glow-signal': '0 0 32px rgba(198,255,46,0.35), 0 0 64px rgba(198,255,46,0.15)',
        'glow-rosa': '0 0 32px rgba(255,46,136,0.35), 0 0 64px rgba(255,46,136,0.15)',
        'glow-focus': '0 0 0 2px #C6FF2E, 0 0 16px rgba(198,255,46,0.45)',
      },
      animation: {
        'marquee': 'marquee 28000ms linear infinite',
        'marquee-reverse': 'marquee-reverse 28000ms linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
      backdropBlur: {
        'glass-sm': '20px',
        'glass-md': '32px',
        'glass-lg': '40px',
      },
      transitionTimingFunction: {
        'motion-instant': 'linear',
        'motion-fast': 'cubic-bezier(0.2, 0, 0, 1)',
        'motion-base': 'cubic-bezier(0.2, 0, 0, 1)',
        'motion-expressive': 'cubic-bezier(0.34, 1.3, 0.64, 1)',
        'motion-stroll': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        'instant': '80ms',
        'fast': '120ms',
        'base': '220ms',
        'expressive': '420ms',
        'stroll': '720ms',
      },
    },
  },
  plugins: [],
};
