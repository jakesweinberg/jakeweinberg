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
  { file: "IMG_0211.JPG", width: 2250, height: 3000 },
  { file: "IMG_0325.JPG", width: 2250, height: 3000 },
  { file: "IMG_0535.JPG", width: 2250, height: 3000 },
  { file: "IMG_0589.JPG", width: 2250, height: 3000 },
  { file: "IMG_0661.jpg", width: 1688, height: 3000 },
  { file: "IMG_0746.JPG", width: 2250, height: 3000 },
  { file: "IMG_2164.PNG", width: 1179, height: 2556 },
  { file: "IMG_8259.JPG", width: 2250, height: 3000 },
  { file: "IMG_8493.JPG", width: 2250, height: 3000 },
  { file: "IMG_9038.JPG", width: 2250, height: 3000 },
  { file: "IMG_9409.JPG", width: 1688, height: 3000 },
  { file: "IMG_9846.JPG", width: 1688, height: 3000 },
  { file: "IMG_9899.JPG", width: 1688, height: 3000 },
  { file: "IMG_9946.JPG", width: 1688, height: 3000 },
  { file: "ShaqFinal.mp4", width: 508, height: 960 },
  { file: "g2.mp4", width: 960, height: 720 },
];

export const isVideo = (file: string) => /\.(mp4|webm|mov)$/i.test(file);
