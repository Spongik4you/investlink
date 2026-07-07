import { prisma } from "@/lib/prisma";

export type ExpertInvitationItem = {
  id: string;
  roleTitle: string;
  message: string | null;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "WITHDRAWN";
  createdAt: string;
  respondedAt: string | null;
  startup: {
    companyName: string;
    oneLiner: string | null;
    location: string | null;
  };
};

export type ExpertInvitationsData = {
  pending: ExpertInvitationItem[];
  responded: ExpertInvitationItem[];
  pendingCount: number;
};

function locationOf(country: string | null, city: string | null): string | null {
  const parts = [city?.trim(), country?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

/**
 * Invitațiile primite de un expert, cu datele startup-ului care le-a trimis.
 *
 * expertProfileId vine ÎNTOTDEAUNA din sesiune (getCurrentExpertProfile),
 * niciodată din client — un expert vede doar invitațiile lui.
 */
export async function getExpertInvitations(
  expertProfileId: string,
): Promise<ExpertInvitationsData> {
  const invitations = await prisma.collaborationInvitation.findMany({
    where: { expertProfileId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      roleTitle: true,
      message: true,
      status: true,
      createdAt: true,
      respondedAt: true,
      startupProfile: {
        select: {
          companyName: true,
          oneLiner: true,
          country: true,
          city: true,
        },
      },
    },
  });

  const mapped: ExpertInvitationItem[] = invitations.map((inv) => ({
    id: inv.id,
    roleTitle: inv.roleTitle,
    message: inv.message,
    status: inv.status,
    createdAt: inv.createdAt.toISOString(),
    respondedAt: inv.respondedAt?.toISOString() ?? null,
    startup: {
      companyName: inv.startupProfile.companyName ?? "Unnamed startup",
      oneLiner: inv.startupProfile.oneLiner,
      location: locationOf(
        inv.startupProfile.country,
        inv.startupProfile.city,
      ),
    },
  }));

  const pending = mapped.filter((i) => i.status === "PENDING");
  const responded = mapped.filter((i) => i.status !== "PENDING");

  return {
    pending,
    responded,
    pendingCount: pending.length,
  };
}
