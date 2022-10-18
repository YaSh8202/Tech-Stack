/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-tooltip-arrow-after")(),
  ],
};
