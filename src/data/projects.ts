// ─────────────────────────────────────────────────────────────
// ALL WORK LIVES HERE.
// To add a project:
//   1. Put its photos in  public/images/<slug>/  (01.jpg, 02.jpg, ...)
//   2. Copy an entry below, change the fields, list the photo files.
//   3. Set `featured: true` to show it on the home page.
// Order in this list = order on the site (newest first).
// ─────────────────────────────────────────────────────────────

export type Category = "Editorial" | "Commercial" | "Personal";

export type Photo = {
  file: string; // filename inside public/images/<slug>/
  width: number; // original pixel size, used to reserve space
  height: number;
  alt?: string;
};

export type Project = {
  slug: string; // used in the URL: /projects/<slug>
  title: string;
  client?: string;
  category: Category;
  year: number;
  location?: string;
  summary?: string;
  featured?: boolean;
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: true,
    cover: "01.jpg",
    photos: [
      { file: "01.jpg", width: 1600, height: 2400 },
      { file: "02.jpg", width: 2400, height: 1600 },
      { file: "03.jpg", width: 1600, height: 2000 },
      { file: "04.jpg", width: 2400, height: 1600 },
    ],
  },
];

// Hand-picked images for the home page collage, as "<slug>/<file>".
// Leave empty to auto-pick the cover of every featured project.
export const collage: string[] = [];

// Behind-the-scenes photos for /bts (files in public/images/bts/).
// Leave empty to hide the BTS page from the nav.
export const bts: Photo[] = [
  { file: "01.jpg", width: 2400, height: 1600, alt: "Behind the scenes" },
  { file: "02.jpg", width: 1600, height: 2000, alt: "Behind the scenes" },
  { file: "03.jpg", width: 2400, height: 1600, alt: "Behind the scenes" },
];
