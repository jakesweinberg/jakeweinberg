"use client";

import { useEffect, useState } from "react";

// The page is built ahead of time, so the year baked into it would go stale.
// This shows the build year, then the visitor's current year once loaded.
export default function Year({ built }: { built: number }) {
  const [year, setYear] = useState(built);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <>{year}</>;
}
