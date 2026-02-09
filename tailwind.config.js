/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0f172a", // Deep Slate
                foreground: "#f8fafc", // Lightest Slate
                primary: {
                    DEFAULT: "#bef264", // Volt / Pickle Yellow
                    foreground: "#0f172a",
                },
                secondary: {
                    DEFAULT: "#1e293b", // Lighter Slate for cards
                    foreground: "#f8fafc",
                },
                accent: {
                    DEFAULT: "#ffffff",
                    muted: "#64748b",
                },
                border: "#334155",
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Bebas Neue', 'sans-serif'], // For big scores/headers
            },
            borderRadius: {
                'sport': '4px', // Sharper, professional look
            },
            boxShadow: {
                'broadcast': '0 4px 0 0 rgba(0,0,0,0.3)',
            }
        },
    },
    plugins: [],
}
