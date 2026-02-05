export default function CardGrid({
  title,
  subtitle,
  cards,
  cols = 3,
}: {
  title: string;
  subtitle?: string;
  cols?: 2 | 3;
  cards: { title: string; desc: string }[];
}) {
  const gridCols = cols === 2 ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
          {subtitle ? <p className="mt-2 text-sm text-slate-600 md:text-base">{subtitle}</p> : null}
        </div>

        <div className={`mt-10 grid gap-6 ${gridCols}`}>
          {cards.map((c) => (
            <div key={c.title} className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
