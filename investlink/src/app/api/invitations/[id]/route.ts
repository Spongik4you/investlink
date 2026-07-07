import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentExpertProfile } from "@/lib/dashboard/get-current-expert";

const respondSchema = z.object({
  action: z.enum(["accept", "decline"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: invitationId } = await params;

  // 1. Autorizare: expertul curent, din sesiune (nu din client).
  const expert = await getCurrentExpertProfile();
  if (!expert) {
    return NextResponse.json(
      { error: "Doar conturile de expert pot răspunde la invitații." },
      { status: 403 },
    );
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

  // 3. Invitația există ȘI aparține ACESTUI expert.
  //    Filtrul pe expertProfileId din sesiune e apărarea anti-IDOR: chiar dacă
  //    cineva ghicește un invitationId valid al altcuiva, findFirst întoarce
  //    null pentru că expertProfileId nu se potrivește.
  const invitation = await prisma.collaborationInvitation.findFirst({
    where: { id: invitationId, expertProfileId: expert.expertProfileId },
    select: {
      id: true,
      status: true,
      roleTitle: true,
      startupProfileId: true,
      expertProfileId: true,
    },
  });

  if (!invitation) {
    // 404, nu 403: nu confirmăm nici măcar existența invitației altcuiva.
    return NextResponse.json(
      { error: "Invitația nu a fost găsită." },
      { status: 404 },
    );
  }

  // 4. Nu se poate răspunde de două ori.
  if (invitation.status !== "PENDING") {
    return NextResponse.json(
      { error: `Invitația a fost deja ${invitation.status.toLowerCase()}.` },
      { status: 409 },
    );
  }

  // 5. DECLINE: o singură scriere, simplă.
  if (action === "decline") {
    await prisma.collaborationInvitation.update({
      where: { id: invitation.id },
      data: { status: "DECLINED", respondedAt: new Date() },
    });
    return NextResponse.json({ ok: true, status: "DECLINED" });
  }

  // 6. ACCEPT: două scrieri care trebuie să fie atomice —
  //    marchează invitația ACCEPTED + creează colaborarea legată.
  //    $transaction: ori ambele reușesc, ori niciuna. Fără asta, un eșec
  //    la a doua scriere ar lăsa o invitație ACCEPTED fără colaborare.
  //
  //    Notă de design: hourlyRate/workload/currentProject rămân null la naștere.
  //    Rate-ul negociat poate diferi de cel din profilul expertului; a-l copia
  //    automat ar fi o dată inventată. Se completează într-un pas ulterior.
  const collaboration = await prisma.$transaction(async (tx) => {
    await tx.collaborationInvitation.update({
      where: { id: invitation.id },
      data: { status: "ACCEPTED", respondedAt: new Date() },
    });

    // displayName pentru cazul în care expertul își șterge profilul mai târziu
    // (onDelete: SetNull pe expertProfileId lasă colaborarea cu un nume lizibil).
    const expertProfile = await tx.expertProfile.findUnique({
      where: { id: invitation.expertProfileId },
      select: { firstName: true, lastName: true },
    });

    const displayName =
      [expertProfile?.firstName?.trim(), expertProfile?.lastName?.trim()]
        .filter(Boolean)
        .join(" ") || "Expert";

    return tx.startupExpertCollaboration.create({
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
  });

  return NextResponse.json({
    ok: true,
    status: "ACCEPTED",
    collaborationId: collaboration.id,
  });
}
