import WaitlistForm from "@/components/WaitlistForm";
import { isWaitlistOpen } from "@/lib/waitlist";

export default function WaitlistSection() {
  return (
    <section id="waitlist" className="scroll-mt-24 px-6 py-24 text-center">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-pink">Waitlist</p>
      <h2 className="font-display text-4xl uppercase leading-tight sm:text-6xl">
        Be the first to <span className="text-gold">lose efficiently.</span>
      </h2>
      <p className="mx-auto mt-4 mb-10 max-w-lg text-muted">
        The simulator is almost ready. Your losses are not going anywhere.
      </p>
      <WaitlistForm open={isWaitlistOpen()} />
    </section>
  );
}
