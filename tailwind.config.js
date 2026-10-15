/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        excel: {
          navy: '#0B2A6F',
          navyDark: '#071A46',
          bluePrimary: '#1E88E5',
          blueLight: '#64B5F6',
          green: '#16A34A',
          greenLight: '#DCFCE7',
          greenHover: '#15803D',
          border: '#E2E8F0',
          darkBorder: '#334155',
          cellBg: '#FFFFFF',
          darkBg: '#0F172A',
          darkCard: '#1E293B',
          darkSubtle: '#334155'
        },
        weeks: {
          w1: '#0B2A6F',
          w2: '#1565C0',
          w3: '#1E88E5',
          w4: '#42A5F5',
          w5: '#64B5F6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
