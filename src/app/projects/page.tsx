import type { Metadata } from "next";
import ProjectList from "@/components/ProjectList";

export const metadata: Metadata = { title: "Projects" };

export default function Projects() {
  return (
    <div className="wrap page-top">
      <h1 className="mono index-label">Projects</h1>
      <ProjectList />
    </div>
  );
}
