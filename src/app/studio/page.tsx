import type { Metadata } from "next";
import Studio from "@/components/Studio";

// Private editing page. Not linked anywhere and kept out of search.
export const metadata: Metadata = { title: "Studio", robots: { index: false, follow: false } };

export default function StudioPage() {
  return <Studio />;
}
