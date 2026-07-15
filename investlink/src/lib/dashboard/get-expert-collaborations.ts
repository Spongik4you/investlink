import { prisma } from "@/lib/prisma";

export type ExpertCollaborationItem = {
  id: string;
  startupName: string;
  roleTitle: string;
  status: "ACTIVE" | "BUSY" | "PAUSED" | "COMPLETED" | "CANCELLED";
  currentProjectTitle: string | null;
  startedAt: string | null;
  endedAt: string | null;
  /** nota pe care ACEST expert a dat-o startup-ului (dacă a terminat el) */
  myRating: number | null;
};

export type ExpertCollaborationsData = {
  active: ExpertCollaborationItem[];
  past: ExpertCollaborationItem[];
  activeCount: number;
};

const LIVE_STATUSES = ["ACTIVE", "BUSY", "PAUSED"] as const;

/**
 * Colaborările unui expert, din perspectiva lui (vede startup-ul cu care
 * lucrează). Simetric cu getStartupCollaborations.
 *
 * expertProfileId vine ÎNTOTDEAUNA din sesiune (getCurrentExpertProfile).
 */
export async function getExpertCollaborations(
  expertProfileId: string,
): Promise<ExpertCollaborationsData> {
  const rows = await prisma.startupExpertCollaboration.findMany({
    where: { expertProfileId },
    orderBy: [{ status: "asc" }, { startedAt: "desc" }],
    select: {
      id: true,
      roleTitle: true,
      status: true,
      currentProjectTitle: true,
      startedAt: true,
      endedAt: true,
      expertRating: true,
      startupProfile: {
        select: { companyName: true },
      },
    },
  });

  const mapped: ExpertCollaborationItem[] = rows.map((c) => ({
    id: c.id,
    startupName: c.startupProfile.companyName ?? "Unnamed startup",
    roleTitle: c.roleTitle,
    status: c.status,
    currentProjectTitle: c.currentProjectTitle,
    startedAt: c.startedAt?.toISOString() ?? null,
    endedAt: c.endedAt?.toISOString() ?? null,
    myRating: c.expertRating,
  }));

  const isLive = (s: string) =>
    LIVE_STATUSES.includes(s as (typeof LIVE_STATUSES)[number]);

  return {
    active: mapped.filter((c) => isLive(c.status)),
    past: mapped.filter((c) => !isLive(c.status)),
    activeCount: mapped.filter((c) => isLive(c.status)).length,
  };
}
