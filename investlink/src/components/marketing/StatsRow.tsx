const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="rounded-xl border border-slate-100 bg-white p-6 text-center shadow-sm">
    <div className="text-2xl font-bold">{value}</div>
    <div className="mt-1 text-xs text-slate-600">{label}</div>
  </div>
);

export default function StatsRow() {
  return (
    <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
      <Stat value="5,000+" label="Active Investors" />
      <Stat value="1,200+" label="Funded Startups" />
      <Stat value="15,000+" label="Global Experts" />
      <Stat value="$500M+" label="Total Investment" />
    </div>
  );
}
