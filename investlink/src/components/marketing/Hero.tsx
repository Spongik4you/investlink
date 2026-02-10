import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-13">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full border border-blue-100 bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-700">
            Join 5,000+ Investors Worldwide
          </div>

          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl">
            Where Investors, Startups and <br className="hidden md:block" />
            Experts Build the Future <br className="hidden md:block" />
            Together
          </h1>

          <p className="mt-4 max-w-2xl text-sm text-slate-600 md:text-base">
            The all-in-one global platform connecting verified startups, serious investors,
            and world-class experts. Start for just $1/month.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Join for $1/month →
            </Link>
            <Link
              href="/investors"
              className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Explore Opportunities
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
