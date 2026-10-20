import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Photo from "@/components/Photo";
import { projects } from "@/data/projects";
import { coverOf, getProject, neighbours, src } from "@/lib/work";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    openGraph: { images: [src(p.slug, coverOf(p).file)] },
  };
}

export default async function ProjectPage({ params }: Props) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const { prev, next } = neighbours(p.slug);

  // Landscape photos span the full width, back-to-back portraits sit
  // side by side, and a lone portrait is centred on its own row.
  const isTall = (i: number) => !!p.photos[i] && p.photos[i].height > p.photos[i].width;
  const photos = p.photos.map((ph, i) => {
    if (!isTall(i)) return { ph, layout: "full", half: false };
    let run = 0;
    for (let j = i; isTall(j - 1); j--) run++;
    const paired = run % 2 === 0 ? isTall(i + 1) : true;
    return { ph, layout: paired ? "" : "solo", half: true };
  });

  return (
    <article>
      <header className="p-head">
        <div>
          <h1 className="title">{p.title}</h1>
          {p.summary && <p className="p-summary">{p.summary}</p>}
        </div>
        <dl className="p-facts mono">
          {p.client && (<><dt>Client</dt><dd style={{ color: "var(--ink)" }}>{p.client}</dd></>)}
          <dt>Category</dt><dd style={{ color: "var(--ink)" }}>{p.category}</dd>
          <dt>Year</dt><dd style={{ color: "var(--ink)" }}>{p.year}</dd>
          {p.location && (<><dt>Location</dt><dd style={{ color: "var(--ink)" }}>{p.location}</dd></>)}
        </dl>
      </header>

      <div className="p-photos">
        {photos.map(({ ph, layout, half }, i) => (
          <figure key={ph.file} className={layout}>
            <Photo
              dir={p.slug}
              photo={ph}
              alt={`${p.title}, photo ${i + 1}`}
              priority={i === 0}
              sizes={half ? "(max-width: 720px) 100vw, 50vw" : "100vw"}
            />
          </figure>
        ))}
      </div>

      <nav className="pager">
        {prev && (
          <Link href={`/projects/${prev.slug}/`}>
            <div className="mono">← Previous</div>
            <div className="t">{prev.title}</div>
          </Link>
        )}
        {next && (
          <Link href={`/projects/${next.slug}/`} className="next">
            <div className="mono">Next →</div>
            <div className="t">{next.title}</div>
          </Link>
        )}
      </nav>
    </article>
  );
}
