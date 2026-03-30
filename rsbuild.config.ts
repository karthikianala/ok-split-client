import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [pluginReact()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  html: {
    title: "OkSplit",
    meta: {
      "theme-color": "#2DBAA0",
    },
    tags: [
      { tag: "link", attrs: { rel: "manifest", href: "/manifest.json" } },
      { tag: "meta", attrs: { name: "apple-mobile-web-app-capable", content: "yes" } },
      { tag: "meta", attrs: { name: "apple-mobile-web-app-status-bar-style", content: "default" } },
      { tag: "link", attrs: { rel: "apple-touch-icon", href: "/logo-icon.png" } },
    ],
  },
  server: {
    port: 3000,
    proxy: {
      "/api": "http://localhost:5000",
      "/hubs": {
        target: "http://localhost:5000",
        ws: true,
      },
    },
  },
});
