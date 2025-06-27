/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./index.html",
    "./components/**/*.html",
    "./pages/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff4e6',
          100: '#ffe4cc',
          200: '#ffc999',
          300: '#ffad66',
          400: '#ff9133',
          500: '#fe6f00',
          600: '#cc5900',
          700: '#994300',
          800: '#662d00',
          900: '#331600',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [
    require('@headlessui/tailwindcss')
  ],
}
