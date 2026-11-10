import LossCounter from "@/components/LossCounter";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-pink/15 blur-[120px]"
      />
      <div className="relative mx-auto max-w-6xl">
        <p aria-hidden="true" className="mb-8 text-2xl tracking-[0.5em] text-gold/80">
          ♠ ♥ ♦ ♣
        </p>
        <h1 className="glow-pink font-display text-[clamp(3rem,11vw,8.5rem)] uppercase leading-[0.92] text-ink">
          We bring efficiency
          <br />
          <span className="text-gold">to your gambling.</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
          Calculate your losses in advance and stop wasting your precious time gambling. Run the
          simulation and pay us what you&apos;ll owe us.
        </p>
        <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <a
            href="#waitlist"
            className="glow-box-pink rounded-full bg-pink px-8 py-4 text-lg font-semibold text-bg transition hover:brightness-110"
          >
            Run the simulation
          </a>
          <LossCounter />
        </div>
      </div>
    </section>
  );
}
