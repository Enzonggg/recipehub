/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['DM Serif Display', 'Georgia', 'serif'],
        body: ['Manrope', 'Segoe UI', 'sans-serif'],
      },
      backgroundImage: {
        'recipe-grid':
          'radial-gradient(circle at 1px 1px, rgb(235 227 210 / 0.45) 1px, transparent 0)',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['cupcake', 'bumblebee'],
  },
}

