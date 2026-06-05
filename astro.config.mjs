// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://apps.no-tone.com",
  output: "server",
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/gh/homarr-labs/dashboard-icons/**",
      },
    ],
  },
  integrations: [],
  adapter: cloudflare({
    imageService: "compile",
  }),
});
