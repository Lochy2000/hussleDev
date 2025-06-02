/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        hustle: {
          900: '#0F0D17',
          800: '#1A1726',
          700: '#2B2640',
          600: '#3D3459',
          500: '#564680',
          400: '#7562A9',
          300: '#9D8CDC',
          200: '#C4B9F2',
          100: '#E5DFFF',
        },
        neon: {
          purple: '#b14aed',
          blue: '#4a7ced',
          cyan: '#4aedc8',
        },
        dark: {
          900: '#121217',
          800: '#1E1E27',
          700: '#2A2A38',
          600: '#363648',
          500: '#4C4C65',
          400: '#6E6E8C',
          300: '#9090A9',
          200: '#B5B5C6',
          100: '#DCDCE4',
        },
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'grain': "url('/grain.png')",
      },
    },
  },
  plugins: [],
};