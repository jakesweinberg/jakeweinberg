// Generates grey placeholder photos for every entry in src/data/projects.ts
// that doesn't have a real file yet. Safe to re-run: never overwrites.
import { mkdir, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const { projects } = await import(path.join(ROOT, "src/data/projects.ts"));
const { bts } = await import(path.join(ROOT, "src/data/bts.ts"));
const { info } = await import(path.join(ROOT, "src/data/site.ts"));

const tones = ["#d9d6d0", "#cfd3d6", "#d6d2c9", "#c9cdc8", "#dcd8d2", "#d0ccc6"];
const jobs = [
  ...projects.flatMap((p, i) => p.photos.map((ph) => ({ dir: p.slug, ph, label: p.title, tone: tones[i % tones.length] }))),
  ...bts.filter((ph) => /\.(jpe?g|png)$/i.test(ph.file)).map((ph) => ({ dir: "bts", ph, label: "BTS", tone: "#cfcbc4" })),
  ...(info.portrait ? [{ dir: "info", ph: info.portrait, label: "Portrait", tone: "#d6d2c9" }] : []),
];

for (const { dir, ph, label, tone } of jobs) {
  const out = path.join(ROOT, "public/images", dir, ph.file);
  try { await access(out); continue; } catch {}
  await mkdir(path.dirname(out), { recursive: true });
  const { width: w, height: h } = ph;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="100%" height="100%" fill="${tone}"/>
    <text x="50%" y="50%" font-family="monospace" font-size="${Math.round(w / 32)}" fill="#8a8a8a" text-anchor="middle">${label.replace(/[<>&]/g, "")} · ${ph.file}</text>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 70 }).toFile(out);
  console.log("placeholder", path.relative(ROOT, out));
}
