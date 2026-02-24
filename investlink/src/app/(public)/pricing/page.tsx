import Link from "next/link";
import Badge from "@/components/marketing/Badge";
import FAQ from "@/components/marketing/FAQ";

export default function PricingPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <Badge text="Simple, Transparent Pricing" tone="blue" />

          <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-slate-900">
            Full Platform Access for Just $1/Month
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            No hidden fees. No surprise charges. Pay only when deals close successfully.
          </p>

          <div className="mt-12 grid gap-6 text-left md:grid-cols-2">
            {/* Basic Plan */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-8 shadow-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                Most Popular
              </div>
              <div className="mt-4 text-lg font-bold">Basic Plan</div>
              <div className="text-sm text-slate-600">Access all platform features</div>

              <div className="mt-6 flex items-end gap-2">
                <div className="text-5xl font-extrabold">$1</div>
                <div className="pb-2 text-sm text-slate-600">/ per month</div>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-slate-700">
                {[
                  "Browse verified startups",
                  "Access expert marketplace",
                  "View investment opportunities",
                  "Real-time analytics dashboard",
                  "Secure messaging",
                  "Document management",
                  "24/7 platform support",
                ].map((x) => (
                  <li key={x}>✅ {x}</li>
                ))}
              </ul>

              <Link
                href="/auth/signup"
                className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Get Started →
              </Link>
            </div>

            {/* Success Fees */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="text-lg font-bold">Success Fees</div>
              <div className="text-sm text-slate-600">Only when deals close successfully</div>

              <div className="mt-6 flex items-end gap-2">
                <div className="text-5xl font-extrabold">1–1.5%</div>
                <div className="pb-2 text-sm text-slate-600">/ per transaction</div>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-slate-700">
                {[
                  "Charged on completed investments",
                  "Charged on expert contracts",
                  "No hidden fees",
                  "Transparent pricing",
                  "Escrow protection included",
                  "Full transaction history",
                  "Fee breakdown reports",
                ].map((x) => (
                  <li key={x}>✅ {x}</li>
                ))}
              </ul>

              <div className="mt-8 rounded-xl bg-slate-50 p-4 text-center text-sm font-semibold text-slate-700">
                Learn More →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TABLE */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Everything Included in Your Subscription
            </h2>
            <p className="mt-2 text-sm text-slate-600 md:text-base">
              Full access to all platform features for all user types
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-4 border-b border-slate-200 bg-white px-6 py-4 text-sm font-semibold">
              <div>Feature</div>
              <div className="text-center">Investors</div>
              <div className="text-center">Startups</div>
              <div className="text-center">Experts</div>
            </div>

            {[
              ["Platform Access", true, true, true],
              ["Browse Opportunities", true, true, true],
              ["Secure Messaging", true, true, true],
              ["Document Management", true, true, true],
              ["Real-time Analytics", true, true, true],
              ["Direct Investments", true, false, false],
              ["Managed Pools", true, false, false],
              ["Portfolio Tracking", true, false, false],
              ["Raise Capital", false, true, false],
              ["Hire Experts", false, true, false],
              ["Verification Badge", false, true, false],
              ["Project Marketplace", false, false, true],
              ["Job Notifications", false, false, true],
              ["Payment Processing", false, false, true],
            ].map(([name, i, s, e]) => (
              <div key={name as string} className="grid grid-cols-4 border-b border-slate-100 px-6 py-4 text-sm">
                <div className="text-slate-700">{name as string}</div>
                <div className="text-center">{i ? "✅" : "—"}</div>
                <div className="text-center">{s ? "✅" : "—"}</div>
                <div className="text-center">{e ? "✅" : "—"}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUCCESS FEES */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              How Success Fees Work
            </h2>
            <p className="mt-2 text-sm text-slate-600 md:text-base">
              Transparent fees only when your deals succeed
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {[
              {
                n: 1,
                t: "Investment Transactions",
                d: "When an investor completes an investment in a startup, a 1–1.5% success fee is charged on the investment amount.",
                ex: "Example: $50,000 investment → $500–$750 fee",
              },
              {
                n: 2,
                t: "Expert Contracts",
                d: "When a startup hires an expert, a 1–1.5% success fee is charged on the total contract value.",
                ex: "Example: $20,000 contract → $200–$300 fee",
              },
              {
                n: 3,
                t: "No Deal, No Fee",
                d: "If negotiations don’t result in a completed transaction, no success fee is charged. You only pay when deals successfully close.",
                ex: "",
              },
            ].map((x) => (
              <div key={x.n} className="rounded-xl border border-slate-200 p-5 mb-4 last:mb-0">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                    {x.n}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{x.t}</div>
                    <div className="mt-1 text-sm text-slate-600">{x.d}</div>
                    {x.ex ? (
                      <div className="mt-3 rounded-lg bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                        {x.ex}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-slate-600 md:text-base">
              Everything you need to know about our pricing
            </p>
          </div>

          <FAQ
            items={[
              { q: "What does the $1/month subscription include?", a: "Full platform access for all user types, including messaging, profiles, and browsing opportunities." },
              { q: "When are success fees charged?", a: "Only when an investment or expert contract is completed successfully." },
              { q: "Are there any hidden fees?", a: "No. Pricing is transparent and shown upfront." },
              { q: "Can I cancel my subscription anytime?", a: "Yes. You can cancel at any time; access continues until the end of your billing period." },
              { q: "What payment methods do you accept?", a: "Cards and supported local methods through Stripe (varies by country)." },
              { q: "Is there a free trial?", a: "You can start with the $1 plan; we also provide a money-back guarantee." },
              { q: "Do you offer discounts for annual subscriptions?", a: "Not yet. We’ll add annual plans later." },
              { q: "How are success fees calculated?", a: "A small percentage (1–1.5%) of completed transaction value, depending on deal type." },
            ]}
          />

          <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-green-200 bg-green-50/60 p-10 text-center">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-green-100 text-green-700">
              🛡️
            </div>
            <h3 className="mt-4 text-xl font-bold">14-Day Money-Back Guarantee</h3>
            <p className="mt-2 text-sm text-slate-600">
              Try InvestLink risk-free. If you&apos;re not completely satisfied within the first 14 days,
              we&apos;ll refund your subscription fee—no questions asked.
            </p>
            <div className="mt-6">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700"
              >
                Start Your Free Trial →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Join thousands already growing their portfolios, startups, and careers on InvestLink.
          </p>
          <div className="mt-8">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Join for $1/month →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
