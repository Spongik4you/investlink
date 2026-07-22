import { prisma } from "@/lib/prisma";

export type SummaryMetrics = {
  totalRaisedUsd: number;
  investmentCount: number;
  distinctInvestorCount: number;
  /** Media pe investiție (total / count). 0 dacă nu există investiții. */
  averageInvestmentUsd: number;
};

export type CumulativePoint = {
  date: string; // ISO
  cumulativeUsd: number;
};

export type RoundBreakdownItem = {
  round: string; // "Unspecified" pentru cele fără rundă
  totalUsd: number;
  count: number;
};

export type TopInvestorItem = {
  name: string;
  totalUsd: number;
  onPlatform: boolean;
};

export type EquityBreakdown = {
  /** Suma equity cedat din investițiile cu equity declarat. */
  allocatedPercent: number;
  /** 100 - allocated, minim 0. Ce a RĂMAS (nu neapărat doar fondatori). */
  retainedPercent: number;
  /** true dacă cedatul depășește 100% — date de verificat. */
  overAllocated: boolean;
  /** Câte investiții au equity declarat (context onest). */
  investmentsWithEquity: number;
};

export type InvestmentAnalytics = {
  summary: SummaryMetrics;
  cumulative: CumulativePoint[];
  roundBreakdown: RoundBreakdownItem[];
  topInvestors: TopInvestorItem[];
  equity: EquityBreakdown;
  hasAnyRoundDeclared: boolean;
  hasAnyEquityDeclared: boolean;
};

/**
 * Agregă investițiile unui startup pentru statistică. TOATĂ matematica e aici
 * (server-side) — componentele doar desenează. startupProfileId din sesiune.
 */
export async function getInvestmentAnalytics(
  startupProfileId: string,
): Promise<InvestmentAnalytics> {
  const investments = await prisma.investment.findMany({
    where: { startupProfileId },
    orderBy: { investedAt: "asc" },
    select: {
      amountUsd: true,
      equityPercent: true,
      investedAt: true,
      round: true,
      investorProfileId: true,
      investorName: true,
    },
  });

  // ── Sumar ──
  let totalRaisedUsd = 0;
  let totalEquityPercent = 0;
  let investmentsWithEquity = 0;
  const investorKeys = new Set<string>();
  // Agregare pe investitor pentru "top investors".
  const investorTotals = new Map<
    string,
    { name: string; totalUsd: number; onPlatform: boolean }
  >();

  for (const inv of investments) {
    const amount = Number(inv.amountUsd);
    totalRaisedUsd += amount;

    if (inv.equityPercent != null) {
      totalEquityPercent += Number(inv.equityPercent);
      investmentsWithEquity += 1;
    }

    const key =
      inv.investorProfileId ?? `ext:${inv.investorName.trim().toLowerCase()}`;
    investorKeys.add(key);

    const cur = investorTotals.get(key) ?? {
      name: inv.investorName,
      totalUsd: 0,
      onPlatform: inv.investorProfileId != null,
    };
    cur.totalUsd += amount;
    investorTotals.set(key, cur);
  }

  const investmentCount = investments.length;
  const averageInvestmentUsd =
    investmentCount > 0 ? Math.round(totalRaisedUsd / investmentCount) : 0;

  // ── Evoluție cumulativă ──
  // FIX axă de timp: punctele sunt la datele reale ale investițiilor, iar dacă
  // ultima investiție e în trecut, întindem un punct final "azi" cu aceeași
  // valoare cumulativă (linia nu mai arată "Jul 26 → Jul 26"; merge de la prima
  // investiție reală până în prezent).
  const cumulative: CumulativePoint[] = [];
  let running = 0;
  for (const inv of investments) {
    running += Number(inv.amountUsd);
    cumulative.push({
      date: inv.investedAt.toISOString(),
      cumulativeUsd: running,
    });
  }
  if (cumulative.length > 0) {
    const lastDate = new Date(cumulative[cumulative.length - 1].date);
    const now = new Date();
    // Doar dacă ultima investiție NU e chiar azi, adăugăm un punct "acum".
    const sameDay =
      lastDate.getFullYear() === now.getFullYear() &&
      lastDate.getMonth() === now.getMonth() &&
      lastDate.getDate() === now.getDate();
    if (!sameDay && lastDate < now) {
      cumulative.push({ date: now.toISOString(), cumulativeUsd: running });
    }
  }

  // ── Breakdown pe rundă ──
  const roundMap = new Map<string, { totalUsd: number; count: number }>();
  let hasAnyRoundDeclared = false;
  for (const inv of investments) {
    const label = inv.round?.trim() || "Unspecified";
    if (inv.round?.trim()) hasAnyRoundDeclared = true;
    const cur = roundMap.get(label) ?? { totalUsd: 0, count: 0 };
    cur.totalUsd += Number(inv.amountUsd);
    cur.count += 1;
    roundMap.set(label, cur);
  }
  const roundBreakdown: RoundBreakdownItem[] = Array.from(roundMap.entries())
    .map(([round, v]) => ({ round, totalUsd: v.totalUsd, count: v.count }))
    .sort((a, b) => b.totalUsd - a.totalUsd);

  // ── Top investitori ──
  const topInvestors: TopInvestorItem[] = Array.from(investorTotals.values())
    .map((v) => ({ name: v.name, totalUsd: v.totalUsd, onPlatform: v.onPlatform }))
    .sort((a, b) => b.totalUsd - a.totalUsd)
    .slice(0, 5);

  // ── Equity: cedat vs rămas (etichete oneste) ──
  const roundedAllocated = Math.round(totalEquityPercent * 100) / 100;
  const overAllocated = roundedAllocated > 100;
  const equity: EquityBreakdown = {
    allocatedPercent: roundedAllocated,
    retainedPercent: Math.max(0, Math.round((100 - roundedAllocated) * 100) / 100),
    overAllocated,
    investmentsWithEquity,
  };

  return {
    summary: {
      totalRaisedUsd,
      investmentCount,
      distinctInvestorCount: investorKeys.size,
      averageInvestmentUsd,
    },
    cumulative,
    roundBreakdown,
    topInvestors,
    equity,
    hasAnyRoundDeclared,
    hasAnyEquityDeclared: investmentsWithEquity > 0,
  };
}
