/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                agro: {
                    green: '#10B981', // Emerald 500
                    darkGreen: '#047857', // Emerald 700
                    lightGreen: '#6EE7B7', // Emerald 300
                    olive: '#556B2F',
                    earth: '#8B4513',
                    sky: '#38BDF8', // Sky 400
                    cream: '#FDFBF7', // Off-white background
                    glass: "rgba(255, 255, 255, 0.2)",
                    glassBorder: "rgba(255, 255, 255, 0.3)",
                    neon: '#39FF14', // Neon Green
                    gold: '#FFD700', // Gold

                    // Enhanced Agriculture Palette
                    soil: {
                        light: '#8D6E63',
                        DEFAULT: '#5D4037',
                        dark: '#3E2723',
                    },
                    leaf: {
                        light: '#4CAF50',
                        DEFAULT: '#2E7D32',
                        dark: '#1B5E20',
                    },
                    water: {
                        light: '#E1F5FE',
                        DEFAULT: '#29B6F6',
                        dark: '#0277BD',
                    },
                    sun: {
                        light: '#FFF9C4',
                        DEFAULT: '#FFEB3B',
                        dark: '#FBC02D',
                    },
                    beam: '#DBF4E9', // Light greenish beam for background
                },
                primary: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                    950: '#022c22',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
                syncopate: ['Syncopate', 'sans-serif'],
                lexend: ['Lexend', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'float': 'float 3s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
