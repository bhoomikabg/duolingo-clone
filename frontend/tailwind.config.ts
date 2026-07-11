import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Duolingo design system
        duo: {
          green: '#58cc02',
          'green-dark': '#46a302',
          'green-light': '#89e219',
          'green-bg': '#d7ffb8',
          blue: '#1cb0f6',
          'blue-dark': '#0d8ecf',
          'blue-bg': '#ddf4ff',
          red: '#ff4b4b',
          'red-dark': '#ea2b2b',
          'red-bg': '#ffdfe0',
          orange: '#ff9600',
          'orange-dark': '#e08600',
          yellow: '#ffc800',
          purple: '#ce82ff',
          'purple-dark': '#a560e8',
          gray: '#afafaf',
          'gray-dark': '#777777',
          'gray-light': '#e5e5e5',
          'gray-bg': '#f7f7f7',
          white: '#ffffff',
          dark: '#3c3c3c',
          'border-gray': '#e5e5e5',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'Nunito', 'sans-serif'],
      },
      boxShadow: {
        'duo': '0 4px 0 0',
        'duo-sm': '0 2px 0 0',
        'duo-lg': '0 6px 0 0',
        'node': '0 4px 0 rgba(0,0,0,0.2)',
        'node-green': '0 4px 0 #46a302',
        'node-gray': '0 4px 0 #afafaf',
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
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
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-green': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(88, 204, 2, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(88, 204, 2, 0)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.85)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'pulse-green': 'pulse-green 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'fade-in-up': 'fade-in-up 0.4s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
