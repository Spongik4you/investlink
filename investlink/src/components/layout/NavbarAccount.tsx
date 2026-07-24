"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { LayoutDashboard } from "lucide-react";

/** Dashboard-ul depinde de rol; rolul vine din sesiune (JWT), nu din client. */
const DASHBOARD_PATH: Record<string, string> = {
  STARTUP: "/dashboard/startup",
  EXPERT: "/dashboard/expert",
  INVESTOR: "/dashboard/investor",
};

function initialsFrom(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 2) return `${p[0][0]}${p[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

/**
 * Zona din dreapta a navbar-ului public.
 *
 * Delogat  → Sign In / Get Started.
 * Logat    → insigna cu numele utilizatorului, care duce înapoi în dashboard.
 *
 * Cât timp sesiunea se încarcă nu afișăm nimic în locul butoanelor: un
 * "Sign In" care apoi sare în insignă e mai deranjant decât o pauză scurtă.
 */
export function NavbarAccount() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-9 w-[150px] animate-pulse rounded-md bg-slate-100" />;
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/auth/signin"
          className="text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          Sign In
        </Link>
        <Link
          href="/auth/signup"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Get Started
        </Link>
      </div>
    );
  }

  const name = session.user.name?.trim() || "Account";
  const type = session.user.type as string | undefined;

  // Onboarding neterminat → îl trimitem acolo, nu într-un dashboard care
  // oricum l-ar redirecționa înapoi.
  const href =
    session.user.onboardingStatus !== "COMPLETED"
      ? "/onboarding"
      : (type && DASHBOARD_PATH[type]) || "/dashboard";

  return (
    <Link
      href={href}
      className="group flex items-center gap-[9px] rounded-md border border-slate-200 py-[5px] pl-[6px] pr-3 transition hover:border-blue-300 hover:bg-blue-50"
      title="Back to your dashboard"
    >
      <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
        {initialsFrom(name)}
      </span>
      <span className="hidden leading-tight sm:block">
        <span className="block max-w-[130px] truncate text-[13px] font-semibold text-slate-900">
          {name}
        </span>
        <span className="flex items-center gap-[3px] text-[11px] font-medium text-blue-600">
          <LayoutDashboard className="h-[11px] w-[11px]" />
          Dashboard
        </span>
      </span>
    </Link>
  );
}
