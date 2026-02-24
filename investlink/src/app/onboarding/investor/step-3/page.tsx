import Link from "next/link";

export default function InvestorStep3Page() {
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
            <div className="h-[2px] w-14 bg-blue-600" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              3
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-sm text-slate-500">
          Step 3 of 3
        </p>

        {/* Centered feature card as in photo */}
        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              AI-Managed Investment Deposit
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Unlock optimized growth with advanced algorithmic strategies tailored to your profile.
            </p>

            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Enable 10–15% AI-Managed Return
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Benefit from our proprietary AI models designed to dynamically adjust your portfolio
                    for optimal performance and sustained long-term growth. This feature incurs a 0.5%
                    annual management fee on the managed portion of your deposit.
                  </p>
                </div>

                {/* Toggle (ON) */}
                <div className="h-7 w-12 rounded-full bg-blue-600">
                  <div className="mt-[2px] ml-[26px] h-6 w-6 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            </div>

            <Link href="/onboarding/investor/step-3">
            <button className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
              Complete Setup
            </button>
            </Link>
            
            <Link href="onboarding/investor/step-1">
            <button className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Previous Step
            </button>
            </Link>
          </div>
        </div>

        {/* Footer disclaimer */}
        <p className="mt-10 text-center text-xs text-slate-400">
          Legal Disclaimer: Past performance does not guarantee future results. AI-managed returns involve risks.
          Please read our full terms and conditions carefully before proceeding.
        </p>
      </div>
    </div>
  );
}
