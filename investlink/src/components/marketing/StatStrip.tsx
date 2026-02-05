const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <div className="text-2xl font-extrabold tracking-tight">{value}</div>
    <div className="mt-1 text-xs text-slate-600">{label}</div>
  </div>
);

export default function StatStrip() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Join 15,000+ Successful Experts
          </h2>
          <p className="mt-2 text-sm text-slate-600 md:text-base">
            Experts on InvestLink earn 40% more than traditional freelancing platforms
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
          <Stat value="15,000+" label="Active Experts" />
          <Stat value="$120/hr" label="Average Hourly Rate" />
          <Stat value="95%" label="On-Time Payment Rate" />
          <Stat value="150+" label="Countries" />
        </div>
      </div>
    </section>
  );
}
