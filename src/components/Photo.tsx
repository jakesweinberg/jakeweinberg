import Image from "next/image";
import type { Photo as P } from "@/data/projects";
import { src } from "@/lib/work";

type Props = {
  dir: string;
  photo: P;
  sizes: string;
  alt?: string;
  priority?: boolean;
  fill?: boolean;
};

// Thin wrapper around next/image that knows where project photos live.
export default function Photo({ dir, photo, sizes, alt, priority, fill }: Props) {
  const common = {
    src: src(dir, photo.file),
    alt: photo.alt ?? alt ?? "",
    sizes,
    priority,
  };
  return fill ? (
    <Image {...common} fill />
  ) : (
    <Image {...common} width={photo.width} height={photo.height} />
  );
}
