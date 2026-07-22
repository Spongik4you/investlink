import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentInvestorProfile } from "@/lib/dashboard/get-current-investor";

const interestSchema = z.object({
  startupProfileId: z.string().min(1),
  message: z.string().trim().max(1000).optional(),
});

/**
 * Investitorul își exprimă interesul într-un startup.
 * Creează un InvestmentInterest cu initiatedBy = INVESTOR.
 * La ACEASTĂ cerere răspunde STARTUP-ul (partea opusă lui initiatedBy).
 *
 * Blocare strictă bidirecțională: dacă există DEJA un interes PENDING între
 * pereche (orice direcție), e respins. Impusă și de partial unique index la
 * nivel de DB — verificăm aici pentru mesaj clar.
 */
export async function POST(req: Request) {
  const investor = await getCurrentInvestorProfile();
  if (!investor) {
    return NextResponse.json(
      { error: "Doar conturile de investitor pot exprima interes." },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body invalid." }, { status: 400 });
  }

  const parsed = interestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Date invalide.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { startupProfileId, message } = parsed.data;

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

  const existing = await prisma.investmentInterest.findFirst({
    where: {
      startupProfileId,
      investorProfileId: investor.investorProfileId,
      status: { in: ["PENDING", "ACCEPTED"] },
    },
    select: { id: true, initiatedBy: true, status: true },
  });
  if (existing) {
    let msg: string;
    if (existing.status === "ACCEPTED") {
      // Relația e deja deschisă — nu are sens un interes nou.
      msg =
        "Aveți deja o relație activă cu acest startup. Investițiile se înregistrează separat.";
    } else {
      msg =
        existing.initiatedBy === "INVESTOR"
          ? "Ai deja o cerere de interes în așteptare pentru acest startup."
          : "Acest startup ți-a trimis deja o cerere de interes — răspunde-i din Interests.";
    }
    return NextResponse.json({ error: msg }, { status: 409 });
  }

  const interest = await prisma.investmentInterest.create({
    data: {
      startupProfileId,
      investorProfileId: investor.investorProfileId,
      message: message || null,
      initiatedBy: "INVESTOR",
      status: "PENDING",
    },
    select: { id: true, status: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, interest }, { status: 201 });
}
