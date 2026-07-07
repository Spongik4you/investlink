import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentStartupProfile } from "@/lib/dashboard/get-current-startup";

const inviteSchema = z.object({
  expertProfileId: z.string().min(1),
  roleTitle: z.string().trim().min(2).max(120),
  message: z.string().trim().max(1000).optional(),
});

export async function POST(req: Request) {
  // 1. Autorizare: startup-ul curent, derivat din sesiune (nu din body).
  const startup = await getCurrentStartupProfile();
  if (!startup) {
    return NextResponse.json(
      { error: "Doar conturile de startup pot trimite invitații." },
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

  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Date invalide.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { expertProfileId, roleTitle, message } = parsed.data;

  // 3. Expertul țintă există?
  const expert = await prisma.expertProfile.findUnique({
    where: { id: expertProfileId },
    select: { id: true },
  });
  if (!expert) {
    return NextResponse.json(
      { error: "Expertul nu a fost găsit." },
      { status: 404 },
    );
  }

  // 4. Nu permite o invitație nouă dacă între acest startup și acest expert
  //    există deja: (a) o invitație PENDING, sau (b) o colaborare "vie"
  //    (ACTIVE / BUSY / PAUSED). Reinvitarea e permisă doar după DECLINED/
  //    WITHDRAWN sau după ce colaborarea s-a încheiat (COMPLETED / CANCELLED).
  //    Ambele reguli sunt apărate și de partial unique index-uri la nivel de DB
  //    (vezi migrarea 4.5) — verificarea de aici e pentru un mesaj clar.
  const [pendingInvite, liveCollaboration] = await Promise.all([
    prisma.collaborationInvitation.findFirst({
      where: {
        startupProfileId: startup.startupProfileId,
        expertProfileId,
        status: "PENDING",
      },
      select: { id: true },
    }),
    prisma.startupExpertCollaboration.findFirst({
      where: {
        startupProfileId: startup.startupProfileId,
        expertProfileId,
        status: { in: ["ACTIVE", "BUSY", "PAUSED"] },
      },
      select: { id: true },
    }),
  ]);

  if (pendingInvite) {
    return NextResponse.json(
      { error: "Ai deja o invitație în așteptare pentru acest expert." },
      { status: 409 },
    );
  }

  if (liveCollaboration) {
    return NextResponse.json(
      {
        error:
          "Colaborezi deja cu acest expert. Poți reinvita după încheierea colaborării.",
      },
      { status: 409 },
    );
  }

  // 5. Creează invitația.
  const invitation = await prisma.collaborationInvitation.create({
    data: {
      startupProfileId: startup.startupProfileId,
      expertProfileId,
      roleTitle,
      message: message || null,
      status: "PENDING",
    },
    select: { id: true, status: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, invitation }, { status: 201 });
}
