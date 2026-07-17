import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentStartupProfile } from "@/lib/dashboard/get-current-startup";
import { getCurrentExpertProfile } from "@/lib/dashboard/get-current-expert";

/**
 * WITHDRAW: INIȚIATORUL retrage propria cerere PENDING înainte de răspuns.
 * BIDIRECȚIONAL:
 *  - startup retrage o invitație pe care el a inițiat-o (initiatedBy STARTUP)
 *  - expert retrage o aplicație pe care el a inițiat-o (initiatedBy EXPERT)
 *
 * Doar inițiatorul poate retrage. Partea care răspunde nu retrage — ea face
 * decline (alt endpoint). Verificare de proprietate + direcție (anti-IDOR).
 */
export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: invitationId } = await params;

  const [startup, expert] = await Promise.all([
    getCurrentStartupProfile(),
    getCurrentExpertProfile(),
  ]);

  if (!startup && !expert) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 403 });
  }

  const ownershipOr: Array<Record<string, string>> = [];
  if (startup) ownershipOr.push({ startupProfileId: startup.startupProfileId });
  if (expert) ownershipOr.push({ expertProfileId: expert.expertProfileId });

  const invitation = await prisma.collaborationInvitation.findFirst({
    where: { id: invitationId, OR: ownershipOr },
    select: {
      id: true,
      status: true,
      initiatedBy: true,
      startupProfileId: true,
      expertProfileId: true,
    },
  });

  if (!invitation) {
    return NextResponse.json(
      { error: "Cererea nu a fost găsită." },
      { status: 404 },
    );
  }

  // Doar INIȚIATORUL retrage: partea care a inițiat trebuie să fie apelantul.
  const callerIsInitiator =
    invitation.initiatedBy === "STARTUP"
      ? startup?.startupProfileId === invitation.startupProfileId
      : expert?.expertProfileId === invitation.expertProfileId;

  if (!callerIsInitiator) {
    return NextResponse.json(
      { error: "Doar cel care a trimis cererea o poate retrage." },
      { status: 403 },
    );
  }

  if (invitation.status !== "PENDING") {
    return NextResponse.json(
      {
        error: `Cererea nu mai poate fi retrasă (status: ${invitation.status.toLowerCase()}).`,
      },
      { status: 409 },
    );
  }

  await prisma.collaborationInvitation.update({
    where: { id: invitation.id },
    data: { status: "WITHDRAWN", respondedAt: new Date() },
  });

  return NextResponse.json({ ok: true, status: "WITHDRAWN" });
}
