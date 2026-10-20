import Link from "next/link";
import Photo from "@/components/Photo";
import Tag from "@/components/Tag";
import { collageItems, coverOf, featured } from "@/lib/work";

export default function Home() {
  return (
    <>
      <section className="collage" aria-label="Selected work">
        {collageItems().map(({ project, photo }, i) => (
          <Link key={`${project.slug}/${photo.file}`} href={`/projects/${project.slug}/`}>
            <Photo
              dir={project.slug}
              photo={photo}
              alt={project.title}
              priority={i < 3}
              sizes="(max-width: 720px) 50vw, 33vw"
            />
            <span className="cap mono">{project.title}</span>
          </Link>
        ))}
      </section>

      <div className="section-head">
        <h2 className="mono" style={{ margin: 0 }}>Featured</h2>
        <Link href="/work/" className="mono">All work →</Link>
      </div>
      <section className="grid">
        {featured().map((p) => (
          <Link key={p.slug} href={`/projects/${p.slug}/`} className="card">
            <div className="thumb">
              <Photo dir={p.slug} photo={coverOf(p)} alt={p.title} sizes="(max-width: 720px) 100vw, 50vw" />
            </div>
            <div className="meta">
              <h3>{p.title}</h3>
              <Tag p={p} />
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
