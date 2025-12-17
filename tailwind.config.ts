import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '2rem',
        sm: '3rem',
        lg: '4rem',
        xl: '6rem',
        '2xl': '8rem',
      },
    },
    extend: {
      colors: {
        primary: "#12c2e9",
        "primary-dark": "#0ea5d1",
        secondary: "#c471ed",
        accent: "#f64f59",
        dark: "#0a0a0a",
        light: "#e0e0e0",
        muted: "#a0a0a0",
      },
      backgroundImage: {
        "gradient-main": "linear-gradient(135deg, #12c2e9 0%, #c471ed 50%, #f64f59 100%)",
        "gradient-hover": "linear-gradient(135deg, #0ea5d1 0%, #b05dd9 50%, #e63946 100%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(18, 194, 233, 0.15)",
        "glow-lg": "0 0 40px rgba(18, 194, 233, 0.25)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "fade-in-right": "fadeInRight 0.8s ease-out",
        shimmer: "shimmer 3s linear infinite",
        float: "float 20s ease-in-out infinite",
        "pulse-slow": "pulse-slow 4s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          from: {
            opacity: "0",
            transform: "translateY(30px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeInRight: {
          from: {
            opacity: "0",
            transform: "translateX(50px)",
          },
          to: {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        shimmer: {
          "0%": {
            backgroundPosition: "0% center",
          },
          "100%": {
            backgroundPosition: "200% center",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translate(0, 0)",
          },
          "50%": {
            transform: "translate(-50px, 50px)",
          },
        },
        "pulse-slow": {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "0.15",
          },
          "50%": {
            transform: "scale(1.05)",
            opacity: "0.25",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
