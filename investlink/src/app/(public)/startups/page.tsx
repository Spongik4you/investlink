import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  Briefcase,
  Check,
  Coins,
  Users,
  X,
} from "lucide-react";

import SectionTitle from "@/components/marketing/SectionTitle";
import { getExpertCategories } from "@/lib/marketing/get-expert-categories";

const NEEDS = [
  {
    Icon: Coins,
    tone: "emerald",
    title: "Capital",
    desc: "Reach investors directly instead of chasing warm intros. Browse by thesis, or let them come to you.",
    points: [
      "Discover investors by sector, stage and ticket range",
      "Send interest with your pitch — or answer theirs",
      "See every request's status in one inbox",
      "Record each investment as it closes",
    ],
  },
  {
    Icon: Users,
    tone: "blue",
    title: "A team",
    desc: "Find specialists for the gaps you actually have. Experts can apply to you as well as be invited.",
    points: [
      "Search experts by skill, category and rate",
      "Invite them to a specific role you define",
      "Receive applications from experts who fit",
      "End a collaboration and rate it, privately",
    ],
  },
];

const STEPS = [
  { n: 1, t: "Create your account", d: "Sign up and pick the startup role." },
  { n: 2, t: "Build your profile", d: "Pitch, industries, stage, fundraising goal and expert needs." },
  { n: 3, t: "Discover and connect", d: "Reach out to investors and experts, or answer those reaching out." },
  { n: 4, t: "Record what you raise", d: "Log each investment — amount, round, equity, date." },
  { n: 5, t: "Watch the picture build", d: "Analytics turn those records into trends you can act on." },
];

const IS_NOT = [
  "We don't verify or audit startups — there is no badge to earn",
  "We don't hold or move money; funding happens directly between you and investors",
  "We don't guarantee funding, timelines or outcomes",
];

export default async function StartupsPage() {
  const categories = await getExpertCategories();

  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="inline-block rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1 text-xs font-semibold text-emerald-700">
            For Startups
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl">
            Find capital and the people <br className="hidden md:block" />
            to build with
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Most platforms solve one of those. Here you do both from the same
            profile — reach investors, bring in specialists, and keep the record
            of what you raised in one place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth/signup"
              className="rounded-md bg-emerald-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Create your account →
            </Link>
            <Link
              href="/experts"
              className="rounded-md border border-slate-200 px-5 py-3 text-center text-sm font-semibold hover:bg-slate-50"
            >
              See what experts get
            </Link>
          </div>
        </div>
      </section>

      {/* Dubla propunere — ce face pagina asta diferită de celelalte două. */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="Two Things Every Startup Needs"
            subtitle="Money and people — handled in the same place, from the same profile"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {NEEDS.map((c) => (
              <div
                key={c.title}
                className="rounded-xl border border-slate-100 bg-white p-8 shadow-sm"
              >
                <span
                  className={`grid h-11 w-11 place-items-center rounded-xl ${
                    c.tone === "emerald" ? "bg-emerald-50" : "bg-blue-50"
                  }`}
                >
                  <c.Icon
                    className={`h-5 w-5 ${
                      c.tone === "emerald" ? "text-emerald-600" : "text-blue-600"
                    }`}
                  />
                </span>
                <h3 className="mt-4 text-xl font-bold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {c.desc}
                </p>
                <ul className="mt-6 space-y-[10px]">
                  {c.points.map((p) => (
                    <li key={p} className="flex gap-[10px] text-sm text-slate-700">
                      <Check className="mt-[3px] h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorii REALE din bază — elementul individual al acestei pagini. */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="Specialists on the Platform"
            subtitle="These are the categories experts have actually registered under"
          />

          {categories.length === 0 ? (
            <div className="mx-auto mt-10 max-w-xl rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <Briefcase className="mx-auto h-6 w-6 text-slate-400" />
              <p className="mt-3 text-sm text-slate-600">
                No experts have registered yet — you could be the first startup
                here when they do.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((c) => (
                  <div
                    key={c}
                    className="flex items-center gap-[10px] rounded-lg border border-slate-200 bg-white px-4 py-3"
                  >
                    <Briefcase className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="truncate text-sm font-medium text-slate-800">
                      {c}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-xs text-slate-500">
                This list comes straight from registered expert profiles — it
                grows as they join.
              </p>
            </>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/experts"
              className="inline-flex items-center justify-center rounded-md border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50"
            >
              How experts use InvestLink →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </span>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">
                Your funding, finally in one picture
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Every investment you record builds your analytics: capital over
                time, breakdown by round, equity allocated, and who your largest
                backers are. It&apos;s the view most founders keep in a
                spreadsheet — except it&apos;s connected to the investors
                themselves.
              </p>
              <ul className="mt-5 space-y-[10px]">
                {[
                  "Total raised, number of investments and investors",
                  "Monthly capital trend over the last 12 months",
                  "Breakdown per funding round",
                  "Equity allocated vs. retained",
                ].map((x) => (
                  <li key={x} className="flex gap-[10px] text-sm text-slate-700">
                    <Check className="mt-[3px] h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-bold text-slate-900">
                Investment analytics
              </div>
              <div className="text-xs text-slate-500">
                Actual layout — fills in from what you record.
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  "Total raised",
                  "Investments",
                  "Investors",
                  "Avg investment",
                ].map((l) => (
                  <div
                    key={l}
                    className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      {l}
                    </div>
                    <div className="mt-1 text-xl font-bold text-slate-300">—</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg border border-slate-100 p-3">
                <div className="text-xs font-semibold text-slate-700">
                  Capital over time
                </div>
                <div className="mt-2 flex h-16 items-end gap-1">
                  {[20, 34, 28, 46, 40, 58, 52, 70].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-slate-200"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="mt-1 text-[10px] text-slate-400">
                  Shape shown for illustration — your chart uses your own records.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="How to Get Started"
            subtitle="From signup to your first connection"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
                  {s.n}
                </span>
                <div className="mt-4 font-semibold text-slate-900">{s.t}</div>
                <p className="mt-1 text-sm text-slate-600">{s.d}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-xl border border-amber-100 bg-amber-50/40 p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-[18px] w-[18px] text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Worth being clear about
              </h3>
            </div>
            <ul className="mt-3 space-y-2">
              {IS_NOT.map((x) => (
                <li key={x} className="flex gap-[10px] text-sm text-slate-600">
                  <X className="mt-[3px] h-4 w-4 shrink-0 text-amber-600" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-emerald-600 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Ready to start raising?
          </h2>
          <p className="mt-3 text-emerald-50">
            Create your profile, reach out to investors and experts, and keep the
            record in one place. Free while we&apos;re in beta.
          </p>
          <div className="mt-8">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Create your account →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
