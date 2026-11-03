import { bts } from "@/data/bts";
import { projects, type Photo, type Project } from "@/data/projects";
import { site } from "@/data/site";

export const src = (slug: string, file: string) => `/images/${slug}/${file}`;

// Video clips in a project's list live in public/video/<folder>/, each with a
// .jpg of the same name beside it as the still shown while it loads.
export const isVideo = (ph: Photo) => /\.(mp4|webm|mov)$/i.test(ph.file);
export const videoSrc = (dir: string, file: string) => `/video/${dir}/${file}`;
export const posterSrc = (dir: string, file: string) => videoSrc(dir, file).replace(/\.[^.]+$/, ".jpg");
export const stillsOf = (p: Project) => p.photos.filter((ph) => !isVideo(ph));

// Folder in public/images/ holding a project's photos.
export const dirOf = (p: Project) => p.folder ?? p.slug;

// "2026-10" → "Oct 2026"
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function dateOf(p: Project) {
  const [y, m] = p.date.split("-").map(Number);
  return m >= 1 && m <= 12 ? `${MONTHS[m - 1]} ${y}` : String(y);
}

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const coverOf = (p: Project): Photo =>
  p.photos.find((ph) => ph.file === p.cover && !isVideo(ph)) ?? stillsOf(p)[0];

export const recent = () => projects.slice(0, site.homeCount);

export const hasBts = bts.length > 0;

export function neighbours(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? projects[i - 1] : undefined,
    next: i < projects.length - 1 ? projects[i + 1] : undefined,
  };
}

// Lays out a project's photos in rows. Landscapes get a full row each.
// Portraits (and any photo marked `half`) are paired with the next one
// in the list, even if a landscape sits between them; a leftover one is
// shown on its own, centred.
export function photoRows(photos: Photo[]): Photo[][] {
  const halfable = (ph: Photo) => ph.half || ph.height > ph.width;
  const rest = [...photos];
  const rows: Photo[][] = [];
  while (rest.length) {
    const ph = rest.shift()!;
    if (!halfable(ph)) {
      rows.push([ph]);
      continue;
    }
    const j = rest.findIndex(halfable);
    rows.push(j === -1 ? [ph] : [ph, ...rest.splice(j, 1)]);
  }
  return rows;
}
