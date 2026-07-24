import { Check, Clock, Minus } from "lucide-react";

/**
 * Matrice de capabilități pe rol.
 *
 * Înlocuiește tabelul „Everything Included in Your Subscription" din machetă,
 * care lista Managed Pools, Verification Badge, Secure Messaging, Document
 * Management și Payment Processing — cinci din paisprezece rânduri descriau
 * funcționalități inexistente.
 *
 * Aici sunt doar lucruri LIVE, plus un grup marcat clar ca planificat. Un
 * vizitator vede exact ce primește rolul lui azi, și ce urmează.
 */

type Cell = boolean;

type Row = {
  feature: string;
  investors: Cell;
  startups: Cell;
  experts: Cell;
};

const LIVE_ROWS: Row[] = [
  { feature: "Browse and filter the other side of the platform", investors: true, startups: true, experts: true },
  { feature: "Send a request or express interest", investors: true, startups: true, experts: true },
  { feature: "Receive requests in a dedicated inbox", investors: true, startups: true, experts: true },
  { feature: "Accept, decline or withdraw a request", investors: true, startups: true, experts: true },
  { feature: "In-app notifications for every event", investors: true, startups: true, experts: true },
  { feature: "Skill-based matching with visible reasons", investors: false, startups: true, experts: true },
  { feature: "Collaboration lifecycle with private ratings", investors: false, startups: true, experts: true },
  { feature: "Record investments received", investors: false, startups: true, experts: false },
  { feature: "Funding analytics and charts", investors: false, startups: true, experts: false },
  { feature: "Portfolio of startups you've backed", investors: true, startups: false, experts: false },
  { feature: "Profile strength guidance", investors: false, startups: false, experts: true },
];

const PLANNED_ROWS: string[] = [
  "Payments and escrow",
  "Direct messaging between matched parties",
  "Identity verification",
  "Public reputation from completed work",
];

function Yes() {
  return (
    <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-emerald-50">
      <Check className="h-[15px] w-[15px] text-emerald-600" />
    </span>
  );
}

function No() {
  return <Minus className="mx-auto h-4 w-4 text-slate-300" />;
}

export default function CapabilityMatrix() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-5 py-3 text-left text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                Capability
              </th>
              {["Investors", "Startups", "Experts"].map((r) => (
                <th
                  key={r}
                  className="px-5 py-3 text-center text-[12px] font-semibold uppercase tracking-wide text-slate-500"
                >
                  {r}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LIVE_ROWS.map((row) => (
              <tr key={row.feature} className="border-b border-slate-100 last:border-0">
                <td className="px-5 py-[14px] text-sm text-slate-700">
                  {row.feature}
                </td>
                <td className="px-5 py-[14px] text-center">
                  {row.investors ? <Yes /> : <No />}
                </td>
                <td className="px-5 py-[14px] text-center">
                  {row.startups ? <Yes /> : <No />}
                </td>
                <td className="px-5 py-[14px] text-center">
                  {row.experts ? <Yes /> : <No />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Planificate — separate vizual, ca să nu fie confundate cu ce e live. */}
      <div className="border-t border-slate-200 bg-slate-50 px-5 py-5">
        <div className="mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-500" />
          <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">
            Planned — not available yet
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PLANNED_ROWS.map((p) => (
            <span
              key={p}
              className="rounded-full border border-slate-200 bg-white px-3 py-[5px] text-[12.5px] text-slate-500"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
