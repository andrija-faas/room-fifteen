import { expect, test } from "vitest";
import { addToWaitlist, isWaitlistOpen, normalizeEmail } from "@/lib/waitlist";

test("trims and lowercases", () => {
  expect(normalizeEmail("  Gary@Example.COM ")).toBe("gary@example.com");
});

test.each([undefined, null, 42, {}, "", "   ", "gary", "gary@", "a b@c.d", "x@y", `${"a".repeat(250)}@b.co`])(
  "rejects %s",
  (v) => {
    expect(normalizeEmail(v)).toBeNull();
  },
);

test("open in dev without key", () => {
  expect(isWaitlistOpen({ NODE_ENV: "development" })).toBe(true);
});

test("closed in prod without key", () => {
  expect(isWaitlistOpen({ NODE_ENV: "production" })).toBe(false);
});

test("closed in prod with empty key", () => {
  expect(isWaitlistOpen({ NODE_ENV: "production", RESEND_API_KEY: "" })).toBe(false);
});

test("closed in prod with key while storage is still a stub", () => {
  expect(isWaitlistOpen({ NODE_ENV: "production", RESEND_API_KEY: "re_x" })).toBe(false);
});

test("open in prod with key once storage is implemented", () => {
  expect(isWaitlistOpen({ NODE_ENV: "production", RESEND_API_KEY: "re_x" }, true)).toBe(true);
});

test("addToWaitlist resolves", async () => {
  await expect(addToWaitlist("a@b.co")).resolves.toBeUndefined();
});
