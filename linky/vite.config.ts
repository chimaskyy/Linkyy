import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import {VitePWA} from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",

      includeAssets: ["favicon.ico", "apple-touch-icon.png", "assets/*"],
      
      filename: "sw.js",
      manifest: {
        name: "Linky",
        short_name: "Linky",
        start_url: "/",
        description: "Your all-in-one link management solution",
        theme_color: "#ffffff",
        icons: [
          {
            src: "./src/assets/favicon/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./src/assets/favicon/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      devOptions: {
        enabled: true,
        type: "module",
        navigateFallback: "index.html",
      },
    }),
  ],
});
