import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Photo from "@/components/Photo";
import { bts } from "@/data/projects";

export const metadata: Metadata = { title: "Behind the scenes" };

export default function Bts() {
  if (bts.length === 0) notFound();
  return (
    <>
      <div className="wrap" style={{ paddingTop: "clamp(40px, 6vw, 96px)", paddingBottom: 32 }}>
        <h1 className="title">Behind the scenes</h1>
      </div>
      <div className="masonry">
        {bts.map((ph) => (
          <figure key={ph.file}>
            <Photo dir="bts" photo={ph} sizes="(max-width: 720px) 100vw, 33vw" />
          </figure>
        ))}
      </div>
    </>
  );
}
