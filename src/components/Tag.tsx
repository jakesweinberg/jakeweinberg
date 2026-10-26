import type { Project } from "@/data/projects";
import { site } from "@/data/site";

// "CLIENT · 2026", or "EDITORIAL · CLIENT · 2026" with categories on
export default function Tag({ p, className = "" }: { p: Project; className?: string }) {
  const bits = [site.showCategories && p.category, p.client, p.year].filter(Boolean);
  return <span className={`mono ${className}`}>{bits.join(" · ")}</span>;
}
