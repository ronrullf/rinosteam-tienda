import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        barlow: ['Barlow Condensed', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        'bg-base': '#080402',
        'bg-surface': '#130A04',
        'bg-elevated': '#1F1008',
        'bg-modal': '#0D0703',
        'orange-brand': '#F97316',
        'orange-hover': '#EA580C',
        'orange-light': '#FB923C',
        gold: '#F59E0B',
        'gold-light': '#FCD34D',
        'text-warm': '#C9A882',
        'text-muted-warm': '#7A5A3A',
      },
      maxWidth: {
        mobile: '430px',
      },
      borderRadius: {
        card: '12px',
      },
      animation: {
        'pulse-orange': 'pulse-orange 3s ease-in-out infinite',
        shine: 'shine 2s linear infinite',
      },
      keyframes: {
        'pulse-orange': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(249,115,22,0.25)' },
          '50%': { boxShadow: '0 0 0 8px transparent' },
        },
        shine: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}

export default config
