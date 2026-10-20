import type { NextConfig } from "next";
import { WIDTHS } from "./src/lib/imageWidths";

// Static export: `npm run build` writes plain HTML/CSS/JS to /out,
// which Cloudflare Pages serves for free.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    // Cloudflare Pages has no image optimizer, so we pre-generate WebP
    // sizes at build time (scripts/optimize-images.mjs) and point
    // next/image at them with a custom loader.
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    deviceSizes: [...WIDTHS],
    imageSizes: [],
  },
};

export default nextConfig;
