"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Client-only: Next 16 cache components forbid `new Date()` during prerender. */
export default function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => null,
  );
  return <>{year ?? ""}</>;
}
