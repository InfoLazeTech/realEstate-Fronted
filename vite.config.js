import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),       // Needed for React projects
    tailwindcss(), // Tailwind
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // This maps @ -> src/
    },
  },
});
