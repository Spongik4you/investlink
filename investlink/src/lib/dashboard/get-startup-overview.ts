import { prisma } from "@/lib/prisma";

export type StartupKpis = {
  totalRaisedUsd: number;
  /** Capital strâns în luna curentă — badge REAL, nu procent inventat. */
  raisedThisMonthUsd: number;
  investorCount: number;
  /** Investitori care au investit prima dată luna asta. */
  newInvestorsThisMonth: number;
  activeExpertCount: number;
};

export type MonthlyCapitalPoint = {
  /** "2026-07" */
  month: string;
  /** Etichetă scurtă pentru axă: "Jul 26" */
  label: string;
  totalUsd: number;
};

export type RecentInvestmentRow = {
  id: string;
  investorName: string;
  onPlatform: boolean;
  round: string | null;
  amountUsd: number;
  investedAt: string;
};

export type ActiveExpertRow = {
  id: string;
  name: string;
  roleTitle: string;
  currentProjectTitle: string | null;
};

/** Lucruri care așteaptă RĂSPUNSUL startup-ului (nu cereri trimise de el). */
export type PendingActions = {
  expertApplications: number;
  investorInterests: number;
  total: number;
};

export type StartupOverviewData = {
  companyName: string;
  kpis: StartupKpis;
  monthlyCapital: MonthlyCapitalPoint[];
  recentInvestments: RecentInvestmentRow[];
  activeExperts: ActiveExpertRow[];
  pendingActions: PendingActions;
};

const LIVE_COLLABORATION_STATUSES = ["ACTIVE", "BUSY", "PAUSED"] as const;

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "2-digit",
  }).format(new Date(y, m - 1, 1));
}

function personName(first: string | null, last: string | null): string {
  return [first?.trim(), last?.trim()].filter(Boolean).join(" ") || "Expert";
}

/**
 * Datele dashboard-ului principal al startup-ului.
 *
 * Toate cifrele vin din modelele REALE și folosesc aceleași definiții ca pagina
 * Analytics, ca cele două să nu poată diverge (lecția din pasul E1, unde
 * dashboard-ul raporta $0 iar Analytics $72k).
 *
 * Badge-urile KPI sunt calculate, nu hardcodate: „strâns luna asta" și
 * „investitori noi luna asta" se derivă din investedAt.
 */
export async function getStartupOverview(
  startupProfileId: string,
): Promise<StartupOverviewData> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [profile, investments, collaborations, expertApplications, investorInterests] =
    await Promise.all([
      prisma.startupProfile.findUnique({
        where: { id: startupProfileId },
        select: { companyName: true },
      }),
      prisma.investment.findMany({
        where: { startupProfileId },
        orderBy: { investedAt: "desc" },
        select: {
          id: true,
          investorName: true,
          investorProfileId: true,
          round: true,
          amountUsd: true,
          investedAt: true,
        },
      }),
      prisma.startupExpertCollaboration.findMany({
        where: {
          startupProfileId,
          status: { in: [...LIVE_COLLABORATION_STATUSES] },
        },
        orderBy: { startedAt: "desc" },
        select: {
          id: true,
          displayName: true,
          roleTitle: true,
          currentProjectTitle: true,
          expertProfile: { select: { firstName: true, lastName: true } },
        },
      }),
      prisma.collaborationInvitation.count({
        where: { startupProfileId, initiatedBy: "EXPERT", status: "PENDING" },
      }),
      prisma.investmentInterest.count({
        where: { startupProfileId, initiatedBy: "INVESTOR", status: "PENDING" },
      }),
    ]);

  // ── KPI + badge-uri reale ──
  let totalRaisedUsd = 0;
  let raisedThisMonthUsd = 0;
  const investorKeys = new Set<string>();
  // Cheie investitor → prima dată când a investit (pentru „noi luna asta").
  const firstInvestmentAt = new Map<string, Date>();

  for (const inv of investments) {
    const amount = Number(inv.amountUsd);
    totalRaisedUsd += amount;
    if (inv.investedAt >= startOfMonth) raisedThisMonthUsd += amount;

    const key =
      inv.investorProfileId ?? `ext:${inv.investorName.trim().toLowerCase()}`;
    investorKeys.add(key);

    const prev = firstInvestmentAt.get(key);
    if (!prev || inv.investedAt < prev) {
      firstInvestmentAt.set(key, inv.investedAt);
    }
  }

  let newInvestorsThisMonth = 0;
  for (const first of firstInvestmentAt.values()) {
    if (first >= startOfMonth) newInvestorsThisMonth += 1;
  }

  // ── Capital lunar (ultimele 12 luni, inclusiv lunile fără investiții) ──
  const byMonth = new Map<string, number>();
  for (const inv of investments) {
    const k = monthKey(inv.investedAt);
    byMonth.set(k, (byMonth.get(k) ?? 0) + Number(inv.amountUsd));
  }

  const monthlyCapital: MonthlyCapitalPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const k = monthKey(d);
    monthlyCapital.push({
      month: k,
      label: monthLabel(k),
      totalUsd: byMonth.get(k) ?? 0,
    });
  }

  // ── Ultimele investiții (deja sortate desc) ──
  const recentInvestments: RecentInvestmentRow[] = investments
    .slice(0, 5)
    .map((inv) => ({
      id: inv.id,
      investorName: inv.investorName,
      onPlatform: inv.investorProfileId != null,
      round: inv.round,
      amountUsd: Number(inv.amountUsd),
      investedAt: inv.investedAt.toISOString(),
    }));

  // ── Experți activi ──
  const activeExperts: ActiveExpertRow[] = collaborations
    .slice(0, 5)
    .map((c) => ({
      id: c.id,
      name: c.expertProfile
        ? personName(c.expertProfile.firstName, c.expertProfile.lastName)
        : c.displayName,
      roleTitle: c.roleTitle,
      currentProjectTitle: c.currentProjectTitle,
    }));

  return {
    companyName: profile?.companyName || "Startup",
    kpis: {
      totalRaisedUsd,
      raisedThisMonthUsd,
      investorCount: investorKeys.size,
      newInvestorsThisMonth,
      activeExpertCount: collaborations.length,
    },
    monthlyCapital,
    recentInvestments,
    activeExperts,
    pendingActions: {
      expertApplications,
      investorInterests,
      total: expertApplications + investorInterests,
    },
  };
}
