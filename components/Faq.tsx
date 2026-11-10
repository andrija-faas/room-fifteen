import type { ReactNode } from "react";

const faqs: { q: string; a: ReactNode }[] = [
  { q: "Can I win?", a: "No. Neither could you before." },
  {
    q: "What's the 1% for?",
    a: "Time. A casino needs a whole evening to take your money. We do it in about three seconds, and that convenience costs 1%.",
  },
  {
    q: "Is this legal?",
    a: "We tell you exactly how much you'll lose before you lose it. That's already more honest than most of the industry.",
  },
  {
    q: "Is this a joke?",
    a: (
      <>
        Yes. Room Fifteen is satire. Nobody is charged for a simulated loss, and the only real money
        involved is voluntary funding for this project. If gambling is costing you more than you&apos;d
        like, free and confidential help is available at{" "}
        <a
          href="https://www.begambleaware.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold underline underline-offset-4"
        >
          BeGambleAware
        </a>
        .
      </>
    ),
  },
];

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 font-display text-4xl uppercase sm:text-6xl">FAQ</h2>
        <div className="max-w-3xl divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-2">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="text-2xl text-pink transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="pb-5 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
