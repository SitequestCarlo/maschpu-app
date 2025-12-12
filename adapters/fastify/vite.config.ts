import { nodeServerAdapter } from "@builder.io/qwik-city/adapters/node-server/vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config";

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.fastify.tsx", "@qwik-city-plan"],
      },
    },
    plugins: [nodeServerAdapter({ 
      name: "fastify",
      ssg: {
        include: ["/*"], // Include all pages
        exclude: [
          "/api/*",             // API routes  
          "/dyn-sitemap.xml",   // Dynamic sitemap
          "/cache-map.json",    // Cache map (PWA)
        ],
        origin: "https://maschpu.de",
        maxWorkers: 1,          // Single worker to avoid stream issues
      }
    })],
  };
});
