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
 * Flip to true in the same change that makes addToWaitlist actually store emails.
 * Until then the waitlist stays closed in production even if RESEND_API_KEY is set.
 */
export const WAITLIST_STORAGE_READY = false;

/**
 * In production the waitlist only accepts emails once Resend is configured and wired up,
 * so visitors are never told they're on a list that doesn't exist.
 */
export function isWaitlistOpen(
  env: WaitlistEnv = process.env,
  storageReady: boolean = WAITLIST_STORAGE_READY,
): boolean {
  return env.NODE_ENV !== "production" || (storageReady && Boolean(env.RESEND_API_KEY));
}

/** Stores a waitlist signup. No-op in v1. */
export async function addToWaitlist(email: string): Promise<void> {
  // TODO(resend): resend.contacts.create({ email, audienceId }) + confirmation email
  void email;
}
