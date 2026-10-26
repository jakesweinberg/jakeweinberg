"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Photo from "@/components/Photo";
import Tag from "@/components/Tag";
import type { Project } from "@/data/projects";
import { site } from "@/data/site";
import { coverOf, dirOf, recent } from "@/lib/work";

// Five layouts for the home page's recent projects. Pick one with
// `homeStyle` in site.ts; compare them at /preview/home/1/ ... /5/.
//   1 Grid      two-column cards
//   2 Stack     full-width covers, one after another, title on the image
//   3 Slideshow one large cover that cycles, recent titles listed below
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

function Slideshow({ items }: { items: Project[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % items.length), 4000);
    return () => clearInterval(t);
  }, [items.length, i]);
  const p = items[i];
  return (
    <section className="h3">
      <Link href={href(p)} className="h3-stage peek-stack" aria-label={p.title}>
        {items.map((q, n) => (
          <div key={q.slug} className={n === i ? "on" : ""}>
            <Photo dir={dirOf(q)} photo={coverOf(q)} alt={q.title} fill priority={n === 0} sizes="100vw" />
          </div>
        ))}
      </Link>
      <div className="h3-bar mono">
        <span className="h3-title">{p.title}</span>
        <span>{String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
      </div>
      <ul className="h3-list">
        {items.map((q, n) => (
          <li key={q.slug}>
            <Link href={href(q)} className={n === i ? "on" : ""} onMouseEnter={() => setI(n)}>
              {q.title}
            </Link>
          </li>
        ))}
      </ul>
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

  return (
    <>
      {body}
      <div className="wrap home-more">
        <Link href="/projects/" className="mono">All projects →</Link>
      </div>
    </>
  );
}
