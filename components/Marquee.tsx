const items = [
  "Saving 100% of your time for 1% of your money",
  "No dealers",
  "No drinks",
  "No hope",
  "We only take 1%",
];
const suits = ["♠", "♥", "♦", "♣", "♠"];

function Track() {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={item} className="flex items-center whitespace-nowrap">
          <span className="px-6">{item}</span>
          <span className="text-pink">{suits[i]}</span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-gold/40 bg-gold/5 py-4 font-display text-xl uppercase tracking-wide text-gold sm:text-2xl">
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div aria-hidden="true" className="animate-marquee flex w-max">
        <Track />
        <Track />
      </div>
    </div>
  );
}
