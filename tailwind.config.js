/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Dark Mode enable kiya class strategy ke saath
  darkMode: 'class',

  // 2. Content paths zaroori hain taake Tailwind classes scan ho saken
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],

  theme: {
    extend: {
      // 3. Aapke custom premium colors
      colors: {
        brand: {
          primary: '#6366f1',
          secondary: '#a855f7',
          dark: '#0f172a',
          surface: '#1e293b', // Card background ke liye ek aur shade add kiya
        }
      },
      // 4. Poppins font integration
      fontFamily: { 
        poppins: ['Poppins', 'sans-serif'] 
      },
      // 5. Smooth transitions ke liye custom settings
      transitionTimingFunction: {
        'soft-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    }
  },
  plugins: [],
}