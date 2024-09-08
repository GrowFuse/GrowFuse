import baseConfig from "@growfuse/ui/tailwind.config";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  presets: [baseConfig],
};
