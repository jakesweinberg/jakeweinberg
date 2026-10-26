"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Photo from "@/components/Photo";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { coverOf } from "@/lib/work";

export default function ProjectList() {
  const [hover, setHover] = useState<string | null>(null);
  const peek = useRef<HTMLDivElement>(null);
  const cat = site.showCategories;

  const move = (e: React.MouseEvent) => {
    const el = peek.current;
    if (el) el.style.transform = `translate(${e.clientX + 24}px, ${e.clientY - 90}px)`;
  };

  return (
    <div className="list" onMouseMove={move} onMouseLeave={() => setHover(null)}>
      <div className={`row list-head mono ${cat ? "" : "nocat"}`}>
        <span>Project</span><span>Client</span>{cat && <span>Category</span>}<span className="y">Year</span>
      </div>
      {projects.map((p) => (
        <Link key={p.slug} href={`/projects/${p.slug}/`} className={`row ${cat ? "" : "nocat"}`} onMouseEnter={() => setHover(p.slug)}>
          <span className="thumb-m">
            <Photo dir={p.slug} photo={coverOf(p)} alt={p.title} sizes="100vw" />
          </span>
          <span className="t">{p.title}</span>
          <span className="cl">{p.client ?? "—"}</span>
          {cat && <span className="c mono">{p.category ?? "—"}</span>}
          <span className="y mono">{p.year}</span>
        </Link>
      ))}
      <div ref={peek} className={`peek ${hover ? "on" : ""}`} style={{ left: 0, top: 0 }} aria-hidden>
        {projects.map((p) => (
          <div key={p.slug} style={{ display: hover === p.slug ? "block" : "none", height: "100%" }}>
            <Photo dir={p.slug} photo={coverOf(p)} sizes="280px" />
          </div>
        ))}
      </div>
    </div>
  );
}
