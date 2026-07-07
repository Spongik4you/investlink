import { prisma } from "@/lib/prisma";

export type StartupCollaborationItem = {
  id: string;
  expertName: string;
  roleTitle: string;
  status: "ACTIVE" | "BUSY" | "PAUSED" | "COMPLETED" | "CANCELLED";
  currentProjectTitle: string | null;
  workloadPercent: number | null;
  hourlyRateUsd: number | null;
  startedAt: string | null;
  /** true dacă expertul e pe platformă (are profil), false dacă e extern/manual */
  onPlatform: boolean;
};

export type StartupSentInvitationItem = {
  id: string;
  expertName: string;
  roleTitle: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "WITHDRAWN";
  createdAt: string;
  respondedAt: string | null;
};

export type StartupCollaborationsData = {
  active: StartupCollaborationItem[];
  sentInvitations: StartupSentInvitationItem[];
  activeCount: number;
  pendingSentCount: number;
};

function nameFrom(
  first?: string | null,
  last?: string | null,
  fallback?: string,
): string {
  const joined = [first?.trim(), last?.trim()].filter(Boolean).join(" ");
  return joined || fallback || "Expert";
}

const LIVE_STATUSES = ["ACTIVE", "BUSY", "PAUSED"] as const;

/**
 * Vederea startup-ului asupra ecosistemului lui de experți:
 *  - active: colaborările vii (ACTIVE/BUSY/PAUSED)
 *  - sentInvitations: invitațiile trimise, cu statusul lor (simetric cu
 *    inbox-ul expertului de la pasul 4)
 *
 * startupProfileId vine ÎNTOTDEAUNA din sesiune (getCurrentStartupProfile).
 */
export async function getStartupCollaborations(
  startupProfileId: string,
): Promise<StartupCollaborationsData> {
  const [collaborations, invitations] = await Promise.all([
    prisma.startupExpertCollaboration.findMany({
      where: {
        startupProfileId,
        status: { in: [...LIVE_STATUSES] },
      },
      orderBy: { startedAt: "desc" },
      select: {
        id: true,
        displayName: true,
        roleTitle: true,
        status: true,
        currentProjectTitle: true,
        workloadPercent: true,
        hourlyRate: true,
        startedAt: true,
        expertProfileId: true,
        expertProfile: {
          select: { firstName: true, lastName: true },
        },
      },
    }),
    prisma.collaborationInvitation.findMany({
      where: { startupProfileId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        roleTitle: true,
        status: true,
        createdAt: true,
        respondedAt: true,
        expertProfile: {
          select: { firstName: true, lastName: true },
        },
      },
    }),
  ]);

  const active: StartupCollaborationItem[] = collaborations.map((c) => ({
    id: c.id,
    // Preferă numele din profilul real; cade pe displayName pentru experți
    // externi (fără profil pe platformă).
    expertName: c.expertProfile
      ? nameFrom(c.expertProfile.firstName, c.expertProfile.lastName, c.displayName)
      : c.displayName,
    roleTitle: c.roleTitle,
    status: c.status,
    currentProjectTitle: c.currentProjectTitle,
    workloadPercent: c.workloadPercent,
    hourlyRateUsd: c.hourlyRate ? Number(c.hourlyRate) : null,
    startedAt: c.startedAt?.toISOString() ?? null,
    onPlatform: c.expertProfileId != null,
  }));

  const sentInvitations: StartupSentInvitationItem[] = invitations.map(
    (inv) => ({
      id: inv.id,
      expertName: nameFrom(
        inv.expertProfile.firstName,
        inv.expertProfile.lastName,
      ),
      roleTitle: inv.roleTitle,
      status: inv.status,
      createdAt: inv.createdAt.toISOString(),
      respondedAt: inv.respondedAt?.toISOString() ?? null,
    }),
  );

  return {
    active,
    sentInvitations,
    activeCount: active.length,
    pendingSentCount: sentInvitations.filter((i) => i.status === "PENDING")
      .length,
  };
}
