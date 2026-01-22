/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}" // Added pages just in case
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                outfit: ['Outfit', 'sans-serif'],
            },
            colors: {
                'ura-navy': '#020617',
                'ura-amber': '#f59e0b',
                'ura-emerald': '#10b981',
                'ura-cream': '#fdfcf0',
            }
        },
    },
    plugins: [],
}
