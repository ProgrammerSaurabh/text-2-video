/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    theme: {
      extend: {
        keyframes: {
          animatedgradient: {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        },
        backgroundSize: {
          '300%': '300%',
        },
        animation: {
          gradient: 'animatedgradient 6s ease infinite alternate',
          'infinite-scroll': 'infinite-scroll 6s linear infinite',
        },
        keyframes: {
          'infinite-scroll': {
            from: { transform: 'translateX(0)' },
            to: { transform: 'translateX(-100%)' },
          },
        },
      },
    },
    extend: {
      colors: {
        primary: '#00A6FB',
      },
    },
  },
  plugins: [],
};
