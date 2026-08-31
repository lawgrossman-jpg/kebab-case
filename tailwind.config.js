/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.js', './public/**/*.html'],
  theme: {
    extend: {
      colors: {
        navy: { 50: '#f0f4f8', 100: '#d9e2ec', 800: '#102a43', 900: '#0A1931', 950: '#060f1e' },
        silver: { 100: '#f7f9fa', 200: '#e4e8ec', 300: '#C0C0C0', 400: '#9aa5b1', 500: '#7b8794', 600: '#486581' },
        gold: { 500: '#d4af37' },
      },
      fontFamily: {
        sans: ['Heebo', 'sans-serif'],
        serif: ['Frank Ruhl Libre', 'serif'],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': '#334155',
            '--tw-prose-headings': '#0A1931',
            maxWidth: 'none',
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
