"use client";

import { useEffect, useState } from "react";
import Photo from "@/components/Photo";
import { bts, isVideo, type BtsItem } from "@/data/bts";

function shuffle(items: BtsItem[]): BtsItem[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function BtsCollage() {
  // The page is pre-rendered, so shuffle after it loads in the browser
  // (a new order on every visit) and fade in once shuffled.
  const [items, setItems] = useState<BtsItem[] | null>(null);
  useEffect(() => setItems(shuffle(bts)), []);

  return (
    <div className={`bts ${items ? "on" : ""}`}>
      {(items ?? bts).map((t, i) => (
        <figure key={t.file}>
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
