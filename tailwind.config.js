/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        bangla: ['Hind Siliguri', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'mesh-gradient': `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CradialGradient id='a' cx='20%25' cy='30%25' r='60%25'%3E%3Cstop offset='0%25' stop-color='%23667eea' stop-opacity='.3'/%3E%3Cstop offset='100%25' stop-color='%23764ba2' stop-opacity='0'/%3E%3C/radialGradient%3E%3CradialGradient id='b' cx='80%25' cy='70%25' r='40%25'%3E%3Cstop offset='0%25' stop-color='%23f093fb' stop-opacity='.2'/%3E%3Cstop offset='100%25' stop-color='%234facfe' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='100' height='100' fill='none'/%3E%3Crect width='100' height='100' fill='url(%23a)'/%3E%3Crect width='100' height='100' fill='url(%23b)'/%3E%3C/svg%3E")`,
      },
      boxShadow: {
        'inner-sm': 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        'glass': '4px',
      },
    },
  },
  plugins: [],
};
