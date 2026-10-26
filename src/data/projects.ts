// ─────────────────────────────────────────────────────────────
// ALL WORK LIVES HERE.
// To add a project:
//   1. Put its photos in  public/images/<slug>/
//   2. Copy an entry below, change the fields, list the photo files.
// Order in this list = order on the site (newest first). The home page
// shows the first few (site.homeCount in src/data/site.ts).
// ─────────────────────────────────────────────────────────────

export type Category = "Editorial" | "Commercial" | "Personal";

export type Photo = {
  file: string; // filename inside public/images/<slug>/
  width: number; // original pixel size, used to reserve space
  height: number;
  alt?: string;
  half?: boolean; // force side-by-side, e.g. to pair two landscapes
};

export type Project = {
  slug: string; // used in the URL: /projects/<slug>
  title: string;
  client?: string;
  category?: Category; // only shown when site.showCategories is true
  year: number;
  location?: string;
  summary?: string;
  cover: string; // one of the photo files
  photos: Photo[];
};

// Photos are grey placeholders until real images are dropped in.
export const projects: Project[] = [
  {
    slug: "bandit-grand-prix",
    title: "Bandit Grand Prix",
    client: "Citius",
    category: "Editorial",
    year: 2026,
    summary: "", // TODO: one or two sentences about the shoot
    cover: "01.jpg",
    photos: [
      { file: "01.jpg", width: 2400, height: 1600 },
      { file: "02.jpg", width: 1600, height: 2400 },
      { file: "03.jpg", width: 2400, height: 1600 },
      { file: "04.jpg", width: 1600, height: 2000 },
      { file: "05.jpg", width: 2400, height: 1600 },
      { file: "06.jpg", width: 1600, height: 2400 },
    ],
  },
  {
    slug: "nike-x-outpost",
    title: "Nike x Outpost",
    client: "Nike",
    category: "Commercial",
    year: 2026,
    summary: "", // TODO: one or two sentences about the shoot
    cover: "01.jpg",
    photos: [
      { file: "01.jpg", width: 1600, height: 2000 },
      { file: "02.jpg", width: 2400, height: 1600 },
      { file: "03.jpg", width: 1600, height: 2400 },
      { file: "04.jpg", width: 2400, height: 1600 },
      { file: "05.jpg", width: 1600, height: 2000 },
    ],
  },
  {
    slug: "chicago-marathon",
    title: "Chicago Marathon",
    client: "Citius",
    category: "Editorial",
    year: 2026,
    location: "Chicago, IL",
    summary: "", // TODO: one or two sentences about the shoot
    cover: "01.jpg",
    photos: [
      { file: "01.jpg", width: 2400, height: 1600 },
      { file: "02.jpg", width: 2400, height: 1600 },
      { file: "03.jpg", width: 1600, height: 2400 },
      { file: "04.jpg", width: 1600, height: 2000 },
      { file: "05.jpg", width: 2400, height: 1600 },
    ],
  },
  {
    slug: "indiana-football",
    title: "Indiana Football",
    client: "HN",
    category: "Editorial",
    year: 2025,
    location: "Bloomington, IN",
    summary: "", // TODO: one or two sentences about the shoot
    cover: "01.jpg",
    photos: [
      { file: "01.jpg", width: 2400, height: 1600 },
      { file: "02.jpg", width: 1600, height: 2400 },
      { file: "03.jpg", width: 2400, height: 1600 },
      { file: "04.jpg", width: 1600, height: 2000 },
    ],
  },
  {
    slug: "indiana-basketball",
    title: "Indiana Basketball",
    client: "HN",
    category: "Editorial",
    year: 2025,
    location: "Bloomington, IN",
    summary: "", // TODO: one or two sentences about the shoot
    cover: "01.jpg",
    photos: [
      { file: "01.jpg", width: 1600, height: 2400 },
      { file: "02.jpg", width: 2400, height: 1600 },
      { file: "03.jpg", width: 1600, height: 2000 },
      { file: "04.jpg", width: 2400, height: 1600 },
    ],
  },
];
