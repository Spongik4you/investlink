import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type ExpertDirectoryFilters = {
  search?: string;
  category?: string;
  availability?: string;
  maxRate?: number;
};

export type ExpertDirectoryCard = {
  expertProfileId: string;
  fullName: string;
  initials: string;
  title: string | null;
  primaryCategory: string | null;
  skills: string[];
  hourlyRateUsd: number | null;
  availability: string | null;
  yearsExperience: number | null;
  /** true dacă startup-ul curent are deja o invitație PENDING către acest expert */
  invitationPending: boolean;
};

function initialsFrom(first?: string | null, last?: string | null): string {
  const f = first?.trim()?.[0] ?? "";
  const l = last?.trim()?.[0] ?? "";
  const combined = `${f}${l}`.toUpperCase();
  return combined || "EX";
}

/**
 * Returnează experții pentru directorul startup-ului, aplicând filtrele,
 * și marcând care au deja o invitație PENDING din partea acestui startup
 * (ca UI-ul să dezactiveze butonul "Invite" pentru ei).
 *
 * NOTĂ de securitate: startupProfileId vine ÎNTOTDEAUNA din sesiune, calculat
 * de caller — niciodată din input-ul clientului. Vezi page.tsx.
 */
export async function getExpertDirectory(
  startupProfileId: string,
  filters: ExpertDirectoryFilters = {},
): Promise<ExpertDirectoryCard[]> {
  const where: Prisma.ExpertProfileWhereInput = {};
  const and: Prisma.ExpertProfileWhereInput[] = [];

  if (filters.search?.trim()) {
    const q = filters.search.trim();
    and.push({
      OR: [
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
        { title: { contains: q, mode: "insensitive" } },
        { skills: { has: q } },
      ],
    });
  }

  if (filters.category?.trim()) {
    and.push({ primaryCategory: filters.category.trim() });
  }

  if (filters.availability?.trim()) {
    and.push({ availability: filters.availability.trim() });
  }

  if (typeof filters.maxRate === "number" && !Number.isNaN(filters.maxRate)) {
    and.push({ hourlyRateUsd: { lte: filters.maxRate } });
  }

  if (and.length > 0) {
    where.AND = and;
  }

  const experts = await prisma.expertProfile.findMany({
    where,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      title: true,
      primaryCategory: true,
      skills: true,
      hourlyRateUsd: true,
      availability: true,
      yearsExperience: true,
      receivedInvitations: {
        where: { startupProfileId, status: "PENDING" },
        select: { id: true },
      },
    },
    orderBy: [{ yearsExperience: "desc" }, { createdAt: "desc" }],
    take: 60,
  });

  return experts.map((e) => {
    const fullName =
      [e.firstName?.trim(), e.lastName?.trim()].filter(Boolean).join(" ") ||
      "Unnamed Expert";

    return {
      expertProfileId: e.id,
      fullName,
      initials: initialsFrom(e.firstName, e.lastName),
      title: e.title,
      primaryCategory: e.primaryCategory,
      skills: e.skills.slice(0, 4),
      hourlyRateUsd: e.hourlyRateUsd,
      availability: e.availability,
      yearsExperience: e.yearsExperience,
      invitationPending: e.receivedInvitations.length > 0,
    };
  });
}

/** Categoriile distincte prezente în DB, pentru dropdown-ul de filtru. */
export async function getExpertCategories(): Promise<string[]> {
  const rows = await prisma.expertProfile.findMany({
    where: { primaryCategory: { not: null } },
    select: { primaryCategory: true },
    distinct: ["primaryCategory"],
    orderBy: { primaryCategory: "asc" },
  });

  return rows
    .map((r) => r.primaryCategory)
    .filter((c): c is string => !!c);
}
