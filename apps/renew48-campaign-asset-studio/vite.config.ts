import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// Standalone Vite configuration. The app no longer requires Figma Make's
// preview plugins, runtime, or deployment CLI.
export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE_PATH ?? "/",
  build: {
    sourcemap: mode === "development",
    minify: mode !== "development",
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT ?? 8443),
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT ?? 8443),
  },
}));
