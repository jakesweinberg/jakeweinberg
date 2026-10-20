import type { Metadata } from "next";
import WorkList from "@/components/WorkList";

export const metadata: Metadata = { title: "Index" };

export default function Work() {
  return (
    <>
      <div className="wrap" style={{ paddingTop: "clamp(40px, 6vw, 96px)", paddingBottom: 32 }}>
        <h1 className="title">Index</h1>
      </div>
      <WorkList />
    </>
  );
}
