const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#compare", label: "Compare" },
  { href: "#faq", label: "FAQ" },
  { href: "#waitlist", label: "Waitlist" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-line/70 bg-bg/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <a href="#top" className="font-display text-xl tracking-[0.12em] text-pink">
          ROOM FIFTEEN
        </a>
        <ul className="hidden items-center gap-8 text-sm text-muted md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <span className="whitespace-nowrap rounded-full border border-gold px-3 py-1 text-xs font-medium text-gold">
          Only 1% commission
        </span>
      </nav>
    </header>
  );
}
