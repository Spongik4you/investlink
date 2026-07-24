import Link from "next/link";
import { AlertTriangle, Check, Compass, Send, X } from "lucide-react";

import SectionTitle from "@/components/marketing/SectionTitle";
import InvestorDashboardPreview from "@/components/marketing/InvestorDashboardPreview";

const DISCOVERY = [
  {
    Icon: Compass,
    title: "You find them",
    desc: "Browse every startup on the platform, filtered by funding stage, industry or keyword. Express interest in the ones that fit your thesis.",
    points: [
      "Filter by stage, sector and keyword",
      "See pitch, industries and fundraising goal",
      "Send interest with a personal message",
      "Withdraw a request if you change your mind",
    ],
  },
  {
    Icon: Send,
    title: "They find you",
    desc: "Startups browse investors too. Your profile — sectors, stages and ticket range — is what they match against, and they can reach out first.",
    points: [
      "Startups see your thesis and ticket range",
      "Incoming requests land in one inbox",
      "Accept to open a conversation, or decline",
      "Nothing is shared until you accept",
    ],
  },
];

const IS = [
  "A place to discover startups and be discovered by them",
  "A record of what you invested, kept by the startups you backed",
  "A dashboard showing your positions, equity and activity over time",
];

const IS_NOT = [
  "We do not hold, move or process any money",
  "We do not verify or audit startups — you do your own diligence",
  "We do not provide investment advice or manage portfolios",
  "We do not guarantee any return, and never will",
];

const STEPS = [
  { n: 1, t: "Create your account", d: "Sign up and pick the investor role." },
  { n: 2, t: "Set your thesis", d: "Sectors, stages, ticket range and geography." },
  { n: 3, t: "Discover startups", d: "Browse and filter, or answer those reaching out." },
  { n: 4, t: "Express interest", d: "Send a request; they accept or decline." },
  { n: 5, t: "Track your positions", d: "See what each startup recorded about your investment." },
];

export default function InvestorsPage() {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="inline-block rounded-full border border-blue-100 bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-700">
            For Investors
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl">
            Find startups worth your time — <br className="hidden md:block" />
            and let them find you
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Browse startups by stage and sector, express interest, and keep track
            of every position you build. Two-way discovery, in one place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth/signup"
              className="rounded-md bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              Create your account →
            </Link>
            <Link
              href="/startups"
              className="rounded-md border border-slate-200 px-5 py-3 text-center text-sm font-semibold hover:bg-slate-50"
            >
              See what startups get
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="Discovery Works Both Ways"
            subtitle="You're not limited to searching — startups can reach out to you too"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {DISCOVERY.map((c) => (
              <div
                key={c.title}
                className="rounded-xl border border-slate-100 bg-white p-8 shadow-sm"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50">
                  <c.Icon className="h-5 w-5 text-blue-600" />
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

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="Everything in One Dashboard"
            subtitle="Your positions, your deal flow, your pending requests"
          />
          <div className="mt-10">
            <InvestorDashboardPreview />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="How to Get Started"
            subtitle="From signup to your first conversation"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                  {s.n}
                </span>
                <div className="mt-4 font-semibold text-slate-900">{s.t}</div>
                <p className="mt-1 text-sm text-slate-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Înlocuiește „Risk Management & Protection" din machetă, care afirma
          verificare în 6 puncte, escrow și diversificare — niciuna reală.
          Claritatea de aici construiește mai multă încredere decât badge-uri
          inventate, și stabilește așteptări corecte. */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="What InvestLink Is — and What It Isn't"
            subtitle="Know exactly what you're using before you rely on it"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">What it is</h3>
              <ul className="mt-4 space-y-3">
                {IS.map((x) => (
                  <li key={x} className="flex gap-[10px] text-sm text-slate-600">
                    <Check className="mt-[3px] h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-[18px] w-[18px] text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  What it is not
                </h3>
              </div>
              <ul className="mt-4 space-y-3">
                {IS_NOT.map((x) => (
                  <li key={x} className="flex gap-[10px] text-sm text-slate-600">
                    <X className="mt-[3px] h-4 w-4 shrink-0 text-amber-600" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                Investing in early-stage companies carries a high risk of losing
                your capital. Anything you agree with a startup happens directly
                between you and them.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Ready to see the deal flow?
          </h2>
          <p className="mt-3 text-blue-100">
            Create an account, set your thesis, and start discovering startups.
            Free while we&apos;re in beta.
          </p>
          <div className="mt-8">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              Create your account →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
