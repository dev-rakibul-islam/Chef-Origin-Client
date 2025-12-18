/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        primary: {
          accent: "#F54A00", // Vibrant Orange
          light: "#FFAD7A",
          lighter: "#FFE4D4",
          DEFAULT: "#F54A00",
        },
        secondary: {
          DEFAULT: "#FFF7ED", // Primary Background
          light: "#FFFBF7",
          dark: "#F5E6D3",
        },
        text: {
          primary: "#333333", // Deep Black / Dark Gray
          light: "#666666",
          lighter: "#999999",
          DEFAULT: "#333333",
        },
        background: {
          DEFAULT: "#FFF7ED",
          light: "#FFFBF7",
          dark: "#F5E6D3",
        },
      },
      backgroundColor: {
        primary: "#FFF7ED",
        secondary: "#F54A00",
      },
      textColor: {
        primary: "#333333",
        accent: "#F54A00",
      },
      borderColor: {
        primary: "#F54A00",
      },
      ringColor: {
        primary: "#F54A00",
      },
      fontFamily: {
        sans: ["Geom", "sans-serif"],
        serif: ["Geom", "serif"],
        playfair: ["Geom", "serif"],
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          primary: "#F54A00", // Vibrant Orange
          secondary: "#FFF7ED", // Primary Background
          accent: "#F54A00", // Accent color
          neutral: "#333333", // Deep Black / Dark Gray
          "base-100": "#FFFFFF", // White for cards
          "base-200": "#FFF7ED", // Light background
          "base-300": "#F5E6D3", // Slightly darker background
          info: "#3B82F6",
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
    ],
  },
  plugins: [],
};
