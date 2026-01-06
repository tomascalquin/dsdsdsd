import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // 🚨 ESTAS SON LAS LÍNEAS IMPORTANTES 🚨
    // Le dicen a Tailwind: "Busca clases en TODAS las carpetas dentro de src"
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // <--- Agrega esta por seguridad
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;