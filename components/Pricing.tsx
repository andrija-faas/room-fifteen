const rows = [
  { label: "Projected losses (3 h slots, €1 stake)", amount: "€126.00" },
  { label: "Time-saving fee (1%)", amount: "€1.26", badge: "Best value" },
];

export default function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        <div className="flex flex-col items-center gap-10 text-center lg:items-start lg:text-left">
          <div
            aria-hidden="true"
            className="grid h-56 w-56 place-items-center rounded-full bg-[repeating-conic-gradient(var(--color-gold)_0deg_20deg,var(--color-bg)_20deg_40deg)] p-4 sm:h-64 sm:w-64"
          >
            <div className="grid h-full w-full place-items-center rounded-full border-4 border-dashed border-bg bg-gold">
              <span className="font-display text-7xl text-bg sm:text-8xl">1%</span>
            </div>
          </div>
          <p className="max-w-md font-display text-3xl uppercase leading-tight sm:text-4xl">
            We only take 1% commission unlike the real casinos that take all.
          </p>
        </div>

        <figure className="rounded-3xl border border-line bg-surface p-8 font-mono text-sm sm:text-base">
          <p className="mb-6 font-sans text-sm text-muted">Sample bill</p>
          <table className="w-full">
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-dashed border-line">
                  <td className="py-4 pr-4 font-sans text-muted">
                    {r.label}
                    {r.badge && (
                      <span className="ml-2 inline-block rounded-full bg-gold px-2 py-0.5 font-sans text-xs font-semibold text-bg">
                        {r.badge}
                      </span>
                    )}
                  </td>
                  <td className={`py-4 text-right tabular-nums ${r.badge ? "text-gold" : "text-ink"}`}>
                    {r.amount}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="pt-6 font-sans text-lg font-semibold text-ink">Total due</td>
                <td className="pt-6 text-right text-2xl font-medium tabular-nums text-pink">€127.26</td>
              </tr>
            </tbody>
          </table>
          <figcaption className="mt-8 font-sans text-muted">
            Time saved: <span className="font-mono text-gold">3 h 00 min</span>. You&apos;re welcome.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
