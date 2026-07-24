import { Info } from "lucide-react";

/**
 * Anunțul de beta.
 *
 * Deliberat FĂRĂ dată fixă pentru introducerea plăților: o dată ratată e încă
 * o promisiune încălcată. Promitem notificarea în avans — asta putem controla.
 */
export default function BetaNotice() {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 md:p-6">
      <div className="flex gap-3">
        <div className="mt-[2px] shrink-0">
          <Info className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            InvestLink is in open beta — access is free
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            We&apos;re building this in the open and testing with real users, so
            the platform is free to use while we gather feedback. Paid plans
            will be introduced later, and every existing user will be notified
            well in advance — nobody gets charged by surprise.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            If you try it and something feels wrong or missing, tell us. That&apos;s
            what this phase is for.
          </p>
        </div>
      </div>
    </div>
  );
}
