module.exports = {
  content: [
    "./pages/*.{js,ts,jsx,tsx}",
    "./components/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Primäre Farbe - Dunkelblau
        primary: {
          50: '#E6F0F9',
          100: '#CCE0F3',
          200: '#99C2E6',
          300: '#66A3DA',
          400: '#3385CD',
          500: '#0066C1',
          600: '#00529A',
          700: '#003D74',
          800: '#00294D',
          900: '#001427',
        },
        // Sekundäre Farbe - Grün
        secondary: {
          50: '#E8F7F0',
          100: '#D1EFE1',
          200: '#A3DFC3',
          300: '#75CFA5',
          400: '#47BF87',
          500: '#19AF69',
          600: '#148C54',
          700: '#0F693F',
          800: '#0A462A',
          900: '#052315',
        },
        // Akzentfarbe - Orange
        accent: {
          50: '#FFF0E6',
          100: '#FFE0CC',
          200: '#FFC299',
          300: '#FFA366',
          400: '#FF8533',
          500: '#FF6600',
          600: '#CC5200',
          700: '#993D00',
          800: '#662900',
          900: '#331400',
        },
        // Neutrales Grau
        neutral: {
          50: '#F7F7F7',
          100: '#EFEFEF',
          200: '#DFDFDF',
          300: '#CFCFCF',
          400: '#BFBFBF',
          500: '#AFAFAF',
          600: '#8C8C8C',
          700: '#696969',
          800: '#464646',
          900: '#232323',
        },
        // Statusfarben
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        }
      }
    }
  },
  plugins: [],
}