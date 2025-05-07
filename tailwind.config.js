/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#FFF5EB',
          100: '#FFEAD9',
          200: '#FFD0B5',
          300: '#FFB593',
          400: '#FF9A71',
          500: '#FF7F50', // Main primary color
          600: '#FF6A3A',
          700: '#FF5522',
          800: '#FF3D00',
          900: '#FF2500',
        },
        secondary: {
          50: '#FFF9F5',
          100: '#FFF5EB',
          200: '#FFE9D6',
          300: '#FFDDC1',
          400: '#FFD1AC',
          500: '#FFA07A', // Main secondary color
          600: '#FF8A61',
          700: '#FF7449',
          800: '#FF5E30',
          900: '#FF4719',
        }
      },
      boxShadow: {
        card: '0 5px 15px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
};