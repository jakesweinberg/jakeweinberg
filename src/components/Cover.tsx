import Clip from "@/components/Clip";
import Photo from "@/components/Photo";
import type { Project } from "@/data/projects";
import { coverOf, dirOf } from "@/lib/work";

// A project's cover: its cover video if it has one (silent, looping), otherwise its cover photo.
export default function Cover({ p, sizes, fill, alt }: { p: Project; sizes: string; fill?: boolean; alt?: string }) {
  const v = p.coverVideo;
  if (!v) return <Photo dir={dirOf(p)} photo={coverOf(p)} alt={alt} sizes={sizes} fill={fill} />;
  return <Clip dir={dirOf(p)} file={v.file} width={v.width} height={v.height} fill={fill} label={alt} />;
}
