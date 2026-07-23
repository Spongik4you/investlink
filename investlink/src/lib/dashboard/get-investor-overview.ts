import { prisma } from "@/lib/prisma";

export type InvestorKpis = {
  totalInvestedUsd: number;
  /** Capital desfășurat în luna curentă — badge real, nu procent inventat. */
  investedThisMonthUsd: number;
  startupsBacked: number;
  activeRelationships: number;
  incomingInterest: number;
};

export type MonthlyDeployedPoint = {
  month: string;
  label: string;
  totalUsd: number;
};

export type PortfolioRow = {
  startupProfileId: string;
  companyName: string;
  totalInvestedUsd: number;
  /** Equity cumulat, așa cum l-a înregistrat startup-ul. null dacă nedeclarat. */
  equityPercent: number | null;
  lastInvestedAt: string;
};

export type DiscoverStartupRow = {
  startupProfileId: string;
  companyName: string;
  oneLiner: string | null;
  fundingStage: string | null;
  industries: string[];
};

export type InvestorOverviewData = {
  userName: string;
  firstName: string;
  kpis: InvestorKpis;
  monthlyDeployed: MonthlyDeployedPoint[];
  portfolio: PortfolioRow[];
  discoverStartups: DiscoverStartupRow[];
};

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

/**
 * Datele dashboard-ului investitorului.
 *
 * DECIZIE (revizuită față de pasul C): investitorul vede investițiile
 * înregistrate despre el. Startup-ul rămâne sursa unică — de aceea UI-ul le
 * etichetează „as recorded by the startup". Nu facem reconciliere: dacă cifra
 * diferă de ce știe investitorul, discrepanța e ea însăși informație utilă.
 *
 * NU calculăm valoare curentă / profit nerealizat / risc: ar cere evaluări pe
 * care nimeni nu le introduce. Estimarea din runda anterioară ignoră diluția și
 * clasele de acțiuni — o adăugăm doar când datele o susțin, etichetată explicit.
 */
export async function getInvestorOverview(
  investorProfileId: string,
): Promise<InvestorOverviewData> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [profile, investments, activeRelationships, incomingInterest, discoverRaw] =
    await Promise.all([
      prisma.investorProfile.findUnique({
        where: { id: investorProfileId },
        select: { firstName: true, lastName: true },
      }),
      prisma.investment.findMany({
        where: { investorProfileId },
        orderBy: { investedAt: "desc" },
        select: {
          startupProfileId: true,
          amountUsd: true,
          equityPercent: true,
          investedAt: true,
          startupProfile: { select: { companyName: true } },
        },
      }),
      prisma.investmentInterest.count({
        where: { investorProfileId, status: "ACCEPTED" },
      }),
      prisma.investmentInterest.count({
        where: { investorProfileId, status: "PENDING", initiatedBy: "STARTUP" },
      }),
      // Startup-uri cu care investitorul NU are încă o relație deschisă.
      prisma.startupProfile.findMany({
        where: {
          companyName: { not: null },
          investmentInterests: {
            none: {
              investorProfileId,
              status: { in: ["PENDING", "ACCEPTED"] },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: 3,
        select: {
          id: true,
          companyName: true,
          oneLiner: true,
          fundingStage: true,
          industries: true,
        },
      }),
    ]);

  // ── KPI ──
  let totalInvestedUsd = 0;
  let investedThisMonthUsd = 0;
  for (const inv of investments) {
    const amount = Number(inv.amountUsd);
    totalInvestedUsd += amount;
    if (inv.investedAt >= startOfMonth) investedThisMonthUsd += amount;
  }

  // ── Capital desfășurat pe luni (ultimele 12) ──
  const byMonth = new Map<string, number>();
  for (const inv of investments) {
    const k = monthKey(inv.investedAt);
    byMonth.set(k, (byMonth.get(k) ?? 0) + Number(inv.amountUsd));
  }
  const monthlyDeployed: MonthlyDeployedPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const k = monthKey(d);
    monthlyDeployed.push({
      month: k,
      label: monthLabel(k),
      totalUsd: byMonth.get(k) ?? 0,
    });
  }

  // ── Portofoliu: agregat pe startup ──
  const byStartup = new Map<
    string,
    {
      companyName: string;
      totalUsd: number;
      equitySum: number;
      hasEquity: boolean;
      lastAt: Date;
    }
  >();

  for (const inv of investments) {
    const cur = byStartup.get(inv.startupProfileId) ?? {
      companyName: inv.startupProfile.companyName ?? "Unnamed startup",
      totalUsd: 0,
      equitySum: 0,
      hasEquity: false,
      lastAt: inv.investedAt,
    };
    cur.totalUsd += Number(inv.amountUsd);
    if (inv.equityPercent != null) {
      cur.equitySum += Number(inv.equityPercent);
      cur.hasEquity = true;
    }
    if (inv.investedAt > cur.lastAt) cur.lastAt = inv.investedAt;
    byStartup.set(inv.startupProfileId, cur);
  }

  const portfolio: PortfolioRow[] = Array.from(byStartup.entries())
    .map(([id, v]) => ({
      startupProfileId: id,
      companyName: v.companyName,
      totalInvestedUsd: v.totalUsd,
      equityPercent: v.hasEquity ? Math.round(v.equitySum * 100) / 100 : null,
      lastInvestedAt: v.lastAt.toISOString(),
    }))
    .sort((a, b) => b.totalInvestedUsd - a.totalInvestedUsd);

  const discoverStartups: DiscoverStartupRow[] = discoverRaw.map((s) => ({
    startupProfileId: s.id,
    companyName: s.companyName ?? "Unnamed startup",
    oneLiner: s.oneLiner,
    fundingStage: s.fundingStage,
    industries: s.industries.slice(0, 3),
  }));

  const fullName =
    [profile?.firstName?.trim(), profile?.lastName?.trim()]
      .filter(Boolean)
      .join(" ") || "Investor";

  return {
    userName: fullName,
    firstName: fullName.split(" ")[0] || "Investor",
    kpis: {
      totalInvestedUsd,
      investedThisMonthUsd,
      startupsBacked: byStartup.size,
      activeRelationships,
      incomingInterest,
    },
    monthlyDeployed,
    portfolio,
    discoverStartups,
  };
}
