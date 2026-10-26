"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Photo from "@/components/Photo";
import { projects, type Category, type Project } from "@/data/projects";
import { site } from "@/data/site";
import { coverOf, dateOf, dirOf } from "@/lib/work";

const CATEGORIES: Category[] = ["Editorial", "Commercial", "Personal"];

// Two layouts for the same content (filter tabs, a project table, a
// cover that follows hover). Pick one with `indexStyle` in site.ts.
//   a  "Results": numbered table, cover pinned on the right
//   b  "Follow": the same table, cover follows the cursor
export type IndexStyle = "a" | "b";

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

  // Results table (as in "a") with the cover following the cursor.
  const table = (
    <>
      {tabBar}
      <div className="ix-a-head mono">
        <span>No.</span><span>Project</span><span>Client</span><span>Date</span>
      </div>
      <ul onMouseLeave={() => setActive(undefined)}>
        {shown.map((p, i) => (
          <li key={p.slug}>
            <Link href={`/projects/${p.slug}/`} {...hover(p)}>
              <span className="mono">{num(i)}</span>
              <span className="t">{p.title}</span>
              <span>{p.client ?? "—"}</span>
              <span className="mono">{dateOf(p)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );

  if (variant === "b") {
    const move = (e: React.MouseEvent) => {
      const el = cursor.current;
      if (!el) return;
      // Flips above the cursor near the bottom of the screen so the cover never runs off it.
      const below = e.clientY - 60;
      const y = below + el.offsetHeight + 16 > window.innerHeight ? e.clientY - el.offsetHeight - 24 : below;
      el.style.transform = `translate(${e.clientX + 40}px, ${y}px)`;
    };
    return (
      <div className="ix-a ix-b" onMouseMove={move}>
        {peek("ix-b-mobile", "100vw")}
        <div>{table}</div>
        <div ref={cursor} className={`ix-b-cursor ${active ? "show" : ""}`} aria-hidden>
          {peek("", "260px")}
        </div>
      </div>
    );
  }

  return (
    <div className="ix-a">
      <div>{table}</div>
      {peek("ix-a-peek", "(max-width: 720px) 100vw, 40vw")}
    </div>
  );
}
