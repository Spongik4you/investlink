import { Compass, Handshake, Inbox, TrendingUp } from "lucide-react";

/**
 * Previzualizare a dashboard-ului real al investitorului.
 *
 * Macheta avea aici $248,500, „18.2% Annualized IRR" și „Startup #1/#2/#3" —
 * cifre inventate, iar IRR-ul nici nu e calculat nicăieri în platformă.
 *
 * Varianta asta arată ETICHETELE reale ale dashboard-ului construit, cu valori
 * marcate explicit ca exemplu. Un vizitator vede structura pe care o va primi,
 * nu o performanță pe care i-o promitem.
 */
const KPIS = [
  { label: "Total Invested", sample: "—", Icon: TrendingUp },
  { label: "Startups Backed", sample: "—", Icon: Compass },
  { label: "Active Relationships", sample: "—", Icon: Handshake },
  { label: "Incoming Interest", sample: "—", Icon: Inbox },
];

export default function InvestorDashboardPreview() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-slate-900">
            Your investor dashboard
          </div>
          <div className="text-xs text-slate-500">
            This is the actual layout — values fill in from your own activity.
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
          Empty state shown
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div
            key={k.label}
            className="rounded-xl border border-slate-100 bg-slate-50 p-4"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white">
              <k.Icon className="h-4 w-4 text-blue-600" />
            </span>
            <div className="mt-3 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">
              {k.label}
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-300">
              {k.sample}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-100 p-4">
          <div className="text-sm font-semibold text-slate-900">
            Capital deployed
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Your investments per month, over the last 12 months.
          </p>
        </div>
        <div className="rounded-xl border border-slate-100 p-4">
          <div className="text-sm font-semibold text-slate-900">Portfolio</div>
          <p className="mt-1 text-xs text-slate-500">
            Each startup you&apos;ve backed: amount, equity and last activity —
            as recorded by that startup.
          </p>
        </div>
      </div>
    </div>
  );
}
