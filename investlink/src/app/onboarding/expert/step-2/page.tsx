export default function ExpertStep2Page() {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-center text-sm text-slate-500">Step 2 of 3</p>

      {/* progress bar */}
      <div className="mx-auto mt-4 h-2 w-full max-w-3xl rounded-full bg-slate-200">
        <div className="h-2 w-1/2 rounded-full bg-blue-600" />
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Experience</h2>
        <p className="mt-1 text-sm text-slate-500">
          Share your professional journey and achievements.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <label className="text-sm font-medium text-slate-900">
              Years of Experience
            </label>
            <div className="mt-4">
              <div className="relative h-2 w-full rounded-full bg-slate-200">
                <div className="absolute left-0 top-0 h-2 w-1/3 rounded-full bg-blue-600" />
                <div className="absolute left-1/3 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-blue-600 bg-white shadow-sm" />
              </div>
              <div className="mt-3 flex justify-between text-sm text-slate-500">
                <span>0</span>
                <span>5+ years</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-900">
              Past Success Stories / Portfolio
            </label>
            <textarea
              className="mt-2 min-h-[140px] w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Detail your most impactful projects..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Previous
            </button>
            <button className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
