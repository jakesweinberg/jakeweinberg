"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/data/site";
import { hasBts } from "@/lib/work";

const links = [
  { href: "/work/", label: "Index" },
  ...(hasBts ? [{ href: "/bts/", label: "BTS" }] : []),
  { href: "/info/", label: "Info" },
];

export default function Header() {
  const path = usePathname();
  return (
    <header className="header">
      <Link href="/" className="brand">{site.shortName}</Link>
      <nav className="nav">
        {links.map((l) => (
          <Link key={l.href} href={l.href} aria-current={path.startsWith(l.href.slice(0, -1)) ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
