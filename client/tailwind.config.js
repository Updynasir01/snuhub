/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        serif: ["Merriweather", "ui-serif", "Georgia"],
      },
      colors: {
        primary: {
          DEFAULT: '#1a365d', // Deep blue
          light: '#3b5998',
          dark: '#102040',
        },
        accent: {
          DEFAULT: '#2563eb', // Blue accent
          light: '#60a5fa',
        },
        background: '#f8fafc', // Light background
      },
      backgroundImage: {
        'blue-gradient': 'linear-gradient(135deg, #1a365d 0%, #2563eb 100%)',
      },
    },
  },
  plugins: [],
} 