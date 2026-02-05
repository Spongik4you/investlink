export default function StepsRow({
  title,
  subtitle,
  steps,
  tone = "purple",
}: {
  title: string;
  subtitle?: string;
  steps: { n: number; title: string; desc: string }[];
  tone?: "blue" | "green" | "purple";
}) {
  const toneBg =
    tone === "green" ? "bg-green-50 text-green-700"
    : tone === "blue" ? "bg-blue-50 text-blue-700"
    : "bg-purple-50 text-purple-700";

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
          {subtitle ? <p className="mt-2 text-sm text-slate-600 md:text-base">{subtitle}</p> : null}
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-5">
          {steps.map((s) => (
            <div key={s.n} className="text-center">
              <div className={`mx-auto grid h-12 w-12 place-items-center rounded-full ${toneBg} text-sm font-bold`}>
                {s.n}
              </div>
              <div className="mt-3 text-sm font-semibold">{s.title}</div>
              <div className="mt-1 text-xs text-slate-600">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
