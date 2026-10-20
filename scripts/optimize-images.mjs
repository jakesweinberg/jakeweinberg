// Resizes every image in public/images into WebP files in public/_img
// at the widths in src/lib/imageWidths.ts. Runs before dev and build.
// Skips files that are already up to date, so re-runs are fast.
import { readdir, mkdir, stat, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const IN = path.join(ROOT, "public/images");
const OUT = path.join(ROOT, "public/_img");
const widthsSrc = await readFile(path.join(ROOT, "src/lib/imageWidths.ts"), "utf8");
const WIDTHS = widthsSrc.match(/\[([\d,\s]+)\]/)[1].split(",").map(Number);

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(jpe?g|png|webp|tiff?)$/i.test(e.name)) yield p;
  }
}

const mtime = (p) => stat(p).then((s) => s.mtimeMs, () => 0);
let made = 0;

for await (const file of walk(IN)) {
  const rel = path.relative(IN, file).replace(/\.[^.]+$/, "");
  const srcTime = await mtime(file);
  for (const w of WIDTHS) {
    const out = path.join(OUT, `${rel}-${w}.webp`);
    if ((await mtime(out)) > srcTime) continue;
    await mkdir(path.dirname(out), { recursive: true });
    await sharp(file)
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(out);
    made++;
  }
}
console.log(`images: ${made} variant(s) written to public/_img`);
