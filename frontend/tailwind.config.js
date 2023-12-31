/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'ping-once': 'ping 400ms ease-out 1',
        'bounce-fast': 'bounce 1000ms ease-out infinite',
        'bounce-slow': 'bounce 1500ms ease-out infinite',
      }

    },
  },
  plugins: [],
}

