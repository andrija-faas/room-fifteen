"use client";

import { useEffect, useState } from "react";
import { formatEuro, lostTodayAt } from "@/lib/counter";

export default function LossCounter() {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setValue(lostTodayAt(new Date()));
    update();
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(update, 100);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="text-sm text-muted sm:text-base" aria-live="off">
      <span className="glow-gold font-mono font-medium tabular-nums text-gold">
        {value === null ? "€—" : formatEuro(value)}
      </span>{" "}
      lost today. None of it at a casino.
    </p>
  );
}
