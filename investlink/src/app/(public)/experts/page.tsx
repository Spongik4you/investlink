import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  Check,
  Compass,
  Search,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import SectionTitle from "@/components/marketing/SectionTitle";
import { getStartupNeeds } from "@/lib/marketing/get-startup-needs";

const WHY = [
  {
    Icon: Compass,
    title: "You choose the work",
    desc: "Browse startups, see what they need, and apply to the ones you actually want. Nothing is assigned to you.",
    points: [
      "Apply directly with a role you define",
      "Receive invitations from startups that found you",
      "Withdraw an application any time before a reply",
      "Decline anything that isn't a fit, no explanation needed",
    ],
  },
  {
    Icon: Sparkles,
    title: "Matching you can verify",
    desc: "We show which of a startup's stated needs overlap your skills — and name them. No opaque compatibility score to trust blindly.",
    points: [
      "See “3 of 4 needs match your skills”, with the skills listed",
      "Matches update as you add skills to your profile",
      "Startups with a pending request are filtered out",
      "You judge the fit yourself",
    ],
  },
];

const FEATURES = [
  {
    Icon: Search,
    title: "Two-way discovery",
    desc: "Search startups yourself, and be found by the ones looking for your skills.",
  },
  {
    Icon: Bell,
    title: "Notifications that matter",
    desc: "Know the moment a startup invites you, answers your application, or ends a collaboration.",
  },
  {
    Icon: Star,
    title: "Private ratings",
    desc: "When a collaboration ends, both sides can rate it. Your average appears once it's based on enough ratings to mean something.",
  },
];

const STEPS = [
  { n: 1, t: "Register", d: "Create your account and pick the expert role." },
  { n: 2, t: "Build your profile", d: "Skills, category, rate, availability and how you like to work." },
  { n: 3, t: "Discover", d: "Browse startups, or see the ones matching your skills." },
  { n: 4, t: "Apply or answer", d: "Send an application, or reply to invitations you receive." },
  { n: 5, t: "Collaborate", d: "Work together, then close it out with a private rating." },
];

const IS_NOT = [
  "We don't process payments — you agree terms and get paid directly by the startup",
  "There is no escrow, milestone release or withdrawal system",
  "We don't set or guarantee rates; what you charge is between you and them",
];

export default async function ExpertsPage() {
  const needs = await getStartupNeeds();

  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="inline-block rounded-full border border-violet-100 bg-violet-50 px-4 py-1 text-xs font-semibold text-violet-700">
            For Experts
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl">
            Work with startups that <br className="hidden md:block" />
            actually need your skills
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Set your rate and availability, then let startups find you — or go
            find them. You see exactly why each match came up, and you decide
            what to take.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth/signup"
              className="rounded-md bg-violet-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-violet-700"
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

      {/* Cererea REALĂ de pe platformă — elementul individual al paginii. */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="What Startups Are Looking For"
            subtitle="Pulled from the needs startups have listed on their profiles"
          />

          {needs.length === 0 ? (
            <div className="mx-auto mt-10 max-w-xl rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <Search className="mx-auto h-6 w-6 text-slate-400" />
              <p className="mt-3 text-sm text-slate-600">
                No startup has listed its needs yet — register now and you&apos;ll
                be there when the first ones do.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-10 flex flex-wrap justify-center gap-[10px]">
                {needs.map((n) => (
                  <span
                    key={n}
                    className="rounded-full border border-violet-100 bg-white px-4 py-2 text-sm font-medium text-slate-800"
                  >
                    {n}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-center text-xs text-slate-500">
                Straight from startup profiles — the list shifts as their needs
                change.
              </p>
            </>
          )}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="Why Experts Use InvestLink"
            subtitle="You keep control of what you work on and how you're found"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {WHY.map((c) => (
              <div
                key={c.title}
                className="rounded-xl border border-slate-100 bg-white p-8 shadow-sm"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-50">
                  <c.Icon className="h-5 w-5 text-violet-600" />
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

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-violet-50">
                  <f.Icon className="h-5 w-5 text-violet-600" />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compensare — modelele sunt reale (le declari în profil), sumele nu. */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="You Set the Terms"
            subtitle="Your rate, your availability, your preferred way of working"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                t: "Your hourly rate",
                d: "You enter it on your profile. Startups see it before they reach out, so nobody's time is wasted.",
              },
              {
                t: "Your availability",
                d: "Full-time, part-time or limited — stated up front, so expectations are set from the first message.",
              },
              {
                t: "How you collaborate",
                d: "Consulting, advisory, fractional, project-based — whatever you list is what startups see.",
              },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <h3 className="font-semibold text-slate-900">{x.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {x.d}
                </p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-slate-500">
            InvestLink doesn&apos;t suggest, cap or benchmark rates. What you
            charge is your decision and your negotiation.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="How to Get Started"
            subtitle="From signup to your first collaboration"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-violet-100 text-lg font-bold text-violet-700">
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
                About getting paid
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
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Payments are on our roadmap. Until they ship, treat InvestLink as
              the place you find the work — not the place the money moves.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-violet-600 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Ready to start working?
          </h2>
          <p className="mt-3 text-violet-100">
            Build your profile, get matched on real skills, and pick the
            startups worth your time. Free while we&apos;re in beta.
          </p>
          <div className="mt-8">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-violet-700 hover:bg-violet-50"
            >
              Create your account →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
