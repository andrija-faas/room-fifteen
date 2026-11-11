// @vitest-environment node
import { beforeEach, expect, test, vi } from "vitest";

const { addSpy, openMock } = vi.hoisted(() => ({
  addSpy: vi.fn<(email: string) => Promise<void>>(),
  openMock: vi.fn<() => boolean>(),
}));

vi.mock("@/lib/waitlist", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/lib/waitlist")>();
  return { ...real, addToWaitlist: addSpy, isWaitlistOpen: openMock };
});

import { POST } from "@/app/api/waitlist/route";

const req = (body: string) =>
  new Request("http://x/api/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });

beforeEach(() => {
  addSpy.mockReset().mockResolvedValue(undefined);
  openMock.mockReset().mockReturnValue(true);
});

test("valid email → 200 and normalized email passed", async () => {
  const res = await POST(req(JSON.stringify({ email: " A@B.co " })));
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({ ok: true });
  expect(addSpy).toHaveBeenCalledWith("a@b.co");
});

test("invalid JSON → 400", async () => {
  expect((await POST(req("{nope"))).status).toBe(400);
});

test("non-object body → 400", async () => {
  expect((await POST(req('"a@b.co"'))).status).toBe(400);
  expect((await POST(req("null"))).status).toBe(400);
});

test("missing email → 400 with copy", async () => {
  const res = await POST(req("{}"));
  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({ error: "That doesn't look like an email. Even we have standards." });
});

test("non-string email → 400", async () => {
  expect((await POST(req('{"email":5}'))).status).toBe(400);
});

test("honeypot → 200, not stored", async () => {
  const res = await POST(req(JSON.stringify({ email: "a@b.co", company: "bot" })));
  expect(res.status).toBe(200);
  expect(addSpy).not.toHaveBeenCalled();
});

test("closed → 503, not stored", async () => {
  openMock.mockReturnValue(false);
  const res = await POST(req(JSON.stringify({ email: "a@b.co" })));
  expect(res.status).toBe(503);
  expect(await res.json()).toEqual({ error: "Waitlist opens soon." });
  expect(addSpy).not.toHaveBeenCalled();
});

test("addToWaitlist throws → 500", async () => {
  addSpy.mockRejectedValueOnce(new Error("x"));
  const res = await POST(req(JSON.stringify({ email: "a@b.co" })));
  expect(res.status).toBe(500);
  expect(await res.json()).toEqual({ error: "Something went wrong. The house always wins." });
});
