import { defineConfig as defineViteConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin";
import { nitro } from "nitro/vite";

export default defineViteConfig({
  plugins: [
    tanstackStart(),
    react(),
    tailwindcss(),
    tsconfigPaths(),
    nitro({ preset: "cloudflare-module" }),
  ],
  tanstackStart: {
    server: { entry: "server" },
  },
});
