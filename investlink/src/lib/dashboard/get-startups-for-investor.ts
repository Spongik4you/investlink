import { prisma } from "@/lib/prisma";

export type StartupForInvestorCard = {
  startupProfileId: string;
  companyName: string;
  oneLiner: string | null;
  location: string | null;
  industries: string[];
  companyStage: string | null;
  fundingStage: string | null;
  fundraisingGoalUsd: number | null;
  hasPendingInterest: boolean;
};

export type StartupForInvestorFilters = {
  search?: string;
  stage?: string;
  industry?: string;
};

function locationOf(country: string | null, city: string | null): string | null {
  const parts = [city?.trim(), country?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

/**
 * Startup-urile pe care le vede un investitor care caută deal-flow, marcând
 * care au deja un interes PENDING cu acest investitor (orice direcție).
 *
 * investorProfileId vine din sesiune (getCurrentInvestorProfile), nu din client.
 */
export async function getStartupsForInvestor(
  investorProfileId: string,
  filters: StartupForInvestorFilters = {},
): Promise<StartupForInvestorCard[]> {
  const and: Array<Record<string, unknown>> = [{ companyName: { not: null } }];

  if (filters.search?.trim()) {
    const q = filters.search.trim();
    and.push({
      OR: [
        { companyName: { contains: q, mode: "insensitive" } },
        { oneLiner: { contains: q, mode: "insensitive" } },
        { industries: { has: q } },
      ],
    });
  }

  if (filters.stage?.trim()) {
    and.push({ fundingStage: filters.stage.trim() });
  }

  if (filters.industry?.trim()) {
    and.push({ industries: { has: filters.industry.trim() } });
  }

  const startups = await prisma.startupProfile.findMany({
    where: { AND: and },
    select: {
      id: true,
      companyName: true,
      oneLiner: true,
      country: true,
      city: true,
      industries: true,
      companyStage: true,
      fundingStage: true,
      fundraisingGoalUsd: true,
      investmentInterests: {
        where: { investorProfileId, status: "PENDING" },
        select: { id: true },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 60,
  });

  return startups.map((s) => ({
    startupProfileId: s.id,
    companyName: s.companyName ?? "Unnamed startup",
    oneLiner: s.oneLiner,
    location: locationOf(s.country, s.city),
    industries: s.industries.slice(0, 4),
    companyStage: s.companyStage,
    fundingStage: s.fundingStage,
    fundraisingGoalUsd: s.fundraisingGoalUsd ?? null,
    hasPendingInterest: s.investmentInterests.length > 0,
  }));
}

/** Etapele de finanțare distincte, pentru filtru. */
export async function getStartupFundingStagesForInvestor(): Promise<string[]> {
  const rows = await prisma.startupProfile.findMany({
    where: { fundingStage: { not: null } },
    select: { fundingStage: true },
    distinct: ["fundingStage"],
    orderBy: { fundingStage: "asc" },
  });

  return rows.map((r) => r.fundingStage).filter((s): s is string => !!s);
}
