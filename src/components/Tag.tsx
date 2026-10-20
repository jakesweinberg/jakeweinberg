import type { Project } from "@/data/projects";

// "EDITORIAL · 2026 · CLIENT"
export default function Tag({ p, className = "" }: { p: Project; className?: string }) {
  const bits = [p.category, p.year, p.client].filter(Boolean);
  return <span className={`mono ${className}`}>{bits.join(" · ")}</span>;
}
