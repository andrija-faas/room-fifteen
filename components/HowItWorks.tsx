const steps = [
  {
    title: "Choose your game.",
    body: "Roulette, slots or blackjack. Same house edge as on the casino floor, minus the carpet.",
  },
  {
    title: "Simulate your losses.",
    body: "We do the maths a real session takes all night to reach. It takes about three seconds.",
  },
  {
    title: "Pay us.",
    body: "Your projected losses plus a 1% time-saving fee. Then go outside. It's nice out.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl uppercase sm:text-6xl">How it works</h2>
          <span className="rounded-full border border-pink/60 px-3 py-1 text-sm text-pink">
            Simulator coming soon
          </span>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="bg-surface p-8">
              <span className="font-display text-6xl text-pink/80">{i + 1}</span>
              <h3 className="mt-4 text-xl font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
