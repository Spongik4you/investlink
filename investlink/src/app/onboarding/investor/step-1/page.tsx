import Link from "next/link";

export default function InvestorStep1Page() {
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
            <div className="h-[2px] w-14 bg-slate-200" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
              2
            </div>
            <div className="h-[2px] w-14 bg-slate-200" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
              3
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-sm text-slate-500">
          Step 1 of 3: Profile
        </p>

        {/* Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900">Investor Type</h2>

          {/* Toggle buttons */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <button className="rounded-xl border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
              Angel
            </button>
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              VC
            </button>
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Corporate
            </button>
          </div>

          {/* Budget slider placeholder */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Investment Budget
            </h2>

            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <span>$100,000</span>
              <span>-</span>
              <span>$1,000,000</span>
            </div>

            <div className="mt-3">
              <div className="relative h-2 w-full rounded-full bg-slate-200">
                <div className="absolute left-0 top-0 h-2 w-1/3 rounded-full bg-blue-600" />
                <div className="absolute left-1/3 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-blue-600 bg-white shadow-sm" />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>$100,000</span>
              <span>$10,000,000</span>
            </div>
          </div>

          {/* Risk tolerance cards */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Risk Tolerance
            </h2>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <button className="rounded-2xl border border-slate-200 bg-white p-5 text-center hover:bg-slate-50">
                <div className="text-2xl">🙂</div>
                <div className="mt-2 text-sm font-semibold text-slate-700">
                  Low
                </div>
              </button>

              <button className="rounded-2xl border border-blue-600 bg-blue-50 p-5 text-center">
                <div className="text-2xl">😐</div>
                <div className="mt-2 text-sm font-semibold text-blue-700">
                  Medium
                </div>
              </button>

              <button className="rounded-2xl border border-slate-200 bg-white p-5 text-center hover:bg-slate-50">
                <div className="text-2xl">☹️</div>
                <div className="mt-2 text-sm font-semibold text-slate-700">
                  High
                </div>
              </button>
            </div>
          </div>

          {/* Next button */}
          <div className="mt-8">
            <Link href="/onboarding/investor/step-2">
            <button className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
              Next Step
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
