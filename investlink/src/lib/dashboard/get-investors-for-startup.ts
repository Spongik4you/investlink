import { prisma } from "@/lib/prisma";

export type InvestorForStartupCard = {
  investorProfileId: string;
  name: string;
  title: string | null;
  investorType: string | null;
  location: string | null;
  sectors: string[];
  stages: string[];
  ticketMinUsd: number | null;
  ticketMaxUsd: number | null;
  hasPendingInterest: boolean;
};

export type InvestorForStartupFilters = {
  search?: string;
  investorType?: string;
  sector?: string;
};

function nameFrom(first?: string | null, last?: string | null): string {
  return [first?.trim(), last?.trim()].filter(Boolean).join(" ") || "Investor";
}

function locationOf(country: string | null, city: string | null): string | null {
  const parts = [city?.trim(), country?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

/**
 * Investitorii pe care îi vede un startup care caută capital, marcând care au
 * deja un interes activ (PENDING sau ACCEPTED) cu acest startup — blocare
 * strictă bidirecțională (consistent cu B1.5).
 *
 * startupProfileId vine din sesiune (getCurrentStartupProfile), nu din client.
 */
export async function getInvestorsForStartup(
  startupProfileId: string,
  filters: InvestorForStartupFilters = {},
): Promise<InvestorForStartupCard[]> {
  const and: Array<Record<string, unknown>> = [
    // Doar investitori cu profil minim (au nume).
    { OR: [{ firstName: { not: null } }, { lastName: { not: null } }] },
  ];

  if (filters.search?.trim()) {
    const q = filters.search.trim();
    and.push({
      OR: [
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
        { professionalTitle: { contains: q, mode: "insensitive" } },
        { sectors: { has: q } },
      ],
    });
  }

  if (filters.investorType?.trim()) {
    and.push({ investorType: filters.investorType.trim() });
  }

  if (filters.sector?.trim()) {
    and.push({ sectors: { has: filters.sector.trim() } });
  }

  const investors = await prisma.investorProfile.findMany({
    where: { AND: and },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      professionalTitle: true,
      investorType: true,
      country: true,
      city: true,
      sectors: true,
      stages: true,
      ticketMinUsd: true,
      ticketMaxUsd: true,
      investmentInterests: {
        where: {
          startupProfileId,
          status: { in: ["PENDING", "ACCEPTED"] },
        },
        select: { id: true },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 60,
  });

  return investors.map((inv) => ({
    investorProfileId: inv.id,
    name: nameFrom(inv.firstName, inv.lastName),
    title: inv.professionalTitle,
    investorType: inv.investorType,
    location: locationOf(inv.country, inv.city),
    sectors: inv.sectors.slice(0, 4),
    stages: inv.stages.slice(0, 4),
    ticketMinUsd: inv.ticketMinUsd ?? null,
    ticketMaxUsd: inv.ticketMaxUsd ?? null,
    hasPendingInterest: inv.investmentInterests.length > 0,
  }));
}

/** Tipurile de investitor distincte, pentru filtru. */
export async function getInvestorTypes(): Promise<string[]> {
  const rows = await prisma.investorProfile.findMany({
    where: { investorType: { not: null } },
    select: { investorType: true },
    distinct: ["investorType"],
    orderBy: { investorType: "asc" },
  });
  return rows.map((r) => r.investorType).filter((t): t is string => !!t);
}
