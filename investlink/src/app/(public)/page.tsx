import Link from "next/link";
import { Target, Rocket, Users } from "lucide-react";

import Hero from "@/components/marketing/Hero";
import StatsRow from "@/components/marketing/StatsRow";
import SectionTitle from "@/components/marketing/SectionTitle";
import BetaNotice from "@/components/marketing/BetaNotice";
import HowItWorks from "@/components/marketing/HowItWorks";
import PlatformFeatures from "@/components/marketing/PlatformFeatures";
import RoadmapSection from "@/components/marketing/RoadmapSection";
import IconTile from "@/components/ui/IconTile";
import { getPlatformStats } from "@/lib/marketing/get-platform-stats";

type IconTone = "red" | "orange" | "purple";

export default async function HomePage() {
  const stats = await getPlatformStats();

  return (
    <>
      <Hero />

      {/* Statistici reale — componenta nu randează nimic sub prag. */}
      <section className="bg-white pb-12">
        <div className="mx-auto max-w-6xl px-4">
          <StatsRow stats={stats} />
        </div>
      </section>

      {/* Anunțul de beta, sus, ca să încadreze tot ce urmează. */}
      <section className="bg-white pb-14">
        <div className="mx-auto max-w-4xl px-4">
          <BetaNotice />
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
                d: "Can't find trusted deal flow. Too much risk, limited transparency, and scattered opportunities.",
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
                className="rounded-md border border-slate-100 bg-white p-6 shadow-sm"
              >
                <IconTile Icon={x.icon} tone={x.tone as IconTone} />
                <h3 className="text-md mt-0 font-semibold text-slate-900">
                  {x.t}
                </h3>
                <p className="text-sm text-slate-600">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="One Platform. Three Problems Solved."
            subtitle="InvestLink unites the entire startup ecosystem in a single marketplace"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                t: "For Investors",
                d: "Browse startups by stage and sector, express interest, and track your positions.",
                href: "/investors",
              },
              {
                t: "For Startups",
                d: "Find capital and specialists in one place. Record what you raise and see it analysed.",
                href: "/startups",
              },
              {
                t: "For Experts",
                d: "Get matched with startups that need your skills. Apply directly or answer invitations.",
                href: "/experts",
              },
            ].map((x) => (
              <Link
                key={x.t}
                href={x.href}
                className="group rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <h3 className="font-semibold">{x.t}</h3>
                <p className="mt-2 text-sm text-slate-600">{x.d}</p>
                <div className="mt-3 text-sm font-semibold text-blue-600">
                  Learn more{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="How InvestLink Works"
            subtitle="Simple steps to start building, investing, or collaborating"
          />
          <div className="mt-10">
            <HowItWorks />
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="What the Platform Does"
            subtitle="Every feature below is live — sign up and use it today"
          />
          <div className="mt-10">
            <PlatformFeatures />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="Where We Are, Where We're Going"
            subtitle="We'd rather show you the roadmap than pretend it's already finished"
          />
          <div className="mt-10">
            <RoadmapSection />
          </div>
        </div>
      </section>

      {/* Pricing — model VIITOR, etichetat ca atare. */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="Pricing, When It Arrives"
            subtitle="Free during beta. This is the model we plan to introduce later."
          />

          <div className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 text-center">
              <div className="text-3xl font-extrabold text-slate-900">$1</div>
              <div className="mt-1 text-sm text-slate-600">per month</div>
              <div className="mt-4 font-semibold text-slate-900">Basic Plan</div>
              <p className="mt-1 text-sm text-slate-600">
                Access to all platform features
              </p>
              <span className="mt-4 inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700">
                Not charged during beta
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
              <div className="text-3xl font-extrabold text-slate-900">
                1–1.5%
              </div>
              <div className="mt-1 text-sm text-slate-600">per transaction</div>
              <div className="mt-4 font-semibold text-slate-900">
                Success Fees
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Only when deals close successfully
              </p>
              <span className="mt-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Planned — payments not live yet
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Start Building Your Future Today
          </h2>
          <p className="mt-3 text-blue-100">
            Create an account, complete your profile, and start connecting.
            It&apos;s free while we&apos;re in beta.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              Create your account →
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md border border-blue-400 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
            >
              See pricing plans
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
