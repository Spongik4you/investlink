import Hero from "@/components/marketing/Hero";
import StatsRow from "@/components/marketing/StatsRow";
import SectionTitle from "@/components/marketing/SectionTitle";
import { Target, Rocket, Users } from "lucide-react";
import IconTile from "@/components/ui/IconTile";


export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="bg-white pb-12">
        <div className="mx-auto max-w-6xl px-4">
          <StatsRow />
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="The Challenge in Today's Investment Landscape"
            subtitle="Three groups struggle to connect in the fragmented startup ecosystem"
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                t: "Investors",
                d: "Can't find trusted, verified deal flow. Too much risk, limited transparency, and scattered opportunities.",
                icon: Target,
                tone: "red",
              },
              {
                t: "Startups",
                d: "Struggle to access capital and find the right experts to help them grow. Building teams is expensive.",
                icon: Rocket,
                tone: "orange",
              },
              {
                t: "Experts",
                d: "Can't easily discover serious startup projects or negotiate fair compensation for specialized skills.",
                icon: Users,
                tone: "purple",
              },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-md border border-slate-100 bg-white p-6 shadow-sm "
              >
                {/* icon */}
                <IconTile Icon={x.icon} tone={x.tone as any} />

                {/* title */}
                <h3 className="mt-0 text-md font-semibold text-slate-900">
                  {x.t}
                </h3>

                {/* description */}
                <p className="text-slate-600 text-sm">
                  {x.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="One Platform. Three Problems Solved."
            subtitle="InvestLink unites the entire startup ecosystem in a single trusted marketplace"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { t: "For Investors", d: "Access curated pipeline of verified startups. Transparency and security." },
              { t: "For Startups", d: "Get funded and hire world-class experts. Build credibility with verification." },
              { t: "For Experts", d: "Work with exciting startups globally. Choose flexible compensation models." },
            ].map((x) => (
              <div key={x.t} className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="font-semibold">{x.t}</h3>
                <p className="mt-2 text-sm text-slate-600">{x.d}</p>
                <div className="mt-3 text-sm font-semibold text-blue-600">Learn more →</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
