import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentStartupProfile } from "@/lib/dashboard/get-current-startup";

const updateSchema = z.object({
  investorProfileId: z.string().min(1).nullable().optional(),
  investorName: z.string().trim().min(2).max(160).optional(),
  amountUsd: z.number().positive().max(1_000_000_000_000).optional(),
  round: z.string().trim().max(60).nullable().optional(),
  equityPercent: z.number().min(0).max(100).nullable().optional(),
  investedAt: z.string().min(1).optional(),
  note: z.string().trim().max(1000).nullable().optional(),
});

/** Helper: găsește investiția DOAR dacă aparține startup-ului curent (anti-IDOR). */
async function findOwned(startupProfileId: string, investmentId: string) {
  return prisma.investment.findFirst({
    where: { id: investmentId, startupProfileId },
    select: { id: true },
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const startup = await getCurrentStartupProfile();
  if (!startup) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 403 });
  }

  const owned = await findOwned(startup.startupProfileId, id);
  if (!owned) {
    return NextResponse.json(
      { error: "Investiția nu a fost găsită." },
      { status: 404 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body invalid." }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Date invalide.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const d = parsed.data;

  // Dacă se schimbă legătura la un investitor de platformă, re-verifică relația.
  if (d.investorProfileId) {
    const relation = await prisma.investmentInterest.findFirst({
      where: {
        startupProfileId: startup.startupProfileId,
        investorProfileId: d.investorProfileId,
        status: "ACCEPTED",
      },
      select: { id: true },
    });
    if (!relation) {
      return NextResponse.json(
        {
          error:
            "Poți lega o investiție doar de un investitor cu care ai o relație acceptată.",
        },
        { status: 403 },
      );
    }
  }

  const data: Record<string, unknown> = {};
  if (d.investorProfileId !== undefined) data.investorProfileId = d.investorProfileId;
  if (d.investorName !== undefined) data.investorName = d.investorName;
  if (d.amountUsd !== undefined) data.amountUsd = d.amountUsd;
  if (d.round !== undefined) data.round = d.round;
  if (d.equityPercent !== undefined) data.equityPercent = d.equityPercent;
  if (d.note !== undefined) data.note = d.note;
  if (d.investedAt !== undefined) {
    const dt = new Date(d.investedAt);
    if (Number.isNaN(dt.getTime())) {
      return NextResponse.json({ error: "Dată invalidă." }, { status: 400 });
    }
    data.investedAt = dt;
  }

  await prisma.investment.update({ where: { id }, data });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const startup = await getCurrentStartupProfile();
  if (!startup) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 403 });
  }

  const owned = await findOwned(startup.startupProfileId, id);
  if (!owned) {
    return NextResponse.json(
      { error: "Investiția nu a fost găsită." },
      { status: 404 },
    );
  }

  await prisma.investment.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
