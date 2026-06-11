import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    // The backend has no CORS configured. Proxying /graphql keeps the browser
    // same-origin, so the urql client can target the relative "/graphql" path.
    proxy: {
      "/graphql": {
        target: "http://localhost:5080",
        changeOrigin: true,
      },
    },
  },
});
