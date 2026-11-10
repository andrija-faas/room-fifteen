const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

/** Trimmed, lowercased email, or null if it isn't a plausible address. */
export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(email)) return null;
  return email;
}

type WaitlistEnv = { NODE_ENV?: string; RESEND_API_KEY?: string };

/**
 * In production the waitlist only accepts emails once Resend is configured,
 * so visitors are never told they're on a list that doesn't exist.
 */
export function isWaitlistOpen(env: WaitlistEnv = process.env): boolean {
  return env.NODE_ENV !== "production" || Boolean(env.RESEND_API_KEY);
}

/** Stores a waitlist signup. No-op in v1. */
export async function addToWaitlist(email: string): Promise<void> {
  // TODO(resend): resend.contacts.create({ email, audienceId }) + confirmation email
  void email;
}
