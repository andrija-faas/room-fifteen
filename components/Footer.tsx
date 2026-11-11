import Link from "next/link";
import CurrentYear from "@/components/CurrentYear";

export default function Footer() {
  return (
    <footer className="border-t border-line px-6 py-12 text-sm text-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md space-y-3">
          <p className="font-display text-lg tracking-[0.12em] text-pink">ROOM FIFTEEN</p>
          <p>
            Past losses are a guarantee of future losses. Room Fifteen is satire and not a gambling
            service.
          </p>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <a
            href="https://www.begambleaware.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline underline-offset-4 hover:text-gold"
          >
            Need help with gambling? BeGambleAware
          </a>
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <p>© <CurrentYear /> Room Fifteen</p>
        </div>
      </div>
    </footer>
  );
}
