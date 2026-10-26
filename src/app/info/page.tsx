import type { Metadata } from "next";
import Photo from "@/components/Photo";
import { info, site } from "@/data/site";

export const metadata: Metadata = { title: "Info" };

export default function Info() {
  return (
    <section className="info">
      <div>
        {info.portrait && (
          <figure className="info-portrait">
            <Photo dir="info" photo={info.portrait} alt={site.shortName} priority sizes="(max-width: 720px) 100vw, 25vw" />
          </figure>
        )}
        <div className="info-bio">
          {info.bio.map((para) => <p key={para}>{para}</p>)}
        </div>
      </div>
      <div>
        <h2 className="mono">Contact</h2>
        <ul>
          {info.links.filter((l) => l.href).map((l) => (
            <li key={l.label}>
              <span className="mono">{l.label}</span>
              <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{l.text}</a>
            </li>
          ))}
        </ul>
        {info.clients.length > 0 && (
          <>
            <h2 className="mono">Clients</h2>
            <ul>{info.clients.map((c) => <li key={c}>{c}</li>)}</ul>
          </>
        )}
        {info.publications.length > 0 && (
          <>
            <h2 className="mono">Publications</h2>
            <ul>{info.publications.map((c) => <li key={c}>{c}</li>)}</ul>
          </>
        )}
      </div>
    </section>
  );
}
