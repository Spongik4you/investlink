import Link from "next/link";
import SectionTitle from "@/components/marketing/SectionTitle";

export default function StartupsPage() {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="rounded-full border border-green-100 bg-green-50 px-4 py-1 text-xs font-semibold text-green-700 inline-block">
            For Startups
          </div>
          <h1 className="mt-6 max-w-3xl text-5xl font-extrabold tracking-tight">
            Raise Capital and Build <br /> Your Dream Team Globally
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Connect with verified investors worldwide and hire expert talent across all domains.
            Get funded faster and scale with confidence.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/pricing" className="rounded-md bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700">
              Submit Your Startup →
            </Link>
            <Link href="#stories" className="rounded-md border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50">
              View Success Stories
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="Everything You Need to Scale Fast"
            subtitle="From funding to talent, we connect you with the resources to grow"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { t: "Global Funding", d: "Access a network of verified investors actively looking for opportunities." },
              { t: "Expert Marketplace", d: "Hire specialists in software, marketing, finance, legal, and more." },
              { t: "Verified Badge", d: "Complete verification to earn credibility and stand out to investors." },
            ].map((x) => (
              <div key={x.t} className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="font-semibold">{x.t}</h3>
                <p className="mt-2 text-sm text-slate-600">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="Startup Verification Process"
            subtitle="Our 6-point verification builds trust with investors and experts"
          />
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            {[
              ["Company Registration", "Official business registration documents"],
              ["Founders Identity", "KYC verification for all founders"],
              ["Financial Projections", "3-year forecasts and assumptions"],
              ["Business Model", "Clear revenue streams and growth strategy"],
              ["Market Analysis", "Target market size and competitive landscape"],
              ["Risk Disclosures", "Risk assessment and mitigation"],
            ].map(([t, d], idx) => (
              <div key={t} className="flex items-center justify-between border-b border-slate-100 py-4 last:border-b-0">
                <div className="flex items-start gap-3">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-green-50 text-sm font-semibold text-green-700">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{t}</div>
                    <div className="text-sm text-slate-600">{d}</div>
                  </div>
                </div>
                <div className="text-green-600">✔</div>
              </div>
            ))}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Average verification time <br />
                <span className="text-lg font-bold text-green-700">3–5 business days</span>
              </div>
              <button className="rounded-md bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700">
                Start Verification
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
