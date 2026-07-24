import { Check, Clock } from "lucide-react";

/**
 * Înlocuiește secțiunea „Built on Trust and Security" din machetă.
 *
 * Aceea afirma PCI compliance, GDPR compliance, KYC/AML, escrow și suport 24/7
 * — certificări și capabilități pe care platforma nu le are. Afirmarea unei
 * conformități inexistente nu e marketing optimist, e declarație falsă.
 *
 * Varianta asta arată aceeași ambiție, dar separă clar ce EXISTĂ de ce URMEAZĂ.
 * Pentru un public de investitori și fondatori, transparența asta cântărește
 * mai mult decât o listă de badge-uri neverificabile.
 */

const LIVE = [
  "Two-way discovery between startups, investors and experts",
  "Requests, invitations and applications with full status tracking",
  "Skill-based matching that shows you exactly why it matched",
  "Collaboration lifecycle with private ratings on completion",
  "Investment records with charts, breakdowns and portfolio views",
  "In-app notifications for every request and response",
];

const NEXT = [
  "Payments and escrow for collaborations",
  "Identity verification for startups and investors",
  "Direct messaging between matched parties",
  "Public reputation built from completed work",
];

export default function RoadmapSection() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-50">
            <Check className="h-4 w-4 text-emerald-600" />
          </span>
          <h3 className="text-base font-bold text-slate-900">Live today</h3>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Working right now — sign up and use it.
        </p>
        <ul className="mt-4 space-y-[10px]">
          {LIVE.map((x) => (
            <li key={x} className="flex gap-[10px] text-sm text-slate-600">
              <Check className="mt-[3px] h-4 w-4 shrink-0 text-emerald-600" />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-100">
            <Clock className="h-4 w-4 text-slate-500" />
          </span>
          <h3 className="text-base font-bold text-slate-900">
            What we&apos;re building next
          </h3>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Not available yet — listed so you know where this is going.
        </p>
        <ul className="mt-4 space-y-[10px]">
          {NEXT.map((x) => (
            <li key={x} className="flex gap-[10px] text-sm text-slate-500">
              <Clock className="mt-[3px] h-4 w-4 shrink-0 text-slate-400" />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
