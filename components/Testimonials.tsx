const quotes = [
  {
    quote: "I used to lose €500 in a whole night. Now I lose it before breakfast.",
    name: "Gary L.",
    role: "Professional Optimist",
  },
  {
    quote: "Room Fifteen gave me my weekends back. I spend them explaining the invoice to my accountant.",
    name: "Marta P.",
    role: "Weekend Strategist",
  },
  {
    quote: "Three seconds, €4,000, zero free drinks. Honestly the most transparent night out I've had.",
    name: "Dino K.",
    role: "Early Adopter",
  },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("");

export default function Testimonials() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 font-display text-4xl uppercase sm:text-6xl">What our users say, allegedly</h2>
        <ul className="grid gap-6 md:grid-cols-3">
          {quotes.map((q) => (
            <li key={q.name} className="flex flex-col justify-between gap-8 border-l-2 border-pink pl-6">
              <blockquote className="text-lg leading-relaxed text-ink">&ldquo;{q.quote}&rdquo;</blockquote>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-pink/15 font-semibold text-pink">
                  {initials(q.name)}
                </span>
                <span>
                  <span className="block font-semibold text-ink">{q.name}</span>
                  <span className="block text-sm text-muted">{q.role}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
