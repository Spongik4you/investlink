import SectionTitle from "@/components/marketing/SectionTitle";
import Link from "next/link";
import { Users, Rocket, Globe } from "lucide-react";
import StatCard from "@/components/ui/StatCard";

export default function InvestorsPage() {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-full border border-blue-100 bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-700 inline-block">
            For Investors
          </div>
          <h1 className="mt-6 max-w-3xl text-5xl font-extrabold tracking-tight">
            Invest in Verified Startups <br /> with Complete Transparency
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Access curated deal flow, invest directly in startups, or deposit funds into managed portfolios.
            Every opportunity is verified and transparent.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/pricing" className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
              Start Investing →
            </Link>
            <Link href="#deal-flow" className="rounded-md border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50">
              View Deal Flow
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="Two Ways to Invest"
            subtitle="Choose the investment strategy that fits your goals and risk profile"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold">Direct Investments</h3>
              <p className="mt-2 text-sm text-slate-600">
                Choose individual startups from our verified pipeline. Review due diligence, pitch decks, and financials.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-slate-700">
                <li>✅ Full control over portfolio selection</li>
                <li>✅ Direct relationship with founders</li>
                <li>✅ Transparent terms and cap table</li>
                <li>✅ Higher potential returns</li>
              </ul>
              <button className="mt-8 w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                Browse Startups
              </button>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold">Managed Pools</h3>
              <p className="mt-2 text-sm text-slate-600">
                Deposit funds into diversified pools managed by our expert team. Fixed or variable return options.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-slate-700">
                <li>✅ Automatic portfolio diversification</li>
                <li>✅ Professional fund management</li>
                <li>✅ Lower risk through diversification</li>
                <li>✅ Predictable returns (fixed option)</li>
              </ul>
              <button className="mt-8 w-full rounded-md border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50">
                View Pools
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
