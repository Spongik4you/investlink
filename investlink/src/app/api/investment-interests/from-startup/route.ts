import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentStartupProfile } from "@/lib/dashboard/get-current-startup";

const interestSchema = z.object({
  investorProfileId: z.string().min(1),
  message: z.string().trim().max(1000).optional(),
});

/**
 * Startup-ul își exprimă interesul către un investitor (direcția inversă, B2).
 * Creează un InvestmentInterest cu initiatedBy = STARTUP.
 * La ACEASTĂ cerere răspunde INVESTORUL.
 *
 * Endpoint separat de /api/investment-interests (unde INVESTORUL inițiază):
 * actor diferit, autorizare diferită. Un endpoint = un actor.
 *
 * Blocare strictă (B1.5): respinge dacă există interes PENDING sau ACCEPTED.
 */
export async function POST(req: Request) {
  const startup = await getCurrentStartupProfile();
  if (!startup) {
    return NextResponse.json(
      { error: "Doar conturile de startup pot folosi acest endpoint." },
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

  const { investorProfileId, message } = parsed.data;

  const investor = await prisma.investorProfile.findUnique({
    where: { id: investorProfileId },
    select: { id: true },
  });
  if (!investor) {
    return NextResponse.json(
      { error: "Investitorul nu a fost găsit." },
      { status: 404 },
    );
  }

  const existing = await prisma.investmentInterest.findFirst({
    where: {
      startupProfileId: startup.startupProfileId,
      investorProfileId,
      status: { in: ["PENDING", "ACCEPTED"] },
    },
    select: { id: true, initiatedBy: true, status: true },
  });
  if (existing) {
    let msg: string;
    if (existing.status === "ACCEPTED") {
      msg =
        "Aveți deja o relație activă cu acest investitor. Investițiile se înregistrează separat.";
    } else {
      msg =
        existing.initiatedBy === "STARTUP"
          ? "Ai deja o cerere de interes în așteptare pentru acest investitor."
          : "Acest investitor ți-a trimis deja o cerere de interes — răspunde-i din Investors.";
    }
    return NextResponse.json({ error: msg }, { status: 409 });
  }

  const interest = await prisma.investmentInterest.create({
    data: {
      startupProfileId: startup.startupProfileId,
      investorProfileId,
      message: message || null,
      initiatedBy: "STARTUP",
      status: "PENDING",
    },
    select: { id: true, status: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, interest }, { status: 201 });
}
