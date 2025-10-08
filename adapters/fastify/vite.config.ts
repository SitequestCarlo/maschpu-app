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
        exclude: [], // We'll add problematic pages here if needed
        maxWorkers: 1 // Single worker to avoid concurrency issues
      }
    })],
  };
});
