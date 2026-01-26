import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "logo512.png"],
      manifest: {
        name: "BioSecure - Farm Management",
        short_name: "BioSecure",
        description: "Digital Farm Management Portal for Biosecurity",
        theme_color: "#10b981",
        icons: [
          {
            src: "logo512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "logo512.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          }
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.dicebear\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "dicebear-avatars",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\/api\/v1\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 Hours
              },
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
