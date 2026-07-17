import { prisma } from "@/lib/prisma";

export type StartupDirectoryCard = {
  startupProfileId: string;
  companyName: string;
  oneLiner: string | null;
  location: string | null;
  industries: string[];
  companyStage: string | null;
  fundingStage: string | null;
  expertNeeds: string[];
  /** true dacă există DEJA o cerere PENDING între expert și acest startup
   *  (în ORICE direcție) — blocare strictă: expertul nu poate aplica. */
  hasPendingRequest: boolean;
};

export type StartupDirectoryFilters = {
  search?: string;
  stage?: string;
};

function locationOf(country: string | null, city: string | null): string | null {
  const parts = [city?.trim(), country?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

/**
 * Startup-urile pe care le vede un expert care caută de lucru, marcând care
 * au deja o cerere PENDING cu acest expert (în orice direcție) — ca UI-ul să
 * dezactiveze butonul "Apply".
 *
 * expertProfileId vine din sesiune (getCurrentExpertProfile), nu din client.
 */
export async function getStartupDirectory(
  expertProfileId: string,
  filters: StartupDirectoryFilters = {},
): Promise<StartupDirectoryCard[]> {
  const and: Array<Record<string, unknown>> = [
    // Doar startup-uri cu profil minim completat (au nume).
    { companyName: { not: null } },
  ];

  if (filters.search?.trim()) {
    const q = filters.search.trim();
    and.push({
      OR: [
        { companyName: { contains: q, mode: "insensitive" } },
        { oneLiner: { contains: q, mode: "insensitive" } },
        { industries: { has: q } },
        { expertNeeds: { has: q } },
      ],
    });
  }

  if (filters.stage?.trim()) {
    and.push({ fundingStage: filters.stage.trim() });
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
      expertNeeds: true,
      sentInvitations: {
        where: { expertProfileId, status: "PENDING" },
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
    expertNeeds: s.expertNeeds.slice(0, 6),
    hasPendingRequest: s.sentInvitations.length > 0,
  }));
}

/** Etapele de finanțare distincte, pentru dropdown-ul de filtru. */
export async function getStartupFundingStages(): Promise<string[]> {
  const rows = await prisma.startupProfile.findMany({
    where: { fundingStage: { not: null } },
    select: { fundingStage: true },
    distinct: ["fundingStage"],
    orderBy: { fundingStage: "asc" },
  });

  return rows
    .map((r) => r.fundingStage)
    .filter((s): s is string => !!s);
}
