"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Photo from "@/components/Photo";
import Tag from "@/components/Tag";
import { projects, type Project } from "@/data/projects";
import { site } from "@/data/site";
import { coverOf, dirOf, recent } from "@/lib/work";

// Five layouts for the home page's recent projects. Pick one with
// `homeStyle` in site.ts; compare them at /preview/home/1/ ... /5/.
//   1 Grid      two-column cards
//   2 Stack     full-width covers, one after another, title on the image
//   3 Reel      photos play like a video, recent titles and a Projects link below
//   4 Strip     covers side by side in a row you scroll sideways
//   5 Mosaic    newest project large, the rest in a three-column grid
export type HomeStyle = 1 | 2 | 3 | 4 | 5;

const href = (p: Project) => `/projects/${p.slug}/`;

function Card({ p, priority, sizes, className = "card" }: { p: Project; priority?: boolean; sizes: string; className?: string }) {
  return (
    <Link href={href(p)} className={className}>
      <div className="thumb">
        <Photo dir={dirOf(p)} photo={coverOf(p)} alt={p.title} priority={priority} sizes={sizes} />
      </div>
      <div className="meta">
        <h3>{p.title}</h3>
        <Tag p={p} />
      </div>
    </Link>
  );
}

// Reel on top: photos of the recent projects cut quickly, like video, with the playing project's
// title and details under it. Below, the recent projects as a three-column grid (as in Mosaic).
const FRAME_MS = 700; // ms per photo
const FRAME_MS_REDUCED = 2000; // for visitors who ask their device for less motion
const PER_PROJECT = 6;
const AHEAD = 4; // frames loaded ahead of the one showing

function Slideshow({ items }: { items: Project[] }) {
  const frames = items.flatMap((p) => p.photos.slice(0, PER_PROJECT).map((ph) => ({ p, ph })));
  const [i, setI] = useState(0);
  // Frames load as the reel gets near them, so the page doesn't fetch every photo up front.
  const [reach, setReach] = useState(AHEAD);
  const [ms, setMs] = useState(FRAME_MS);
  // The reel only moves on once the next photo has loaded, so a slow connection never shows a blank frame.
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set());
  const next = frames.length ? (i + 1) % frames.length : 0;
  const nextReady = loaded.has(next);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setMs(FRAME_MS_REDUCED);
  }, []);
  useEffect(() => setReach((r) => Math.max(r, i + AHEAD)), [i]);
  useEffect(() => {
    if (frames.length < 2 || !nextReady) return;
    const t = setTimeout(() => setI(next), ms);
    return () => clearTimeout(t);
  }, [i, next, nextReady, frames.length, ms]);
  if (frames.length === 0) return null;
  const { p } = frames[Math.min(i, frames.length - 1)];

  return (
    <section className="h3">
      <Link href={href(p)} className="h3-stage peek-stack" aria-label={p.title}>
        {frames.map((f, n) => (
          <div key={`${f.p.slug}/${f.ph.file}`} className={n === i ? "on" : ""}>
            {n <= reach && <Photo dir={dirOf(f.p)} photo={f.ph} alt={f.p.title} fill priority={n < 2} sizes="100vw" onLoad={() => setLoaded((s) => (s.has(n) ? s : new Set(s).add(n)))} />}
          </div>
        ))}
      </Link>
      <div className="h3-bar">
        <Link href={href(p)} className="h3-title">{p.title}</Link>
        <Tag p={p} />
      </div>
      <h2 className="h3-label mono">Recent work</h2>
      <div className="h3-grid">
        {items.map((q) => (
          <Card key={q.slug} p={q} sizes="(max-width: 720px) 100vw, 33vw" />
        ))}
      </div>
      <Link href="/projects/" className="h3-all">
        <span>All projects</span>
        <span className="mono">{String(projects.length).padStart(2, "0")} →</span>
      </Link>
    </section>
  );
}

export default function HomeView({ variant = site.homeStyle }: { variant?: HomeStyle }) {
  const items = recent();

  let body: React.ReactNode;
  if (variant === 2) {
    body = (
      <section className="h2">
        {items.map((p, i) => (
          <Link key={p.slug} href={href(p)} className="h2-item">
            <Photo dir={dirOf(p)} photo={coverOf(p)} alt={p.title} fill priority={i === 0} sizes="100vw" />
            <div className="h2-cap">
              <h3>{p.title}</h3>
              <Tag p={p} />
            </div>
          </Link>
        ))}
      </section>
    );
  } else if (variant === 3) {
    body = <Slideshow items={items} />;
  } else if (variant === 4) {
    body = (
      <section className="h4" aria-label="Recent projects">
        {items.map((p, i) => (
          <Card key={p.slug} p={p} priority={i < 3} sizes="(max-width: 720px) 80vw, 40vw" className="card h4-item" />
        ))}
      </section>
    );
  } else if (variant === 5) {
    const [first, ...rest] = items;
    body = (
      <section className="h5">
        {first && <Card p={first} priority sizes="100vw" className="card h5-lead" />}
        {rest.map((p) => (
          <Card key={p.slug} p={p} sizes="(max-width: 720px) 100vw, 33vw" />
        ))}
      </section>
    );
  } else {
    body = (
      <section className="grid home-grid" aria-label="Recent projects">
        {items.map((p, i) => (
          <Card key={p.slug} p={p} priority={i < 2} sizes="(max-width: 720px) 100vw, 50vw" />
        ))}
      </section>
    );
  }

  if (variant === 3) return body;

  return (
    <>
      {body}
      <div className="wrap home-more">
        <Link href="/projects/" className="mono">All projects →</Link>
      </div>
    </>
  );
}
