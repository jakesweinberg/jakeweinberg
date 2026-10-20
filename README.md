# Jake Weinberg Photo

Portfolio site for [jakeweinbergphoto.com](https://jakeweinbergphoto.com).
Next.js (App Router) exported as a static site and hosted free on Cloudflare Pages.

## Add a project

1. Make a folder `public/images/<slug>/` and drop the photos in (`01.jpg`, `02.jpg`, ...).
   Export JPGs around 2400px on the long edge; the build makes smaller WebP copies.
2. Open `src/data/projects.ts`, copy an existing entry, and fill in the fields.
   List every photo with its pixel width/height (Finder's Get Info shows them).
3. `featured: true` puts it on the home page. List order is site order.

On a project page, landscape photos get a full-width row and portrait photos are
paired side by side (a portrait pairs with the next portrait in the list). Add
`half: true` to a photo to pair it even if it's landscape.

Site details (email, Instagram, bio, clients) live in `src/data/site.ts`.
To hand-pick the home collage, list `"<slug>/<file>"` entries in `collage` in `projects.ts`.
Empty the `bts` list to hide the BTS page.

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
