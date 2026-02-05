export default function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      {subtitle ? (
        <p className="mt-2 text-sm text-slate-600 md:text-base">{subtitle}</p>
      ) : null}
    </div>
  );
}
