"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

// Plays through the photos of each recent project like a fast reel. The title bar follows along, and
// hovering a title jumps to that project.
const FRAME_MS = 350;
const PER_PROJECT = 6;

function Slideshow({ items }: { items: Project[] }) {
  const frames = items.flatMap((p, pi) => p.photos.slice(0, PER_PROJECT).map((ph) => ({ p, pi, ph })));
  const [i, setI] = useState(0);
  const [peek, setPeek] = useState<string | null>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent) => {
    const el = cursor.current;
    if (el) el.style.transform = `translate(${e.clientX + 40}px, ${e.clientY - 60}px)`;
  };
  useEffect(() => {
    const t = setTimeout(() => setI((n) => (n + 1) % frames.length), FRAME_MS);
    return () => clearTimeout(t);
  }, [i, frames.length]);
  const { p, pi } = frames[i];
  const jump = (n: number) => setI(frames.findIndex((f) => f.pi === n));

  return (
    <section className="h3">
      <Link href={href(p)} className="h3-stage peek-stack" aria-label={p.title}>
        {frames.map((f, n) => (
          <div key={`${f.p.slug}/${f.ph.file}`} className={n === i ? "on" : ""}>
            <Photo dir={dirOf(f.p)} photo={f.ph} alt={f.p.title} fill priority={n < 2} sizes="100vw" />
          </div>
        ))}
      </Link>
      <div className="h3-bar mono">
        <span className="h3-title">{p.title}</span>
        <span>{String(pi + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
      </div>
      <ul className="h3-list" onMouseMove={move} onMouseLeave={() => setPeek(null)}>
        {items.map((q, n) => (
          <li key={q.slug}>
            <Link href={href(q)} className={n === pi ? "on" : ""} onMouseEnter={() => { jump(n); setPeek(q.slug); }}>
              {q.title}
            </Link>
          </li>
        ))}
      </ul>
      {/* Cover that follows the cursor over the titles, as on Projects */}
      <div ref={cursor} className={`ix-b-cursor ${peek ? "show" : ""}`} aria-hidden>
        <div className="peek-stack">
          {items.map((q) => (
            <div key={q.slug} className={q.slug === peek ? "on" : ""}>
              <Photo dir={dirOf(q)} photo={coverOf(q)} fill sizes="260px" />
            </div>
          ))}
        </div>
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
