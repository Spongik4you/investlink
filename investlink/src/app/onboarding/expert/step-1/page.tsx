import Link from "next/link";

export default function ExpertStep1Page() {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-center text-sm text-slate-500">Step 1 of 3</p>

      <h1 className="mt-3 text-center text-4xl font-semibold tracking-tight text-slate-900">
        Create Your Expert Profile
      </h1>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Profile Information
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Provide your essential professional details to get started.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <label className="text-sm font-medium text-slate-900">
              Full Name
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-900">
              Professional Role
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="e.g., Venture Capitalist, Product Manager"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-900">
              Core Superpower (Main Skill)
            </label>
            <textarea
              className="mt-2 min-h-[120px] w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Describe your primary skill or area of expertise..."
            />
          </div>

          {/* Industries */}
          <div>
            <label className="text-sm font-medium text-slate-900">
              Preferred Industries
            </label>

            <div className="mt-4 grid grid-cols-2 gap-y-3 text-sm text-slate-700">
              {[
                "Fintech",
                "AI & Machine Learning",
                "Biotechnology",
                "Renewable Energy",
                "E-commerce",
                "Healthcare",
                "Logistics & Supply Chain",
                "Real Estate Tech",
                "Cybersecurity",
                "Space Exploration",
              ].map((x) => (
                <label key={x} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                  {x}
                </label>
              ))}
            </div>
          </div>

          {/* Next */}
          <div className="flex justify-end pt-2">
            <Link href="/onboarding/investor/step-2">
              <button className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                Next
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
