import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BtsCollage from "@/components/BtsCollage";
import { bts } from "@/data/bts";

export const metadata: Metadata = { title: "Behind the scenes" };

export default function Bts() {
  if (bts.length === 0) notFound();
  return (
    <>
      <div className="wrap page-top">
        <h1 className="title">Behind the scenes</h1>
      </div>
      <BtsCollage />
    </>
  );
}
