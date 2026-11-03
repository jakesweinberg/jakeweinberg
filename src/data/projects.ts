// ─────────────────────────────────────────────────────────────
// ALL WORK LIVES HERE.
// To add a project:
//   1. Put its photos in  public/images/<slug>/ (keep your filenames)
//   2. Copy an entry below, change the fields, list the photo files.
// Order in this list = order on the site (newest first). The home page
// shows the first few (site.homeCount in src/data/site.ts).
// ─────────────────────────────────────────────────────────────

export type Category = "Editorial" | "Commercial" | "Personal";

export type Photo = {
  file: string; // filename inside public/images/<slug>/ (a .mp4 lives in public/video/<slug>/ and plays as a silent loop)
  width: number; // original pixel size, used to reserve space
  height: number;
  alt?: string;
  half?: boolean; // force side-by-side, e.g. to pair two landscapes
};

export type Project = {
  slug: string; // used in the URL: /projects/<slug>
  folder?: string; // photo folder in public/images/ if not the slug
  title: string;
  client?: string;
  category?: Category; // drives the Projects filter tabs
  date: string; // "YYYY-MM", shown as month and year, e.g. "2026-10" → Oct 2026
  location?: string;
  summary?: string;
  cover: string; // one of the photo files
  // Optional silent looping video shown instead of the cover photo on the home
  // page and Projects list. The file lives in public/video/<slug>/, with a
  // .jpg of the same name beside it as the still shown while it loads.
  coverVideo?: { file: string; width: number; height: number };
  photos: Photo[];
};

export const projects: Project[] = [
  {
    slug: "nycm-endorphins-cheerzone",
    title: "NYCM Endorphins Cheerzone",
    client: "Endorphins Running",
    date: "2026-11",
    location: "Brooklyn",
    cover: "JWP 77.jpg",
    photos: [
      { file: "2P0A6407_1.mp4", width: 1600, height: 900 },
      { file: "JWP 8.jpg", width: 2001, height: 3000 },
      { file: "JWP 43.jpg", width: 2001, height: 3000 },
      { file: "JWP 51.jpg", width: 2001, height: 3000 },
      { file: "JWP 58.jpg", width: 2001, height: 3000 },
      { file: "JWP 66.jpg", width: 2001, height: 3000 },
      { file: "JWP 77.jpg", width: 2001, height: 3000 },
      { file: "JWP 120.jpg", width: 3000, height: 2001 },
      { file: "JWP 133.jpg", width: 2001, height: 3000 },
      { file: "JWP 147.jpg", width: 3000, height: 2001 },
      { file: "2P0A6407.mp4", width: 1600, height: 900 },
    ],
  },
];
