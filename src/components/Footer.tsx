import { info, site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="footer mono">
      <span>© {new Date().getFullYear()} {site.name} · {site.location}</span>
      <span className="footer-links">
        {info.links.map((l) => (
          <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
            {l.label}
          </a>
        ))}
      </span>
    </footer>
  );
}
