export default function ExpertStep3Page() {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-center text-sm text-slate-500">
        Step 3 of 3: Collaboration
      </p>

      <div className="mt-8 space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Minimum Project Rate
          </h2>
          <input
            className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="$  e.g., 500"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Availability</h2>
          <select className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
            <option>Select hours per week</option>
            <option>1–5</option>
            <option>5–10</option>
            <option>10–20</option>
            <option>20+</option>
          </select>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Role Type</h2>

          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <label className="flex items-center gap-3">
              <input type="radio" name="roleType" defaultChecked />
              Mentor
            </label>
            <label className="flex items-center gap-3">
              <input type="radio" name="roleType" />
              Advisor
            </label>
            <label className="flex items-center gap-3">
              <input type="radio" name="roleType" />
              Full-time
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Open to Equity
            </h2>
            <div className="h-7 w-12 rounded-full bg-slate-300">
              <div className="mt-[2px] ml-[2px] h-6 w-6 rounded-full bg-white shadow-sm" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Previous
          </button>
          <button className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
            Finish Profile
          </button>
        </div>
      </div>
    </div>
  );
}
