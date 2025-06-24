/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'glass-bg': 'rgba(255, 255, 255, 0.2)',
        'glass-border': 'rgba(255, 255, 255, 0.3)',
      },
      backgroundImage: {
        'hero': "url('/hero.jpg')",
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      opacity: {
        '20': '.20',
        '30': '.30',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  corePlugins: {
    preflight: true
  }
}
