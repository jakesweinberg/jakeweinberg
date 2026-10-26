import type { Metadata } from "next";
import ProjectList, { type IndexStyle } from "@/components/ProjectList";

// Side-by-side previews of the Projects page styles. Not linked anywhere.
const NAMES: Record<IndexStyle, string> = { a: "Results", b: "Follow", c: "Banner" };

type Props = { params: Promise<{ style: IndexStyle }> };

export const dynamicParams = false;
export const generateStaticParams = () => (Object.keys(NAMES) as IndexStyle[]).map((style) => ({ style }));
export const metadata: Metadata = { title: "Preview", robots: { index: false } };

export default async function Preview({ params }: Props) {
  const { style } = await params;
  return (
    <div className="wrap page-top">
      <h1 className="mono index-label">Projects · Style {style.toUpperCase()}: {NAMES[style]}</h1>
      <ProjectList variant={style} />
    </div>
  );
}
