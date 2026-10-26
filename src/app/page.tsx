import Link from "next/link";
import Photo from "@/components/Photo";
import Tag from "@/components/Tag";
import { coverOf, recent } from "@/lib/work";

export default function Home() {
  return (
    <>
      <section className="grid home-grid" aria-label="Recent projects">
        {recent().map((p, i) => (
          <Link key={p.slug} href={`/projects/${p.slug}/`} className="card">
            <div className="thumb">
              <Photo dir={p.slug} photo={coverOf(p)} alt={p.title} priority={i < 2} sizes="(max-width: 720px) 100vw, 50vw" />
            </div>
            <div className="meta">
              <h3>{p.title}</h3>
              <Tag p={p} />
            </div>
          </Link>
        ))}
      </section>
      <div className="wrap home-more">
        <Link href="/projects/" className="mono">All projects →</Link>
      </div>
    </>
  );
}
