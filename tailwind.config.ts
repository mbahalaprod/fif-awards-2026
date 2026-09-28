import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        background: {
          primary: 'var(--background-primary)',
          secondary: 'var(--background-secondary)',
        },
        gold: {
          DEFAULT: 'var(--accent-gold)',
          light: 'var(--accent-gold-light)',
        },
        bordeaux: 'var(--accent-red)',
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
        border: 'var(--border-color)',

        // shadcn aliases (re-mapped to our dark theme)
        input: 'var(--border-color)',
        ring: 'var(--accent-gold)',
        foreground: 'var(--text-primary)',
        primary: {
          DEFAULT: 'var(--accent-gold)',
          foreground: 'var(--background-primary)',
        },
        secondary: {
          DEFAULT: 'var(--background-secondary)',
          foreground: 'var(--text-primary)',
        },
        muted: {
          DEFAULT: 'var(--background-secondary)',
          foreground: 'var(--text-secondary)',
        },
        accent: {
          DEFAULT: 'var(--accent-gold)',
          foreground: 'var(--background-primary)',
        },
        destructive: {
          DEFAULT: 'var(--accent-red)',
          foreground: 'var(--text-primary)',
        },
        card: {
          DEFAULT: 'var(--background-secondary)',
          foreground: 'var(--text-primary)',
        },
        popover: {
          DEFAULT: 'var(--background-secondary)',
          foreground: 'var(--text-primary)',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'marquee': 'marquee 40s linear infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, var(--accent-gold-light) 0%, var(--accent-gold) 100%)',
        'gradient-dark': 'linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.9) 80%, rgba(10,10,10,1) 100%)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
