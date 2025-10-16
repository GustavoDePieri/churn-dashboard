/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          main: '#1a0d2e',
          dark: '#0f0819',
          light: '#2a1b3d',
        },
        purple: {
          main: '#8b5cf6',
          dark: '#7c3aed',
          deep: '#6d28d9',
        },
        pink: {
          main: '#ec4899',
        },
        coral: {
          main: '#f43f5e',
          dark: '#e11d48',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(120deg, #8b5cf6 0%, #ec4899 50%, #fb7185 100%)',
        'gradient-cta': 'linear-gradient(90deg, #f43f5e 0%, #ec4899 100%)',
        'gradient-background': 'linear-gradient(135deg, #0f0819 0%, #1a0d2e 50%, #2a1b3d 100%)',
      },
    },
  },
  plugins: [],
}

