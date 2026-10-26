import type { Project } from "@/data/projects";
import { site } from "@/data/site";
import { dateOf } from "@/lib/work";

// "CLIENT · OCT 2026", or "EDITORIAL · CLIENT · OCT 2026" with categories on
export default function Tag({ p, className = "" }: { p: Project; className?: string }) {
  const bits = [site.showCategories && p.category, p.client, dateOf(p)].filter(Boolean);
  return <span className={`mono ${className}`}>{bits.join(" · ")}</span>;
}
