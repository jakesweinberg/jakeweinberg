// Site-wide details. Edit freely.
export const site = {
  name: "Jake Weinberg Photo",
  shortName: "Jake Weinberg",
  url: "https://jakeweinbergphoto.com",
  tagline: "Sports photographer, Summit NJ. Track and field.",
  location: "Summit, New Jersey",
  email: "hello@jakeweinberg.com",

  // How many of the newest projects the home page shows.
  homeCount: 6,

  // Home page layout, 1-5 (see src/components/HomeView.tsx).
  // Compare them at /preview/home/1/ ... /preview/home/5/.
  homeStyle: 3 as 1 | 2 | 3 | 4 | 5,

  // Set to true to show Editorial / Commercial tags across the site.
  // Each project then needs a `category` in src/data/projects.ts.
  showCategories: false,

  // Editorial / Commercial / Personal filter tabs on the Projects page.
  // Tabs only appear once projects have a `category`.
  showFilters: true,

  // Projects page layout: "a" cover pinned beside the table,
  // "b" cover follows the cursor. Compare at /preview/a/ and /preview/b/.
  indexStyle: "b" as "a" | "b",

  // Clapper board that claps once when someone opens the site.
  // Plays once per visit; skipped for visitors who turn off motion.
  intro: true,
  // "small" is a slate about 3 inches across; "full" fills the screen.
  introSize: "full" as "small" | "full",
  // Behind the small slate: "white", "blur" (home page blurred) or "page" (home page as is).
  introBackdrop: "white" as "white" | "blur" | "page",
};

// ── Info page ────────────────────────────────────────────────
export const info = {
  // Photo of you, in public/images/info/. Set to null to hide it.
  portrait: { file: "portrait.jpg", width: 1600, height: 2000 } as
    | { file: string; width: number; height: number }
    | null,

  bio: [
    "Jake Weinberg is a freelance sports photographer based in Summit, New Jersey, specializing in track and field.",
    "He works with athletes, teams, meets and brands, from high school championships to professional competition.",
  ],

  links: [
    { label: "Email", href: "mailto:hello@jakeweinberg.com", text: "hello@jakeweinberg.com" },
    { label: "Instagram", href: "https://instagram.com/jakeweinbergphoto", text: "@jakeweinbergphoto" },
    { label: "LinkedIn", href: "", text: "LinkedIn" }, // TODO: profile URL (links with an empty href are hidden)
  ],

  clients: ["Nike", "Citius", "HN"], // TODO: full list

  publications: ["Citius Mag"], // TODO: full list
};
