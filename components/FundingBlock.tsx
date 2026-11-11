export default function FundingBlock({ url }: { url?: string }) {
  if (!url) return null;
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-3xl border border-line bg-surface px-8 py-10 text-center">
        <p className="text-lg text-ink">
          This is a joke, but you can still fund the further development of this project.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border-2 border-gold px-6 py-2.5 font-semibold text-gold transition hover:bg-gold hover:text-bg"
        >
          Fund development
        </a>
      </div>
    </section>
  );
}
