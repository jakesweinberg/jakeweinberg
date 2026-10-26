// ─────────────────────────────────────────────────────────────
// BEHIND THE SCENES
// Drop photos and videos into  public/images/bts/  and list them
// here. Order doesn't matter: the BTS page shuffles them into a new
// collage on every visit. Videos (.mp4) play silently on a loop.
// Leave the list empty to hide the BTS page.
// ─────────────────────────────────────────────────────────────

export type BtsItem = {
  file: string; // filename inside public/images/bts/
  width: number;
  height: number;
  alt?: string;
};

export const bts: BtsItem[] = [
  { file: "01.jpg", width: 2400, height: 1600 },
  { file: "02.jpg", width: 1600, height: 2000 },
  { file: "03.jpg", width: 2400, height: 1600 },
  { file: "04.jpg", width: 1600, height: 2400 },
  { file: "05.jpg", width: 2000, height: 2000 },
  { file: "06.jpg", width: 2400, height: 1600 },
  { file: "07.jpg", width: 1600, height: 2000 },
  { file: "08.jpg", width: 2400, height: 1600 },
  { file: "clip-01.mp4", width: 1080, height: 1350 },
  { file: "clip-02.mp4", width: 1920, height: 1080 },
];

export const isVideo = (file: string) => /\.(mp4|webm|mov)$/i.test(file);
