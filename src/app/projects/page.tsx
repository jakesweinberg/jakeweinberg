import type { Metadata } from "next";
import ProjectList from "@/components/ProjectList";

export const metadata: Metadata = { title: "Projects" };

export default function Projects() {
  return (
    <>
      <div className="wrap page-top">
        <h1 className="title">Projects</h1>
      </div>
      <ProjectList />
    </>
  );
}
