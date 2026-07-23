import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentExpertProfile } from "@/lib/dashboard/get-current-expert";
import { getCurrentStartupProfile } from "@/lib/dashboard/get-current-startup";
import { notifyCollaborationRequestAnswered } from "@/lib/notifications/notify";

const respondSchema = z.object({
  action: z.enum(["accept", "decline"]),
});

/**
 * Răspuns la o cerere de colaborare (accept/decline). BIDIRECȚIONAL:
 *  - dacă cererea a fost inițiată de STARTUP (invitație) → răspunde EXPERTUL
 *  - dacă a fost inițiată de EXPERT (aplicație) → răspunde STARTUP-ul
 *
 * Regula: răspunde partea OPUSĂ lui initiatedBy. Autorizăm apelantul în
 * funcție de asta, cu verificare de proprietate (anti-IDOR) pe câmpul potrivit.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: invitationId } = await params;

  // 1. Cine e apelantul?
  const [expert, startup] = await Promise.all([
    getCurrentExpertProfile(),
    getCurrentStartupProfile(),
  ]);

  if (!expert && !startup) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 403 });
  }

  // 2. Validare payload.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body invalid." }, { status: 400 });
  }

  const parsed = respondSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Acțiune invalidă." }, { status: 400 });
  }

  const { action } = parsed.data;

  // 3. Găsește cererea, filtrată pe proprietatea apelantului (anti-IDOR).
  //    Un expert vede doar cereri unde el e expertProfileId; un startup doar
  //    unde el e startupProfileId. Dacă apelantul e ambele (imposibil normal,
  //    dar defensiv), preferăm potrivirea care există.
  const ownershipOr: Array<Record<string, string>> = [];
  if (expert) ownershipOr.push({ expertProfileId: expert.expertProfileId });
  if (startup) ownershipOr.push({ startupProfileId: startup.startupProfileId });

  const invitation = await prisma.collaborationInvitation.findFirst({
    where: { id: invitationId, OR: ownershipOr },
    select: {
      id: true,
      status: true,
      roleTitle: true,
      startupProfileId: true,
      expertProfileId: true,
      initiatedBy: true,
    },
  });

  if (!invitation) {
    return NextResponse.json(
      { error: "Cererea nu a fost găsită." },
      { status: 404 },
    );
  }

  // 4. Verificare de direcție: răspunde DOAR partea opusă lui initiatedBy.
  //    Inițiatorul nu-și poate accepta/refuza propria cerere (el o retrage).
  const responderIsExpert = invitation.initiatedBy === "STARTUP";
  const callerIsResponder = responderIsExpert
    ? expert?.expertProfileId === invitation.expertProfileId
    : startup?.startupProfileId === invitation.startupProfileId;

  if (!callerIsResponder) {
    return NextResponse.json(
      { error: "Nu poți răspunde la propria cerere. O poți retrage." },
      { status: 403 },
    );
  }

  // 5. Nu se poate răspunde de două ori.
  if (invitation.status !== "PENDING") {
    return NextResponse.json(
      { error: `Cererea a fost deja ${invitation.status.toLowerCase()}.` },
      { status: 409 },
    );
  }

  // 6. DECLINE: o singură scriere.
  if (action === "decline") {
    await prisma.$transaction(async (tx) => {
      await tx.collaborationInvitation.update({
        where: { id: invitation.id },
        data: { status: "DECLINED", respondedAt: new Date() },
      });
      await notifyCollaborationRequestAnswered(tx, invitation.id, "decline");
    });
    return NextResponse.json({ ok: true, status: "DECLINED" });
  }

  // 7. ACCEPT: atomic — marchează ACCEPTED + creează colaborarea legată.
  //    Identic indiferent de cine a inițiat: colaborarea rezultată e aceeași.
  const collaboration = await prisma.$transaction(async (tx) => {
    await tx.collaborationInvitation.update({
      where: { id: invitation.id },
      data: { status: "ACCEPTED", respondedAt: new Date() },
    });

    const expertProfile = await tx.expertProfile.findUnique({
      where: { id: invitation.expertProfileId },
      select: { firstName: true, lastName: true },
    });

    const displayName =
      [expertProfile?.firstName?.trim(), expertProfile?.lastName?.trim()]
        .filter(Boolean)
        .join(" ") || "Expert";

    const created = await tx.startupExpertCollaboration.create({
      data: {
        startupProfileId: invitation.startupProfileId,
        expertProfileId: invitation.expertProfileId,
        displayName,
        roleTitle: invitation.roleTitle,
        status: "ACTIVE",
        startedAt: new Date(),
      },
      select: { id: true },
    });

    await notifyCollaborationRequestAnswered(tx, invitation.id, "accept");

    return created;
  });

  return NextResponse.json({
    ok: true,
    status: "ACCEPTED",
    collaborationId: collaboration.id,
  });
}
