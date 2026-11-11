import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — Room Fifteen",
  description: "What Room Fifteen collects for its waitlist and how to get it deleted.",
};

// TODO(owner): replace with a real contact address before launch.
const CONTACT = "hello@roomfifteen.example";

const sections = [
  {
    h: "What we collect",
    p: "Your email address only, and only if you join the waitlist. No tracking cookies, no analytics, no card details.",
  },
  {
    h: "Why",
    p: "To tell you when the simulator launches. That's it. We won't sell it, share it or use it for anything else.",
  },
  {
    h: "Where it's stored",
    p: "Our email provider (Resend), once the waitlist opens.",
  },
  {
    h: "Unsubscribe and deletion",
    p: "Every email has an unsubscribe link. To have your address deleted completely, email us and we'll remove it.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <Link href="/" className="font-display text-xl tracking-[0.12em] text-pink">
        ROOM FIFTEEN
      </Link>
      <h1 className="mt-12 font-display text-5xl uppercase">Privacy</h1>
      <p className="mt-4 text-muted">
        Room Fifteen is satire, but your data isn&apos;t a joke. Here&apos;s the plain version.
      </p>
      {sections.map((s) => (
        <section key={s.h} className="mt-10">
          <h2 className="text-xl font-semibold text-ink">{s.h}</h2>
          <p className="mt-2 leading-relaxed text-muted">{s.p}</p>
        </section>
      ))}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">Contact</h2>
        <p className="mt-2 leading-relaxed text-muted">
          Questions or deletion requests:{" "}
          <a href={`mailto:${CONTACT}`} className="text-gold underline underline-offset-4">
            {CONTACT}
          </a>
        </p>
      </section>
    </main>
  );
}
