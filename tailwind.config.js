/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: "#00ff88",
      },
      boxShadow: {
        glow: "0 0 40px rgba(0,255,136,0.25)",
        glowStrong: "0 0 80px rgba(0,255,136,0.4)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: 0.4 },
          "50%": { opacity: 1 },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        glow: "glowPulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};