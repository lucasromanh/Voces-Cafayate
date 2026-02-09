/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#F97700",
                    hover: "#E06A00",
                },
                accent: {
                    DEFAULT: "#E0791A",
                },
                gray: {
                    voces: "#797476",
                },
                background: {
                    voces: "#FEFEFE",
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
            }
        },
    },
    plugins: [],
}
