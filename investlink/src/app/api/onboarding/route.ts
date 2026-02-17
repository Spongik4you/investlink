import { UserType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function csvToArray(value: unknown): string[] {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const role = String(body?.role ?? "").toUpperCase() as UserType;

  if (!["EXPERT", "INVESTOR", "STARTUP"].includes(role)) {
    return NextResponse.json({ error: "Rol invalid." }, { status: 400 });
  }

  if (session.user.type !== role) {
    return NextResponse.json({ error: "Rolul nu corespunde contului tău." }, { status: 403 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingStatus: "IN_PROGRESS" },
  });

  if (role === "EXPERT") {
    await prisma.expertProfile.upsert({
      where: { userId: session.user.id },
      update: {
        headline: String(body?.headline ?? "").trim(),
        yearsExperience: Number(body?.yearsExperience ?? 0) || null,
        areasOfExpertise: csvToArray(body?.areasOfExpertise),
        collaborationInterests: csvToArray(body?.collaborationInterests),
      },
      create: {
        userId: session.user.id,
        headline: String(body?.headline ?? "").trim(),
        yearsExperience: Number(body?.yearsExperience ?? 0) || null,
        areasOfExpertise: csvToArray(body?.areasOfExpertise),
        collaborationInterests: csvToArray(body?.collaborationInterests),
      },
    });
  }

  if (role === "INVESTOR") {
    await prisma.investorProfile.upsert({
      where: { userId: session.user.id },
      update: {
        investorType: String(body?.investorType ?? "").trim(),
        budgetRange: String(body?.budgetRange ?? "").trim(),
        riskAppetite: String(body?.riskAppetite ?? "").trim(),
        investmentFocus: csvToArray(body?.investmentFocus),
        strategicNotes: String(body?.strategicNotes ?? "").trim(),
      },
      create: {
        userId: session.user.id,
        investorType: String(body?.investorType ?? "").trim(),
        budgetRange: String(body?.budgetRange ?? "").trim(),
        riskAppetite: String(body?.riskAppetite ?? "").trim(),
        investmentFocus: csvToArray(body?.investmentFocus),
        strategicNotes: String(body?.strategicNotes ?? "").trim(),
      },
    });
  }

  if (role === "STARTUP") {
    await prisma.startupProfile.upsert({
      where: { userId: session.user.id },
      update: {
        companyName: String(body?.companyName ?? "").trim(),
        companyStage: String(body?.companyStage ?? "").trim(),
        website: String(body?.website ?? "").trim(),
        shortPitch: String(body?.shortPitch ?? "").trim(),
        fundingGoal: String(body?.fundingGoal ?? "").trim(),
      },
      create: {
        userId: session.user.id,
        companyName: String(body?.companyName ?? "").trim(),
        companyStage: String(body?.companyStage ?? "").trim(),
        website: String(body?.website ?? "").trim(),
        shortPitch: String(body?.shortPitch ?? "").trim(),
        fundingGoal: String(body?.fundingGoal ?? "").trim(),
      },
    });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingStatus: "COMPLETED" },
  });

  return NextResponse.json({ ok: true });
}
