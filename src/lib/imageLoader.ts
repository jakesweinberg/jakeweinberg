import { WIDTHS } from "./imageWidths";

// Maps "/images/foo/01.jpg" at width w to "/_img/foo/01-<w>.webp".
export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (!src.startsWith("/images/")) return src;
  const w = WIDTHS.find((x) => x >= width) ?? WIDTHS[WIDTHS.length - 1];
  const base = src.replace(/^\/images\//, "").replace(/\.[a-z0-9]+$/i, "");
  // Encoded so filenames with spaces work in srcset.
  return encodeURI(`/_img/${base}-${w}.webp`);
}
