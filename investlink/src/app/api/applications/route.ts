import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentExpertProfile } from "@/lib/dashboard/get-current-expert";

const applySchema = z.object({
  startupProfileId: z.string().min(1),
  roleTitle: z.string().trim().min(2).max(120),
  message: z.string().trim().max(1000).optional(),
});

/**
 * Aplicarea unui expert la un startup — expertul se propune la un rol.
 * Creează un CollaborationInvitation cu initiatedBy = EXPERT.
 * La ACEASTĂ cerere răspunde STARTUP-ul (partea opusă lui initiatedBy).
 *
 * Blocare strictă bidirecțională: dacă există DEJA o cerere PENDING între
 * această pereche (în orice direcție), aplicarea e respinsă. Impusă și de
 * partial unique index-ul din 4.5 la nivel de DB — verificăm aici pentru
 * mesaj clar în loc de eroare de constraint.
 */
export async function POST(req: Request) {
  const expert = await getCurrentExpertProfile();
  if (!expert) {
    return NextResponse.json(
      { error: "Doar conturile de expert pot aplica la startup-uri." },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body invalid." }, { status: 400 });
  }

  const parsed = applySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Date invalide.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { startupProfileId, roleTitle, message } = parsed.data;

  // Startup-ul țintă există?
  const startup = await prisma.startupProfile.findUnique({
    where: { id: startupProfileId },
    select: { id: true },
  });
  if (!startup) {
    return NextResponse.json(
      { error: "Startup-ul nu a fost găsit." },
      { status: 404 },
    );
  }

  // Blocare strictă: orice cerere PENDING pe pereche, indiferent de direcție.
  const existing = await prisma.collaborationInvitation.findFirst({
    where: {
      startupProfileId,
      expertProfileId: expert.expertProfileId,
      status: "PENDING",
    },
    select: { id: true, initiatedBy: true },
  });
  if (existing) {
    const msg =
      existing.initiatedBy === "EXPERT"
        ? "Ai deja o aplicație în așteptare la acest startup."
        : "Acest startup ți-a trimis deja o invitație în așteptare — răspunde-i din Opportunities.";
    return NextResponse.json({ error: msg }, { status: 409 });
  }

  const application = await prisma.collaborationInvitation.create({
    data: {
      startupProfileId,
      expertProfileId: expert.expertProfileId,
      roleTitle,
      message: message || null,
      initiatedBy: "EXPERT",
      status: "PENDING",
    },
    select: { id: true, status: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, application }, { status: 201 });
}
