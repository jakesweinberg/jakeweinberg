"use client";

import Link from "next/link";
import { useState } from "react";
import Photo from "@/components/Photo";
import { projects, type Category } from "@/data/projects";
import { site } from "@/data/site";
import { coverOf, dirOf } from "@/lib/work";

const CATEGORIES: Category[] = ["Editorial", "Commercial", "Personal"];

export default function ProjectList() {
  const [filter, setFilter] = useState<Category | "All">("All");
  const shown = filter === "All" ? projects : projects.filter((p) => p.category === filter);
  const [active, setActive] = useState<string | undefined>(undefined);
  const current = shown.find((p) => p.slug === active) ?? shown[0];

  const tabs = [
    { key: "All" as const, count: projects.length },
    ...CATEGORIES.map((c) => ({ key: c, count: projects.filter((p) => p.category === c).length })).filter((t) => t.count > 0),
  ];

  return (
    <div className="index">
      {/* Every cover is rendered once and faded in/out, so hovering is instant */}
      <div className="index-peek" aria-hidden>
        {projects.map((p) => (
          <div key={p.slug} className={p.slug === current?.slug ? "on" : ""}>
            <Photo dir={dirOf(p)} photo={coverOf(p)} fill sizes="(max-width: 720px) 100vw, 30vw" />
          </div>
        ))}
      </div>

      <div className="index-list">
        {site.showFilters && tabs.length > 2 && (
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
        )}
        <ul onMouseLeave={() => setActive(undefined)}>
          {shown.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/projects/${p.slug}/`}
                className={p.slug === current?.slug ? "on" : ""}
                onMouseEnter={() => setActive(p.slug)}
                onFocus={() => setActive(p.slug)}
              >
                {p.title}
                {site.showCategories && p.category && <span className="mono"> {p.category}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
