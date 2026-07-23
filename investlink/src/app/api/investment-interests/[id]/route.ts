import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentInvestorProfile } from "@/lib/dashboard/get-current-investor";
import { getCurrentStartupProfile } from "@/lib/dashboard/get-current-startup";
import { notifyInvestmentInterestAnswered } from "@/lib/notifications/notify";

const respondSchema = z.object({
  action: z.enum(["accept", "decline"]),
});

/**
 * Răspuns la o cerere de interes (accept/decline). BIDIRECȚIONAL:
 *  - interes inițiat de INVESTOR → răspunde STARTUP-ul
 *  - interes inițiat de STARTUP → răspunde INVESTORUL
 * Răspunde partea OPUSĂ lui initiatedBy.
 *
 * Spre deosebire de accept-ul de la colaborări expert, ACCEPT aici NU creează
 * automat o entitate financiară — un interes acceptat înseamnă doar "am fost
 * de acord să discutăm". Investițiile reale se înregistrează manual (pasul C).
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: interestId } = await params;

  const [investor, startup] = await Promise.all([
    getCurrentInvestorProfile(),
    getCurrentStartupProfile(),
  ]);

  if (!investor && !startup) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 403 });
  }

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

  const ownershipOr: Array<Record<string, string>> = [];
  if (investor)
    ownershipOr.push({ investorProfileId: investor.investorProfileId });
  if (startup) ownershipOr.push({ startupProfileId: startup.startupProfileId });

  const interest = await prisma.investmentInterest.findFirst({
    where: { id: interestId, OR: ownershipOr },
    select: {
      id: true,
      status: true,
      initiatedBy: true,
      investorProfileId: true,
      startupProfileId: true,
    },
  });

  if (!interest) {
    return NextResponse.json(
      { error: "Cererea nu a fost găsită." },
      { status: 404 },
    );
  }

  // Răspunde DOAR partea opusă lui initiatedBy.
  const responderIsStartup = interest.initiatedBy === "INVESTOR";
  const callerIsResponder = responderIsStartup
    ? startup?.startupProfileId === interest.startupProfileId
    : investor?.investorProfileId === interest.investorProfileId;

  if (!callerIsResponder) {
    return NextResponse.json(
      { error: "Nu poți răspunde la propria cerere. O poți retrage." },
      { status: 403 },
    );
  }

  if (interest.status !== "PENDING") {
    return NextResponse.json(
      { error: `Cererea a fost deja ${interest.status.toLowerCase()}.` },
      { status: 409 },
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.investmentInterest.update({
      where: { id: interest.id },
      data: {
        status: action === "accept" ? "ACCEPTED" : "DECLINED",
        respondedAt: new Date(),
      },
    });
    await notifyInvestmentInterestAnswered(tx, interest.id, action);
  });

  return NextResponse.json({
    ok: true,
    status: action === "accept" ? "ACCEPTED" : "DECLINED",
  });
}
