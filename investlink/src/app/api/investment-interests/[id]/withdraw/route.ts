import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentInvestorProfile } from "@/lib/dashboard/get-current-investor";
import { getCurrentStartupProfile } from "@/lib/dashboard/get-current-startup";

/**
 * WITHDRAW: INIȚIATORUL retrage propria cerere de interes PENDING.
 * BIDIRECȚIONAL — doar cel care a inițiat poate retrage.
 */
export async function PATCH(
  _req: Request,
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

  const callerIsInitiator =
    interest.initiatedBy === "INVESTOR"
      ? investor?.investorProfileId === interest.investorProfileId
      : startup?.startupProfileId === interest.startupProfileId;

  if (!callerIsInitiator) {
    return NextResponse.json(
      { error: "Doar cel care a trimis cererea o poate retrage." },
      { status: 403 },
    );
  }

  if (interest.status !== "PENDING") {
    return NextResponse.json(
      {
        error: `Cererea nu mai poate fi retrasă (status: ${interest.status.toLowerCase()}).`,
      },
      { status: 409 },
    );
  }

  await prisma.investmentInterest.update({
    where: { id: interest.id },
    data: { status: "WITHDRAWN", respondedAt: new Date() },
  });

  return NextResponse.json({ ok: true, status: "WITHDRAWN" });
}
