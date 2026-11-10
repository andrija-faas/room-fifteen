import { addToWaitlist, isWaitlistOpen, normalizeEmail } from "@/lib/waitlist";

const json = (body: unknown, status: number) => Response.json(body, { status });

export async function POST(req: Request): Promise<Response> {
  if (!isWaitlistOpen()) return json({ error: "Waitlist opens soon." }, 503);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return json({ error: "Invalid request." }, 400);
  }

  const { email, company } = body as { email?: unknown; company?: unknown };

  // Honeypot: bots fill the hidden "company" field. Pretend it worked.
  if (typeof company === "string" && company.trim() !== "") return json({ ok: true }, 200);

  const normalized = normalizeEmail(email);
  if (!normalized) {
    return json({ error: "That doesn't look like an email. Even we have standards." }, 400);
  }

  try {
    await addToWaitlist(normalized);
  } catch {
    return json({ error: "Something went wrong. The house always wins." }, 500);
  }
  return json({ ok: true }, 200);
}
