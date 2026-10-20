import { bts, collage, projects, type Photo, type Project } from "@/data/projects";

export const src = (slug: string, file: string) => `/images/${slug}/${file}`;

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const coverOf = (p: Project): Photo =>
  p.photos.find((ph) => ph.file === p.cover) ?? p.photos[0];

export const featured = () => projects.filter((p) => p.featured);

export const hasBts = bts.length > 0;

export type CollageItem = { project: Project; photo: Photo };

export function collageItems(): CollageItem[] {
  if (collage.length === 0) {
    // Default: first two photos of each featured project, interleaved
    // so neighbouring tiles come from different shoots.
    const f = featured();
    return [0, 1].flatMap((n) =>
      f.flatMap((project) => (project.photos[n] ? [{ project, photo: project.photos[n] }] : [])),
    );
  }
  return collage.flatMap((ref) => {
    const [slug, file] = ref.split("/");
    const project = getProject(slug);
    const photo = project?.photos.find((ph) => ph.file === file);
    return project && photo ? [{ project, photo }] : [];
  });
}

export function neighbours(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? projects[i - 1] : undefined,
    next: i < projects.length - 1 ? projects[i + 1] : undefined,
  };
}
