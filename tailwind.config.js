/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#eb6753',
        secondary: '#222222',
        dark: '#0d1216',
        light: '#f7f7f7',
      },
      fontFamily: {
        body: ['var(--body-font-family)', 'sans-serif'],
        title: ['var(--title-font-family)', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
      },
      borderRadius: {
        '12': '12px',
      },
      maxWidth: {
        '1600': '1600px',
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
        'spin-slow-reverse': 'spin 10s linear infinite reverse',
      },
    },
  },
  plugins: [],
}

