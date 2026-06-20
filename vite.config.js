import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { vitePrerenderPlugin } from "vite-prerender-plugin";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    vitePrerenderPlugin({
      prerenderScript: path.resolve(__dirname, "src/prerender.jsx"),
      renderTarget: "#root",
      additionalPrerenderRoutes: ["/about", "/work"],
    }),
  ],
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/framer-motion")) {
            return "vendor-motion";
          }
          if (
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react-router") ||
            id.includes("node_modules/react/")
          ) {
            return "vendor-react";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons";
          }
          if (id.includes("node_modules/@calcom/embed-react")) {
            return "vendor-cal";
          }
          if (id.includes("node_modules/lenis")) {
            return "vendor-lenis";
          }
        },
      },
    },
  },
});
