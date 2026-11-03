import { posterSrc, videoSrc } from "@/lib/work";

// A silent looping video clip, sized like a photo so the page doesn't jump while it loads.
export default function Clip({ dir, file, width, height, fill, label }: { dir: string; file: string; width: number; height: number; fill?: boolean; label?: string }) {
  return (
    <video
      className={fill ? "clip fill" : "clip"}
      src={encodeURI(videoSrc(dir, file))}
      poster={encodeURI(posterSrc(dir, file))}
      width={width}
      height={height}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    />
  );
}
