/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require("nativewind/preset"),
    require("../../tailwind.config.js"),
  ],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "../../packages/ui/src/**/*.{js,jsx,ts,tsx}",
  ],
};
