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
  file: string; // filename inside public/images/<slug>/
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
  category?: Category; // only shown when site.showCategories is true
  year: number;
  location?: string;
  summary?: string;
  cover: string; // one of the photo files
  photos: Photo[];
};

// MOCK PROJECTS: all four share the photos in public/images/mock/ so the
// layout can be judged with real images. Replace with real work.
export const projects: Project[] = [
  {
    slug: "mock-project-one",
    folder: "mock",
    title: "Mock Project One",
    client: "Client A",
    year: 2026,
    cover: "JWP 21.JPG",
    photos: [
      { file: "JWP 21.JPG", width: 3000, height: 2001 },
      { file: "JWP 24.JPG", width: 2001, height: 3000 },
      { file: "JWP 8.JPG", width: 2400, height: 3000 },
      { file: "JWP 9.JPG", width: 2529, height: 1677 },
    ],
  },
  {
    slug: "mock-project-two",
    folder: "mock",
    title: "Mock Project Two",
    client: "Client B",
    year: 2026,
    cover: "JWP 24.JPG",
    photos: [
      { file: "JWP 24.JPG", width: 2001, height: 3000 },
      { file: "JWP 8.JPG", width: 2400, height: 3000 },
      { file: "JWP 9.JPG", width: 2529, height: 1677 },
      { file: "JWP 21.JPG", width: 3000, height: 2001 },
    ],
  },
  {
    slug: "mock-project-three",
    folder: "mock",
    title: "Mock Project Three",
    client: "Client C",
    year: 2025,
    cover: "JWP 8.JPG",
    photos: [
      { file: "JWP 8.JPG", width: 2400, height: 3000 },
      { file: "JWP 9.JPG", width: 2529, height: 1677 },
      { file: "JWP 21.JPG", width: 3000, height: 2001 },
      { file: "JWP 24.JPG", width: 2001, height: 3000 },
    ],
  },
  {
    slug: "mock-project-four",
    folder: "mock",
    title: "Mock Project Four",
    client: "Client D",
    year: 2025,
    cover: "JWP 9.JPG",
    photos: [
      { file: "JWP 9.JPG", width: 2529, height: 1677 },
      { file: "JWP 21.JPG", width: 3000, height: 2001 },
      { file: "JWP 24.JPG", width: 2001, height: 3000 },
      { file: "JWP 8.JPG", width: 2400, height: 3000 },
    ],
  },
];
