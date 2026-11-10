"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { normalizeEmail } from "@/lib/waitlist";

const INVALID = "That doesn't look like an email. Even we have standards.";
const NETWORK = "Couldn't reach the house. Try again.";

type Status = "idle" | "pending" | "success" | "error";

export default function WaitlistForm({ open }: { open: boolean }) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  if (!open) {
    return (
      <p className="rounded-full border border-gold/60 px-6 py-3 text-center font-medium text-gold">
        Waitlist opens soon.
      </p>
    );
  }

  if (status === "success") {
    return (
      <p role="status" className="text-center text-lg font-medium text-gold">
        You&apos;re on the list. Your losses have been reserved.
      </p>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;
    const normalized = normalizeEmail(email);
    if (!normalized) {
      setStatus("error");
      setError(INVALID);
      return;
    }
    inFlight.current = true;
    setStatus("pending");
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: normalized, company }),
      });
      if (res.ok) {
        setStatus("success");
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setStatus("error");
      setError(data.error ?? NETWORK);
    } catch {
      setStatus("error");
      setError(NETWORK);
    } finally {
      inFlight.current = false;
    }
  }

  const pending = status === "pending";

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto w-full max-w-xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="waitlist-email" className="sr-only">
          Email
        </label>
        <input
          id="waitlist-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="gary@losingefficiently.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) {
              setError(null);
              setStatus("idle");
            }
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "waitlist-error" : "waitlist-consent"}
          className="min-w-0 flex-1 rounded-full border border-line bg-surface px-5 py-3 text-ink placeholder:text-muted/60 focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/60"
        />
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="waitlist-company">Company</label>
          <input
            id="waitlist-company"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-pink px-6 py-3 font-semibold text-bg transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Joining…" : "Join the waitlist"}
        </button>
      </div>
      {error && (
        <p id="waitlist-error" role="alert" className="mt-3 text-sm text-pink">
          {error}
        </p>
      )}
      <p id="waitlist-consent" className="mt-4 text-sm text-muted">
        We&apos;ll email you when the simulator launches. Unsubscribe anytime.{" "}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-ink">
          Privacy
        </Link>
      </p>
    </form>
  );
}
