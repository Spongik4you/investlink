import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentStartupProfile } from "@/lib/dashboard/get-current-startup";
import { getCurrentExpertProfile } from "@/lib/dashboard/get-current-expert";
import { notifyCollaborationEnded } from "@/lib/notifications/notify";

const endSchema = z.object({
  outcome: z.enum(["completed", "cancelled"]),
  reason: z.string().trim().max(500).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().trim().max(1000).optional(),
});

const LIVE_STATUSES = ["ACTIVE", "BUSY", "PAUSED"] as const;

/**
 * Terminarea unei colaborări ACTIVE. Act UNILATERAL — oricare parte poate
 * termina fără acordul celeilalte (o colaborare din care nu poți ieși e o
 * captivitate, nu o colaborare).
 *
 * Un singur endpoint, dar cu autorizare DUALĂ: determinăm dacă apelantul e
 * startup-ul SAU expertul acestei colaborări, și în ambele cazuri verificăm
 * proprietatea (anti-IDOR). Rating-ul e opțional și se scrie pe câmpul părții
 * care termină (startupRating dacă startup-ul termină, expertRating dacă expertul).
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: collaborationId } = await params;

  // 1. Cine e apelantul — startup sau expert? (una dintre ele va fi null)
  const [startup, expert] = await Promise.all([
    getCurrentStartupProfile(),
    getCurrentExpertProfile(),
  ]);

  if (!startup && !expert) {
    return NextResponse.json(
      { error: "Neautorizat." },
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

  const parsed = endSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Date invalide.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { outcome, reason, rating, comment } = parsed.data;

  // 3. Colaborarea există ȘI aparține apelantului.
  //    Construim filtrul în funcție de rol — anti-IDOR: un startup nu poate
  //    termina colaborarea altuia, un expert la fel.
  const ownershipFilter = startup
    ? { startupProfileId: startup.startupProfileId }
    : { expertProfileId: expert!.expertProfileId };

  const collaboration = await prisma.startupExpertCollaboration.findFirst({
    where: { id: collaborationId, ...ownershipFilter },
    select: { id: true, status: true },
  });

  if (!collaboration) {
    return NextResponse.json(
      { error: "Colaborarea nu a fost găsită." },
      { status: 404 },
    );
  }

  // 4. Se poate termina DOAR o colaborare vie.
  if (!LIVE_STATUSES.includes(collaboration.status as (typeof LIVE_STATUSES)[number])) {
    return NextResponse.json(
      {
        error: `Colaborarea nu mai e activă (status: ${collaboration.status.toLowerCase()}).`,
      },
      { status: 409 },
    );
  }

  // 5. Cine termină + pe ce câmp de rating scriem.
  const endedBy = startup ? "STARTUP" : "EXPERT";
  const ratingFields = startup
    ? { startupRating: rating ?? null, startupComment: comment || null }
    : { expertRating: rating ?? null, expertComment: comment || null };

  // Notificarea citește endedBy, deci se creează DUPĂ update, în aceeași
  // tranzacție — cealaltă parte află că relația s-a încheiat.
  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.startupExpertCollaboration.update({
      where: { id: collaboration.id },
      data: {
        status: outcome === "completed" ? "COMPLETED" : "CANCELLED",
        endedBy,
        endReason: reason || null,
        endedAt: new Date(),
        ...ratingFields,
      },
      select: { id: true, status: true },
    });

    await notifyCollaborationEnded(tx, collaboration.id);

    return result;
  });

  return NextResponse.json({ ok: true, status: updated.status });
}
