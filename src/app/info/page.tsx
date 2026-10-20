import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Info" };

export default function Info() {
  return (
    <section className="info">
      <div>
        {site.bio.map((para) => <p key={para}>{para}</p>)}
      </div>
      <div>
        <h2 className="mono" style={{ margin: 0 }}>Contact</h2>
        <ul>
          <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
          <li><a href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noreferrer">@{site.instagram}</a></li>
          <li>{site.location}</li>
        </ul>
        <h2 className="mono" style={{ margin: 0 }}>Selected clients</h2>
        <ul>
          {site.clients.map((c) => <li key={c}>{c}</li>)}
        </ul>
      </div>
    </section>
  );
}
