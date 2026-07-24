import Link from "next/link";
import {
  Check,
  Clock,
  HelpCircle,
  Info,
  Percent,
  Wallet,
} from "lucide-react";

import SectionTitle from "@/components/marketing/SectionTitle";
import CapabilityMatrix from "@/components/marketing/CapabilityMatrix";

/** Ce va include planul, când plățile vor exista. Doar capabilități reale. */
const PLAN_FEATURES = [
  "Browse and be discovered across all three roles",
  "Send, receive and answer collaboration requests",
  "Skill-based matching with the reasons shown",
  "Investment records with analytics and charts",
  "Portfolio view of everything you've backed",
  "In-app notifications for every event",
];

const FEE_STEPS = [
  {
    n: 1,
    t: "On completed investments",
    d: "When an investment closes through the platform, a fee on the invested amount.",
  },
  {
    n: 2,
    t: "On expert engagements",
    d: "When a startup and an expert agree terms through the platform, a fee on the agreed value.",
  },
  {
    n: 3,
    t: "No deal, no fee",
    d: "If a conversation doesn't lead anywhere, nothing is charged. That part won't change.",
  },
];

const FAQ = [
  {
    q: "Is it really free right now?",
    a: "Yes. There is no billing system connected — nobody can be charged even by mistake. You create an account and use everything.",
  },
  {
    q: "When will you start charging?",
    a: "We haven't set a date, and we'd rather not invent one. What we commit to is notice: every existing user will be told well in advance, before anything changes.",
  },
  {
    q: "Why show pricing at all then?",
    a: "So you can decide whether the eventual model works for you before investing time here. A platform that hides its future pricing is harder to trust than one that shows it early.",
  },
  {
    q: "Does the platform handle the money?",
    a: "No. Today, investments and expert engagements are agreed and paid directly between the parties. Payments and escrow are on the roadmap, not in the product.",
  },
  {
    q: "What is a success fee charged on?",
    a: "It would apply to deals that close through the platform — an investment or an expert engagement. It cannot apply retroactively to anything agreed during the free beta.",
  },
  {
    q: "Will there be a free tier after launch?",
    a: "We haven't decided. Beta users will be part of that conversation rather than finding out from a billing email.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-700">
            <Info className="h-[13px] w-[13px]" />
            Free while in beta
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-5xl">
            Free today. Here&apos;s what comes later.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            InvestLink is in open beta and there is no billing connected — you
            can&apos;t be charged. Below is the model we plan to introduce, shown
            now so you can judge it before you invest your time.
          </p>
        </div>
      </section>

      {/* Modelul VIITOR — etichetat pe fiecare card, nu doar în titlu. */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="The Planned Model"
            subtitle="Nothing here is active — no payment method is collected today"
          />

          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-blue-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-[6px] rounded-full bg-blue-50 px-3 py-1 text-[11.5px] font-semibold text-blue-700">
                  <Wallet className="h-[13px] w-[13px]" />
                  Subscription
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11.5px] font-semibold text-emerald-700">
                  $0 during beta
                </span>
              </div>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900">$1</span>
                <span className="text-sm text-slate-500">/ month, later</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Access to everything the platform does.
              </p>

              <ul className="mt-6 space-y-[10px]">
                {PLAN_FEATURES.map((f) => (
                  <li key={f} className="flex gap-[10px] text-sm text-slate-700">
                    <Check className="mt-[3px] h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/signup"
                className="mt-8 flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Create your account — free →
              </Link>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-[6px] rounded-full bg-slate-100 px-3 py-1 text-[11.5px] font-semibold text-slate-600">
                  <Percent className="h-[13px] w-[13px]" />
                  Success fees
                </span>
                <span className="inline-flex items-center gap-[5px] rounded-full bg-slate-100 px-3 py-1 text-[11.5px] font-semibold text-slate-500">
                  <Clock className="h-[12px] w-[12px]" />
                  Not active
                </span>
              </div>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900">
                  1–1.5%
                </span>
                <span className="text-sm text-slate-500">/ per deal, later</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Charged only when a deal actually closes.
              </p>

              <div className="mt-6 space-y-4">
                {FEE_STEPS.map((s) => (
                  <div key={s.n} className="flex gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100 text-[12px] font-bold text-slate-600">
                      {s.n}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {s.t}
                      </div>
                      <p className="mt-[2px] text-[13px] leading-relaxed text-slate-600">
                        {s.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-6 rounded-lg bg-amber-50/60 px-4 py-3 text-[12.5px] leading-relaxed text-slate-600">
                Since the platform doesn&apos;t process payments yet, no fee can
                be charged on anything you agree during beta.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="What Each Role Can Do"
            subtitle="Everything below is live today — plus what's still on the way"
          />
          <div className="mt-10">
            <CapabilityMatrix />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <SectionTitle
            title="Frequently Asked Questions"
            subtitle="Straight answers about money — including the ones we can't answer yet"
          />

          <div className="mt-10 space-y-3">
            {FAQ.map((f) => (
              <div
                key={f.q}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="flex gap-3">
                  <HelpCircle className="mt-[2px] h-[18px] w-[18px] shrink-0 text-blue-600" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{f.q}</h3>
                    <p className="mt-[6px] text-sm leading-relaxed text-slate-600">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Start now, decide later
          </h2>
          <p className="mt-3 text-blue-100">
            Nothing to pay, nothing to cancel, no card to enter. Build your
            profile and tell us what&apos;s missing.
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
