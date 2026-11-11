const rows: [string, string, string][] = [
  ["Commission", "1%", "100% (eventually)"],
  ["Time required", "3 seconds", "Your entire weekend"],
  ["Free drinks", "✗ We respect your liver", "✓"],
  ["Outcome", "You lose", "You lose"],
];

export default function Comparison() {
  return (
    <section id="compare" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 font-display text-4xl uppercase sm:text-6xl">Room Fifteen vs. real casinos</h2>
        <div className="max-w-4xl overflow-x-auto rounded-3xl border border-line">
          <table className="w-full min-w-[520px] text-left">
            <thead>
              <tr className="border-b border-line bg-surface">
                <th scope="col" className="p-5">
                  <span className="sr-only">Feature</span>
                </th>
                <th scope="col" className="p-5 font-display text-xl uppercase tracking-wide text-pink">
                  Room Fifteen
                </th>
                <th scope="col" className="p-5 font-display text-xl uppercase tracking-wide text-muted">
                  Real casinos
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([feature, us, them]) => (
                <tr key={feature} className="border-b border-line last:border-0">
                  <th scope="row" className="p-5 font-medium text-muted">
                    {feature}
                  </th>
                  <td className="p-5 font-semibold text-ink">{us}</td>
                  <td className="p-5 text-muted">{them}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
