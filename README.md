# Jake Weinberg Photo

Portfolio site for [jakeweinbergphoto.com](https://jakeweinbergphoto.com).
Next.js (App Router) exported as a static site and hosted free on Cloudflare Pages.

## Pages

- **Home** (`/`): the newest projects (how many: `homeCount` in `src/data/site.ts`).
- **Projects** (`/projects/`): filter tabs (All / Editorial / Commercial / Personal) over a list of
  titles; hovering a title shows that project's cover beside the list.
- **BTS** (`/bts/`): photos and videos from `src/data/bts.ts`, shuffled into a new collage on every visit.
- **Info** (`/info/`): bio, portrait, links, clients and publications from `info` in `src/data/site.ts`.

## Add a project

1. Make a folder `public/images/<slug>/` and drop the photos in (original filenames are fine).
2. Open `src/data/projects.ts`, copy an existing entry to the top of the list, and fill in the fields.
   List every photo with its pixel width/height.
3. List order is site order, newest first.

On a project page, landscape photos get a full-width row and portrait photos are
paired side by side (a portrait pairs with the next portrait in the list). Add
`half: true` to a photo to pair it even if it's landscape.

**Categories:** give each project a `category` (Editorial, Commercial or Personal)
to place it under a filter tab on the Projects page (`showFilters` in `src/data/site.ts`).
Set `showCategories: true` to also print the category on home cards and project pages.

## Add BTS photos or videos

Drop files into `public/images/bts/` and list them in `src/data/bts.ts` with their
width/height. `.mp4` files play silently on a loop. Keep videos short and small
(under ~10MB, and Cloudflare Pages rejects any file over 25MB).

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static site in /out
npm run placeholders # grey stand-ins for any listed photo that's missing
```

## Deploy (Cloudflare Pages)

Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick this repo.

- Framework preset: **None**
- Build command: `npm run build`
- Build output directory: `out`
- Environment variable: `NODE_VERSION` = `22`

Then Custom domains → add `jakeweinbergphoto.com` (and `www`). Every push to `main` redeploys.

## How images stay fast

`scripts/optimize-images.mjs` runs before every build and writes WebP versions of each
photo at 480/960/1600/2400px into `public/_img`. `next/image` uses a custom loader
(`src/lib/imageLoader.ts`) so phones download the small sizes, everything below the
fold lazy-loads, and `public/_headers` tells Cloudflare to cache them for a year.
