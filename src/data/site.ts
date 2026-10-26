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

  // Set to true to show Editorial / Commercial tags across the site.
  // Each project then needs a `category` in src/data/projects.ts.
  showCategories: false,

  // Editorial / Commercial / Personal filter tabs on the Projects page.
  // Tabs only appear once projects have a `category`.
  showFilters: true,

  // Projects page layout: "a" Results, "b" Headline, "c" Banner.
  // Compare them at /preview/a/, /preview/b/ and /preview/c/.
  indexStyle: "a" as "a" | "b" | "c",
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
    { label: "LinkedIn", href: "https://www.linkedin.com/in/", text: "LinkedIn" }, // TODO: profile URL
  ],

  clients: ["Nike", "Citius", "HN"], // TODO: full list

  publications: ["Citius Mag"], // TODO: full list
};
