import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentStartupProfile } from "@/lib/dashboard/get-current-startup";

/**
 * WITHDRAW: startup-ul retrage o invitație PENDING pe care a trimis-o, înainte
 * ca expertul să răspundă.
 *
 * Endpoint SEPARAT de /api/invitations/[id] (accept/decline) intenționat:
 * acolo actorul e expertul, aici e startup-ul. Autorizări și reguli anti-IDOR
 * diferite — a le amesteca într-un handler care ramifică pe rol e o sursă de
 * bug-uri de securitate. Un endpoint = un actor = o regulă.
 */
export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: invitationId } = await params;

  // 1. Autorizare: startup-ul curent, din sesiune.
  const startup = await getCurrentStartupProfile();
  if (!startup) {
    return NextResponse.json(
      { error: "Doar conturile de startup pot retrage invitații." },
      { status: 403 },
    );
  }

  // 2. Invitația există ȘI aparține ACESTUI startup.
  //    Filtrul pe startupProfileId din sesiune e apărarea anti-IDOR: un startup
  //    nu poate retrage invitația altui startup, chiar ghicind un id valid.
  const invitation = await prisma.collaborationInvitation.findFirst({
    where: { id: invitationId, startupProfileId: startup.startupProfileId },
    select: { id: true, status: true },
  });

  if (!invitation) {
    // 404, nu 403: nu confirmăm existența invitației altcuiva.
    return NextResponse.json(
      { error: "Invitația nu a fost găsită." },
      { status: 404 },
    );
  }

  // 3. Se poate retrage DOAR o invitație încă în așteptare.
  //    Dacă expertul a acceptat/refuzat deja, retragerea nu mai are sens —
  //    și ar crea inconsistență (o colaborare ACCEPTED cu invitație WITHDRAWN).
  if (invitation.status !== "PENDING") {
    return NextResponse.json(
      {
        error: `Invitația nu mai poate fi retrasă (status: ${invitation.status.toLowerCase()}).`,
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
