"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

// Runs before the page paints: skips the slate if it already played this
// visit, or if the visitor's device asks for less motion.
export const introScript = `try{if(sessionStorage.getItem("intro")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("no-intro");else sessionStorage.setItem("intro","1")}catch(e){}`;

const pad = (n: number) => String(n).padStart(2, "0");

// Clapper board shown over the site when it opens. The stick claps shut,
// then the slate lifts away. Click or tap to skip.
export default function Intro() {
  const [gone, setGone] = useState(false);
  const [date, setDate] = useState("");
  useEffect(() => {
    const d = new Date();
    setDate(`${pad(d.getMonth() + 1)}.${pad(d.getDate())}.${String(d.getFullYear()).slice(2)}`);
  }, []);
  if (gone) return null;

  return (
    <div
      className="intro"
      aria-hidden
      onClick={() => setGone(true)}
      onAnimationEnd={(e) => e.target === e.currentTarget && setGone(true)}
    >
      <div className="slate">
        <div className="slate-stick slate-top" />
        <div className="slate-stick slate-base" />
        <div className="slate-board">
          <div className="slate-cell slate-wide">
            <span>Prod.</span>
            <strong>{site.name}</strong>
          </div>
          <div className="slate-cell"><span>Roll</span><b>01</b></div>
          <div className="slate-cell"><span>Scene</span><b>01</b></div>
          <div className="slate-cell"><span>Take</span><b>01</b></div>
          <div className="slate-cell slate-half"><span>Date</span><b>{date}</b></div>
          <div className="slate-cell slate-half"><span>Location</span><b>Summit, NJ</b></div>
        </div>
      </div>
    </div>
  );
}
