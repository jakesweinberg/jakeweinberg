import type { Metadata } from "next";
import HomeView, { type HomeStyle } from "@/components/HomeView";

// Previews of the home page layouts. Not linked anywhere.
const NAMES = ["Grid", "Stack", "Slideshow", "Strip", "Mosaic"];

type Props = { params: Promise<{ n: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => NAMES.map((_, i) => ({ n: String(i + 1) }));
export const metadata: Metadata = { title: "Preview", robots: { index: false } };

export default async function Preview({ params }: Props) {
  const n = Number((await params).n) as HomeStyle;
  return (
    <>
      <p className="wrap mono" style={{ margin: "0 0 12px" }}>Home · Option {n}: {NAMES[n - 1]}</p>
      <HomeView variant={n} />
    </>
  );
}
