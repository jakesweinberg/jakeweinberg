import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="footer mono">
      <span>© {new Date().getFullYear()} {site.name} · {site.location}</span>
      <span>
        <a href={`mailto:${site.email}`}>Email</a>
        {"  ·  "}
        <a href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noreferrer">Instagram</a>
      </span>
    </footer>
  );
}
