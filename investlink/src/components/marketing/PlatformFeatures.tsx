import {
  BarChart3,
  Bell,
  Compass,
  Handshake,
  Star,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/**
 * Înlocuiește „Enterprise-Grade Platform Features" din machetă.
 *
 * Aceea lista escrow, smart contracts, AI matching, verificare în 6 pași și
 * 150+ țări — nimic din care să existe. Astea sunt capabilitățile REALE, toate
 * verificabile de oricine se înscrie.
 */
const FEATURES: Array<{ Icon: LucideIcon; title: string; desc: string }> = [
  {
    Icon: Compass,
    title: "Two-way discovery",
    desc: "Every role can search and be found. Startups reach out to investors and experts; both can reach back.",
  },
  {
    Icon: Handshake,
    title: "Clear request lifecycle",
    desc: "Send, withdraw, accept or decline — with the status visible to both sides at every step.",
  },
  {
    Icon: Star,
    title: "Transparent matching",
    desc: "Matches show which of a startup's needs overlap your skills, so you can judge the fit yourself.",
  },
  {
    Icon: BarChart3,
    title: "Funding analytics",
    desc: "Capital over time, breakdown by round, equity allocated and top investors — from your own records.",
  },
  {
    Icon: Wallet,
    title: "Investment tracking",
    desc: "Startups record what they raise; linked investors see their position in each company they backed.",
  },
  {
    Icon: Bell,
    title: "Activity notifications",
    desc: "Know the moment someone invites you, applies to you, or answers a request you sent.",
  },
];

export default function PlatformFeatures() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((f) => (
        <div
          key={f.title}
          className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
        >
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50">
            <f.Icon className="h-5 w-5 text-blue-600" />
          </span>
          <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {f.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
