"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Photo from "@/components/Photo";
import { projects, type Category, type Project } from "@/data/projects";
import { site } from "@/data/site";
import { coverOf, dirOf } from "@/lib/work";

const CATEGORIES: Category[] = ["Editorial", "Commercial", "Personal"];

// Three layouts for the same content (filter tabs, project titles, a
// cover that follows hover). Pick one with `indexStyle` in site.ts.
//   a  "Results": numbered table, cover pinned on the right
//   b  "Headline": large titles, cover follows the cursor
//   c  "Banner": wide cover across the top, titles in columns below
export type IndexStyle = "a" | "b" | "c";

export default function ProjectList({ variant = site.indexStyle }: { variant?: IndexStyle }) {
  const [filter, setFilter] = useState<Category | "All">("All");
  const shown = filter === "All" ? projects : projects.filter((p) => p.category === filter);
  const [active, setActive] = useState<string | undefined>(undefined);
  const current = shown.find((p) => p.slug === active) ?? shown[0];
  const cursor = useRef<HTMLDivElement>(null);

  const tabs = [
    { key: "All" as const, count: projects.length },
    ...CATEGORIES.map((c) => ({ key: c, count: projects.filter((p) => p.category === c).length })).filter((t) => t.count > 0),
  ];

  const tabBar = site.showFilters && tabs.length > 2 && (
    <div className="tabs mono" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={filter === t.key}
          onClick={() => { setFilter(t.key); setActive(undefined); }}
        >
          {t.key}<sup>{t.count}</sup>
        </button>
      ))}
    </div>
  );

  // Every cover is rendered once and faded in/out, so hovering is instant.
  const peek = (className: string, sizes: string) => (
    <div className={`peek-stack ${className}`} aria-hidden>
      {projects.map((p) => (
        <div key={p.slug} className={p.slug === current?.slug ? "on" : ""}>
          <Photo dir={dirOf(p)} photo={coverOf(p)} fill sizes={sizes} />
        </div>
      ))}
    </div>
  );

  const hover = (p: Project) => ({
    className: p.slug === current?.slug ? "on" : "",
    onMouseEnter: () => setActive(p.slug),
    onFocus: () => setActive(p.slug),
  });

  const num = (i: number) => String(i + 1).padStart(2, "0");

  if (variant === "b") {
    const move = (e: React.MouseEvent) => {
      const el = cursor.current;
      if (el) el.style.transform = `translate(${e.clientX + 40}px, ${e.clientY - 60}px)`;
    };
    return (
      <div className="ix-b" onMouseMove={move}>
        {tabBar}
        {peek("ix-b-mobile", "100vw")}
        <ul onMouseLeave={() => setActive(undefined)}>
          {shown.map((p) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}/`} {...hover(p)}>
                {p.title}<sup className="mono">{p.year}</sup>
              </Link>
            </li>
          ))}
        </ul>
        <div ref={cursor} className={`ix-b-cursor ${active ? "show" : ""}`} aria-hidden>
          {peek("", "260px")}
        </div>
      </div>
    );
  }

  if (variant === "c") {
    return (
      <div className="ix-c">
        {peek("ix-c-banner", "100vw")}
        <div className="ix-c-caption mono">
          <span>{current?.title}</span>
          <span>{[current?.client, current?.year].filter(Boolean).join(" · ")}</span>
        </div>
        {tabBar}
        <ul onMouseLeave={() => setActive(undefined)}>
          {shown.map((p, i) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}/`} {...hover(p)}>
                <span className="mono">{num(i)}</span>{p.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="ix-a">
      <div>
        {tabBar}
        <div className="ix-a-head mono">
          <span>No.</span><span>Project</span><span>Client</span><span>Year</span>
        </div>
        <ul onMouseLeave={() => setActive(undefined)}>
          {shown.map((p, i) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}/`} {...hover(p)}>
                <span className="mono">{num(i)}</span>
                <span className="t">{p.title}</span>
                <span>{p.client ?? "—"}</span>
                <span className="mono">{p.year}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {peek("ix-a-peek", "(max-width: 720px) 100vw, 40vw")}
    </div>
  );
}
