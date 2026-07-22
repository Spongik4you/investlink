import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentStartupProfile } from "@/lib/dashboard/get-current-startup";

const createSchema = z.object({
  investorProfileId: z.string().min(1).optional(),
  investorName: z.string().trim().min(2).max(160),
  amountUsd: z.number().positive().max(1_000_000_000_000),
  round: z.string().trim().max(60).optional(),
  equityPercent: z.number().min(0).max(100).optional(),
  investedAt: z.string().min(1), // ISO date
  note: z.string().trim().max(1000).optional(),
});

/**
 * Startup-ul înregistrează o investiție primită. Evidență manuală, deținută de
 * startup — NU procesare de bani.
 *
 * Securitate: dacă se leagă un investorProfileId, verificăm că startup-ul are
 * o relație ACCEPTED cu acel investitor. Altfel un startup ar putea atribui
 * investiții fictive oricărui investitor din platformă (fals în statistica lui).
 * Investitorii externi (fără profil) sunt liberi — doar investorName.
 */
export async function POST(req: Request) {
  const startup = await getCurrentStartupProfile();
  if (!startup) {
    return NextResponse.json(
      { error: "Doar conturile de startup pot înregistra investiții." },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body invalid." }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Date invalide.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const d = parsed.data;

  const investedAt = new Date(d.investedAt);
  if (Number.isNaN(investedAt.getTime())) {
    return NextResponse.json({ error: "Dată invalidă." }, { status: 400 });
  }

  // Dacă se leagă un investitor de pe platformă, verifică relația ACCEPTED.
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

  const investment = await prisma.investment.create({
    data: {
      startupProfileId: startup.startupProfileId,
      investorProfileId: d.investorProfileId || null,
      investorName: d.investorName,
      amountUsd: d.amountUsd,
      round: d.round || null,
      equityPercent: d.equityPercent ?? null,
      investedAt,
      note: d.note || null,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: investment.id }, { status: 201 });
}
