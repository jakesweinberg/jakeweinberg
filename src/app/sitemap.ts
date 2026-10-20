import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/work/", "/info/", "/bts/"].map((p) => `${site.url}${p || "/"}`);
  return [...pages, ...projects.map((p) => `${site.url}/projects/${p.slug}/`)].map((url) => ({ url }));
}
