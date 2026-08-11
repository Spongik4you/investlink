import Link from "next/link";
import { TrendingUp } from "lucide-react";

/**
 * Shell partajat pentru signin / signup, cu ACELAȘI panou întunecat stânga ca
 * onboarding-ul (OnboardingShell). Scopul e continuitatea vizuală cerută:
 * autentificarea și onboarding-ul trebuie să pară același flux, nu două lumi.
 */
export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[380px_1fr]">
      {/* Panou stânga — oglindește onboarding-ul */}
      <aside className="relative hidden overflow-hidden bg-[#0B1120] px-10 py-12 lg:flex lg:flex-col">
        <div className="pointer-events-none absolute -left-20 -top-28 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />

        <Link href="/" className="relative flex items-center gap-[10px]">
          <span className="grid h-9 w-9 place-items-center rounded-[9px] bg-blue-600">
            <TrendingUp className="h-[18px] w-[18px] text-white" />
          </span>
          <span className="text-[17px] font-bold text-white">InvestLink</span>
        </Link>

        <div className="relative mt-12">
          <h2 className="text-2xl font-bold leading-snug text-white">
            One account. <br />
            Three ways to build.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Whether you invest, raise, or lend your expertise — it all starts
            with the same account. You&apos;ll pick your role in the next step.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-slate-300">
            {[
              "Discover and be discovered across roles",
              "Track everything in one dashboard",
              "Free while we're in beta",
            ].map((x) => (
              <li key={x} className="flex items-center gap-[10px]">
                <span className="h-[6px] w-[6px] rounded-full bg-blue-400" />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Conținut dreapta */}
      <main className="flex items-center justify-center bg-slate-50 px-5 py-12">
        <div className="w-full max-w-md">
          {/* Logo vizibil pe mobil, unde panoul stâng e ascuns */}
          <Link
            href="/"
            className="mb-8 flex items-center gap-[10px] lg:hidden"
          >
            <span className="grid h-9 w-9 place-items-center rounded-[9px] bg-blue-600">
              <TrendingUp className="h-[18px] w-[18px] text-white" />
            </span>
            <span className="text-[17px] font-bold text-slate-900">
              InvestLink
            </span>
          </Link>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-blue-600">
              {eyebrow}
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-1 text-sm text-slate-600">{subtitle}</p>

            <div className="mt-6">{children}</div>
          </div>

          {footer && (
            <div className="mt-5 text-center text-sm text-slate-600">
              {footer}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/** Butoanele OAuth, identice pe ambele pagini. */
export function OAuthButtons({
  onGoogle,
  onLinkedIn,
}: {
  onGoogle: () => void;
  onLinkedIn: () => void;
}) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onGoogle}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-[10px] text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Continue with Google
      </button>
      <button
        type="button"
        onClick={onLinkedIn}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-[10px] text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Continue with LinkedIn
      </button>
    </div>
  );
}

export function OrDivider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-slate-200" />
      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        or
      </span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}
