"use client";

import { useEffect, useState } from "react";
import Photo from "@/components/Photo";
import { bts, isVideo, type BtsItem } from "@/data/bts";

type Tile = BtsItem & { width_pct: number; align: "start" | "center" | "end"; drop: number };

// Shuffles the BTS items and gives each a random size, alignment and
// offset, so every visit gets a different collage.
function arrange(items: BtsItem[]): Tile[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  const aligns = ["start", "center", "end"] as const;
  return a.map((it) => ({
    ...it,
    width_pct: 60 + Math.round(Math.random() * 40),
    align: aligns[Math.floor(Math.random() * 3)],
    drop: Math.round(Math.random() * 48),
  }));
}

export default function BtsCollage() {
  // The page is pre-rendered, so shuffle after it loads in the browser
  // and fade in once arranged.
  const [tiles, setTiles] = useState<Tile[] | null>(null);
  useEffect(() => setTiles(arrange(bts)), []);

  return (
    <div className={`bts ${tiles ? "on" : ""}`}>
      {(tiles ?? bts.map((b) => ({ ...b, width_pct: 100, align: "start" as const, drop: 0 }))).map((t, i) => (
        <figure
          key={t.file}
          style={{
            width: `${t.width_pct}%`,
            marginTop: t.drop,
            marginLeft: t.align === "start" ? 0 : "auto",
            marginRight: t.align === "end" ? 0 : "auto",
          }}
        >
          {isVideo(t.file) ? (
            <video
              src={`/images/bts/${t.file}`}
              width={t.width}
              height={t.height}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              style={{ aspectRatio: `${t.width} / ${t.height}` }}
            />
          ) : (
            <Photo dir="bts" photo={t} priority={i < 3} sizes="(max-width: 720px) 50vw, 33vw" alt={t.alt ?? "Behind the scenes"} />
          )}
        </figure>
      ))}
    </div>
  );
}
