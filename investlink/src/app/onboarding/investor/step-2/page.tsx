import Link from "next/link";

export default function InvestorStep2Page() {
  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Title */}
        <h1 className="text-center text-3xl font-semibold tracking-tight text-slate-900">
          Investor Profile Setup
        </h1>

        {/* Stepper (1-2-3) */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              1
            </div>
            <div className="h-[2px] w-14 bg-blue-600" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              2
            </div>
            <div className="h-[2px] w-14 bg-slate-200" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
              3
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-sm text-slate-500">
          Step 2 of 3: Strategy
        </p>

        {/* Card-like content area (as in photo) */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Define Your Investment Strategy
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Specify your target returns, preferred timeframe, and flexibility for your investments.
          </p>

          <div className="mt-6 space-y-5">
            {/* Target ROI */}
            <div>
              <label className="text-sm font-medium text-slate-900">
                Target ROI (%)
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="8"
                defaultValue="8"
              />
            </div>

            {/* Horizon */}
            <div>
              <label className="text-sm font-medium text-slate-900">
                Investment Horizon
              </label>
              <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                <option value="">Select timeframe</option>
                <option>0–6 months</option>
                <option>6–12 months</option>
                <option>1–3 years</option>
                <option>3–5 years</option>
                <option>5+ years</option>
              </select>
            </div>

            {/* Negotiable */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-4">
              <div>
                <div className="text-sm font-medium text-slate-900">
                  Negotiable Terms
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Indicate if you&apos;re flexible with deal structure.
                </div>
              </div>

              {/* Toggle (visual only) */}
              <div className="h-7 w-12 rounded-full bg-slate-300">
                <div className="mt-[2px] ml-[2px] h-6 w-6 rounded-full bg-white shadow-sm" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-2">
              <Link href="onboarding/investor/step-1">
              <button className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Previous Step
              </button>
              </Link>
              <Link href="onboarding/investor/step-3">
              <button className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                Next Step
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
