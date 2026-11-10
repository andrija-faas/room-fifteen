/** Decorative "lost today" rate: about €2.48M over a full day. */
export const LOSS_PER_SECOND = 28.73;

/** Integer euros "lost" since local midnight. Deterministic, so stable across reloads. */
export function lostTodayAt(date: Date): number {
  const midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const seconds = (date.getTime() - midnight.getTime()) / 1000;
  return Math.floor(seconds * LOSS_PER_SECOND);
}

const euro = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function formatEuro(n: number): string {
  return euro.format(n);
}
