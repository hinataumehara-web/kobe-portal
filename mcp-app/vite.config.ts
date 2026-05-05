import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  root: resolve(__dirname, "src/ui"),
  build: {
    outDir: resolve(__dirname, "dist/ui"),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "src/ui/mcp-app.html"),
    },
  },
});
