/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "!./src/**/*.test.{js,ts,jsx,tsx}",
    "!./src/**/__tests__/**/*"
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Based on YOGI.v2's color scheme
        primary: {
          DEFAULT: '#2563eb', // Blue 600
          dark: '#1d4ed8', // Blue 700
          light: '#3b82f6', // Blue 500
        },
        secondary: {
          DEFAULT: '#4b5563', // Gray 600
          dark: '#374151', // Gray 700
          light: '#6b7280', // Gray 500
        },
        background: {
          light: '#ffffff',
          dark: '#111827', // Gray 900
        },
        surface: {
          light: '#f9fafb', // Gray 50
          dark: '#1f2937', // Gray 800
        },
      },
      spacing: {
        'header': '2.5rem', // 40px compact header
      },
      height: {
        'screen-minus-header': 'calc(100vh - 2.5rem)',
      },
    },
  },
  plugins: [],
}
