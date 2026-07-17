import { prisma } from "@/lib/prisma";

export type StartupApplicationItem = {
  id: string;
  roleTitle: string;
  message: string | null;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "WITHDRAWN";
  createdAt: string;
  expert: {
    name: string;
    title: string | null;
    primaryCategory: string | null;
    skills: string[];
    location: string | null;
  };
};

export type StartupApplicationsData = {
  pending: StartupApplicationItem[];
  responded: StartupApplicationItem[];
  pendingCount: number;
};

function nameFrom(first?: string | null, last?: string | null): string {
  const joined = [first?.trim(), last?.trim()].filter(Boolean).join(" ");
  return joined || "Expert";
}

function locationOf(country: string | null, city: string | null): string | null {
  const parts = [city?.trim(), country?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

/**
 * Aplicațiile primite de un startup — cereri inițiate de experți
 * (initiatedBy = EXPERT). La acestea startup-ul RĂSPUNDE.
 *
 * startupProfileId din sesiune (getCurrentStartupProfile), nu din client.
 */
export async function getStartupApplications(
  startupProfileId: string,
): Promise<StartupApplicationsData> {
  const applications = await prisma.collaborationInvitation.findMany({
    where: { startupProfileId, initiatedBy: "EXPERT" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      roleTitle: true,
      message: true,
      status: true,
      createdAt: true,
      expertProfile: {
        select: {
          firstName: true,
          lastName: true,
          title: true,
          primaryCategory: true,
          skills: true,
          country: true,
          city: true,
        },
      },
    },
  });

  const mapped: StartupApplicationItem[] = applications.map((a) => ({
    id: a.id,
    roleTitle: a.roleTitle,
    message: a.message,
    status: a.status,
    createdAt: a.createdAt.toISOString(),
    expert: {
      name: nameFrom(a.expertProfile.firstName, a.expertProfile.lastName),
      title: a.expertProfile.title,
      primaryCategory: a.expertProfile.primaryCategory,
      skills: a.expertProfile.skills.slice(0, 4),
      location: locationOf(a.expertProfile.country, a.expertProfile.city),
    },
  }));

  const pending = mapped.filter((a) => a.status === "PENDING");
  const responded = mapped.filter((a) => a.status !== "PENDING");

  return { pending, responded, pendingCount: pending.length };
}
