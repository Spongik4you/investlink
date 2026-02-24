import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const BodySchema = z.object({
  role: z.enum(["STARTUP", "INVESTOR", "EXPERT"]),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const role = parsed.data.role;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, onboardingStatus: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Dacă deja a început onboarding-ul, nu mai schimbăm rolul aici
  if (user.onboardingStatus !== "NOT_STARTED") {
    return NextResponse.json({ nextUrl: "/auth/continue" }, { status: 200 });
  }

  // Update user role + status
  await prisma.user.update({
    where: { id: user.id },
    data: {
      type: role,
      onboardingStatus: "IN_PROGRESS",
    },
  });

  // Ensure correct profile exists
  if (role === "EXPERT") {
    await prisma.expertProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, areasOfExpertise: [], collaborationInterests: [] },
    });
    return NextResponse.json({ nextUrl: "/onboarding/expert/step-1" }, { status: 200 });
  }

  if (role === "INVESTOR") {
    await prisma.investorProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, investmentFocus: [] },
    });
    return NextResponse.json({ nextUrl: "/onboarding/investor/step-1" }, { status: 200 });
  }

  // STARTUP
  await prisma.startupProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  // Tu ai zis: startup merge direct la profil (temporar)
  return NextResponse.json({ nextUrl: "/dashboard/startup" }, { status: 200 });
}