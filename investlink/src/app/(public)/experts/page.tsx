import Link from "next/link";
import Badge from "@/components/marketing/Badge";
import CardGrid from "@/components/marketing/CardGrid";
import StepsRow from "@/components/marketing/StepsRow";
import StatStrip from "@/components/marketing/StatStrip";

export default function ExpertsPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Badge text="For Experts" tone="purple" />

          <h1 className="mt-6 max-w-3xl text-5xl font-extrabold tracking-tight text-slate-900">
            Work with Ambitious <br />
            Startups from Anywhere in <br />
            the World
          </h1>

          <p className="mt-4 max-w-2xl text-slate-600">
            Join a global network of specialists collaborating with high-growth startups.
            Choose your projects, set your rates, and get paid securely.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
            >
              Become an Expert →
            </Link>
            <Link
              href="#browse"
              className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Browse Projects
            </Link>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Why Top Experts Choose InvestLink
            </h2>
            <p className="mt-2 text-sm text-slate-600 md:text-base">
              Work with the world&apos;s most exciting startups on your terms
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
              <h3 className="font-semibold">Global Opportunities</h3>
              <p className="mt-2 text-sm text-slate-600">
                Access startup projects from every corner of the world. Work remotely with teams building the next generation of technology.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>✅ 1,200+ active startups</li>
                <li>✅ 150+ countries represented</li>
                <li>✅ 100% remote friendly</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="font-semibold">Flexible Compensation</h3>
              <p className="mt-2 text-sm text-slate-600">
                Choose the payment model that works for you. Set your own rates and negotiate terms that match your value.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>✅ Hourly rates</li>
                <li>✅ Project-based fees</li>
                <li>✅ Equity compensation</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="font-semibold">Work Your Way</h3>
              <p className="mt-2 text-sm text-slate-600">
                Complete freedom to choose projects that match your expertise, interests, and schedule. No long-term commitments required.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>✅ Choose your projects</li>
                <li>✅ Set your availability</li>
                <li>✅ Work from anywhere</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <StepsRow
        tone="purple"
        title="How to Get Started"
        subtitle="From signup to your first project in days"
        steps={[
          { n: 1, title: "Register", desc: "Create expert profile" },
          { n: 2, title: "Showcase", desc: "Highlight your expertise" },
          { n: 3, title: "Discover", desc: "Receive job notifications" },
          { n: 4, title: "Apply", desc: "Submit proposals" },
          { n: 5, title: "Collaborate", desc: "Work and get paid" },
        ]}
      />

      {/* COMP MODELS */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Choose Your Compensation Model
            </h2>
            <p className="mt-2 text-sm text-slate-600 md:text-base">
              Flexible payment options to match your preferences
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold">Hourly Rate</h3>
              <p className="mt-2 text-sm text-slate-600">
                Get paid for every hour worked. Perfect for ongoing consultations and advisory roles.
              </p>
              <div className="mt-6 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Typical range:</span>
                  <span className="font-semibold text-slate-900">$50–$300/hr</span>
                </div>
                <div className="mt-2 flex justify-between text-slate-600">
                  <span>Payment frequency:</span>
                  <span className="font-semibold text-slate-900">Weekly</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-purple-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold">Project-Based</h3>
              <p className="mt-2 text-sm text-slate-600">
                Fixed fee for defined scope of work. Ideal for specific deliverables and milestones.
              </p>
              <div className="mt-6 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Typical range:</span>
                  <span className="font-semibold text-slate-900">$5K–$50K</span>
                </div>
                <div className="mt-2 flex justify-between text-slate-600">
                  <span>Payment frequency:</span>
                  <span className="font-semibold text-slate-900">Milestone</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold">Equity-Based</h3>
              <p className="mt-2 text-sm text-slate-600">
                Receive startup equity for your contributions. Participate in long-term upside.
              </p>
              <div className="mt-6 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Typical range:</span>
                  <span className="font-semibold text-slate-900">0.1%–2%</span>
                </div>
                <div className="mt-2 flex justify-between text-slate-600">
                  <span>Vesting:</span>
                  <span className="font-semibold text-slate-900">Custom</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECURE PAYMENTS */}
      <CardGrid
        cols={3}
        title="Secure International Payments"
        subtitle="Get paid safely and on time, no matter where you are"
        cards={[
          { title: "Escrow Protection", desc: "All payments held in secure escrow until milestones are completed and approved." },
          { title: "Multi-Currency Support", desc: "Receive payments in your local currency with competitive exchange rates and low fees." },
          { title: "Fast Withdrawals", desc: "Access your earnings within 24 hours of milestone approval via multiple withdrawal methods." },
        ]}
      />

      {/* FEATURES + DOMAINS */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Platform Features for Experts
            </h2>
            <p className="mt-2 text-sm text-slate-600 md:text-base">
              Everything you need to find work and get paid
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              ["Global Opportunities", "Access startup projects from every corner of the world."],
              ["Flexible Engagement", "Choose hourly, project-based, or equity compensation models."],
              ["Automatic Notifications", "Receive alerts for projects matching your expertise and interests."],
              ["Secure Payments", "International payments processed securely with escrow protection."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-slate-600">{d}</p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Join Your Domain Community
              </h2>
              <p className="mt-2 text-sm text-slate-600 md:text-base">
                15,000+ experts across 10+ specialized domains
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-5">
              {[
                ["Software Development", "3,500+ experts"],
                ["AI & Machine Learning", "1,200+ experts"],
                ["Marketing & Growth", "2,800+ experts"],
                ["Finance & Accounting", "1,900+ experts"],
                ["Legal & Compliance", "800+ experts"],
                ["Product Management", "1,500+ experts"],
                ["UX/UI Design", "2,100+ experts"],
                ["Cybersecurity", "600+ experts"],
                ["Blockchain", "900+ experts"],
                ["Business Strategy", "1,700+ experts"],
              ].map(([t, d]) => (
                <div key={t} className="rounded-xl border border-slate-100 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-purple-50 text-purple-700">
                    ▣
                  </div>
                  <div className="mt-3 text-sm font-semibold">{t}</div>
                  <div className="mt-1 text-xs text-slate-600">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <StatStrip />

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Ready to Start Working?
          </h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Join thousands of experts already collaborating with exciting startups worldwide.
          </p>
          <div className="mt-8">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700"
            >
              Become an Expert Today →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
