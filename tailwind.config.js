/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          500: '#f97316',
          400: '#fb923c',
        },
        neutral: {
          950: '#0a0a0a',
          900: '#171717',
          800: '#262626',
          700: '#404040',
          600: '#525252',
          500: '#737373',
          400: '#a3a3a3',
          300: '#d4d4d4',
          200: '#e5e5e5',
          100: '#f5f5f5',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'squiggly': "url('/bg-squiggly-lines.svg')",
      },
      perspective: {
        '1200': '1200px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
