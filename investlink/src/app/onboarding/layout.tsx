import type { ReactNode } from "react";
import Link from "next/link";

function OnboardingNavbar() {
  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-blue-700 text-white
                        transition-transform duration-200 group-hover:scale-105" aria-hidden="true">
            <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.0"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* trending line */}
                <path d="M4 16l6-6 4 4 6-6" />
                {/* arrow corner */}
                <path d="M20 8v6" />
                <path d="M20 8h-6" />
              </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            InvestLink Onboarding
          </span>
        </Link>
      </div>
    </header>
  );
}

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* <OnboardingNavbar /> */}
      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
