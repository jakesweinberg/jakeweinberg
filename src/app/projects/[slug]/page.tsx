import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Photo from "@/components/Photo";
import { projects, type Photo as PhotoT } from "@/data/projects";
import { coverOf, getProject, neighbours, photoRows, src } from "@/lib/work";

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

  const rows = photoRows(p.photos);
  const n = (ph: PhotoT) => p.photos.indexOf(ph) + 1;

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
        {rows.map((row, r) => (
          <div key={row[0].file} className={`p-row ${row.length === 1 && row[0].height > row[0].width ? "solo" : ""}`}>
            {row.map((ph) => (
              <figure key={ph.file} style={{ flex: row.length === 2 ? ph.width / ph.height : 1 }}>
                <Photo
                  dir={p.slug}
                  photo={ph}
                  alt={`${p.title}, photo ${n(ph)}`}
                  priority={r === 0}
                  sizes={row.length === 2 ? "50vw" : "100vw"}
                />
              </figure>
            ))}
          </div>
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
