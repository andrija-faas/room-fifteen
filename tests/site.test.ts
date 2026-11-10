import { expect, test } from "vitest";
import { siteUrl } from "@/lib/site";

test("explicit site url wins", () => {
  expect(siteUrl({ NEXT_PUBLIC_SITE_URL: "https://roomfifteen.com", VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app" }).href).toBe(
    "https://roomfifteen.com/",
  );
});

test("falls back to vercel production domain", () => {
  expect(siteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "room-fifteen.vercel.app" }).href).toBe(
    "https://room-fifteen.vercel.app/",
  );
});

test("falls back to localhost", () => {
  expect(siteUrl({}).href).toBe("http://localhost:3000/");
});
