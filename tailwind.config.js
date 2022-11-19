/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
      },
      fontFamily: {
        PlusJakartaSans: ["Plus Jakarta Sans", "sans-serif"],
      },
      tooltipArrows: (theme) => ({
        "message-sender-arrow": {
          borderColor: "#e5e7eb",
          borderWidth: 1,
          backgroundColor: "#D7F8F4",
          size: 7,
          offset: 2,
        },
        "message-arrow": {
          borderWidth: 1,
          backgroundColor: "#fff",
          size: 10,
          offset: 2,
          borderColor: "#e5e7eb",
        },
      }),
      keyframes: {
        scaleFocus: {
          "0% ": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.05)",
            backgroundColor: "#d1d5db",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      colors: {
        primary: "#128C7E",
      },
      animation: {
        scaleFocus: "scaleFocus 1s ease-in-out",
        wiggle: "wiggle 200ms ease-in-out",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-tooltip-arrow-after")(),
    require("tailwind-scrollbar"),

    function ({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    },
  ],
};
