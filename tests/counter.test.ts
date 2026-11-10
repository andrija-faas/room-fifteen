import { expect, test } from "vitest";
import { LOSS_PER_SECOND, formatEuro, lostTodayAt } from "@/lib/counter";

test("is 0 at local midnight", () => {
  expect(lostTodayAt(new Date(2026, 0, 1, 0, 0, 0))).toBe(0);
});

test("one hour in", () => {
  expect(LOSS_PER_SECOND).toBe(28.73);
  expect(lostTodayAt(new Date(2026, 0, 1, 1, 0, 0))).toBe(Math.floor(3600 * 28.73));
});

test("monotonic within a day", () => {
  const a = lostTodayAt(new Date(2026, 0, 1, 12, 0, 0));
  const b = lostTodayAt(new Date(2026, 0, 1, 12, 0, 1));
  expect(b).toBeGreaterThanOrEqual(a);
});

test("counts sub-second progress so the ticker moves", () => {
  const a = lostTodayAt(new Date(2026, 0, 1, 12, 0, 0, 0));
  const b = lostTodayAt(new Date(2026, 0, 1, 12, 0, 0, 500));
  expect(b).toBeGreaterThan(a);
});

test("resets after midnight", () => {
  expect(lostTodayAt(new Date(2026, 0, 2, 0, 0, 1))).toBeLessThan(
    lostTodayAt(new Date(2026, 0, 1, 23, 59, 59)),
  );
});

test("formats euros", () => {
  expect(formatEuro(2481904)).toBe("€2,481,904");
});
