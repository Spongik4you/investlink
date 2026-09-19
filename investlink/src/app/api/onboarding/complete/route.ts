import { Prisma, UserType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import {
  buildExpertProfileData,
  buildInvestorProfileData,
  buildStartupProfileData,
  buildUserUpdateFromPayload,
  type OnboardingStepPayload,
} from "@/lib/onboarding-persist";
import { prisma } from "@/lib/prisma";



/**
 * Sparge un nume complet în first/last. Plasa de siguranță pentru profil:
 * după ce pasul 1 a încetat să ceară numele explicit, îl luăm din User.name
 * (setat la signup) când pasul 1 nu l-a furnizat — ca profilul să nu rămână
 * fără nume și investitorul/expertul să nu devină „fantomă".
 */
function splitName(full?: string | null): {
  firstName: string | null;
  lastName: string | null;
} {
  const parts = (full ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: null, lastName: null };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") || null };
}

const BodySchema = z.object({
  role: z.enum(["INVESTOR", "STARTUP", "EXPERT"]),
  investorType: z.string().optional(),
  payload: z.object({
    steps: z.record(z.string(), z.any()),
  }),
});

export async function POST(req: Request) {
  
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { role, investorType, payload } = parsed.data;

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { type: true, name: true },
  });

  if (!dbUser || dbUser.type !== role) {
    return NextResponse.json(
      { error: "Role does not match your account. Try refreshing the page." },
      { status: 403 }
    );
  }

  const steps = payload.steps as OnboardingStepPayload;

  const userPatch = buildUserUpdateFromPayload(role as UserType, steps);
  const onboardingPayload = {
    role,
    investorType: investorType ?? null,
    steps,
    completedAt: new Date().toISOString(),
  };

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: session.user.id },
      data: {
        ...userPatch,
        onboardingPayload: onboardingPayload as Prisma.InputJsonValue,
        onboardingStatus: "COMPLETED",
      },
    });

    if (role === "INVESTOR") {
      const inv = buildInvestorProfileData(investorType, steps);
      if (!inv.firstName && !inv.lastName) {
        const fb = splitName(dbUser.name);
        inv.firstName = fb.firstName;
        inv.lastName = fb.lastName;
      }
      await tx.investorProfile.upsert({
        where: { userId: session.user.id },
        update: inv,
        create: {
          userId: session.user.id,
          ...inv,
        } as Prisma.InvestorProfileUncheckedCreateInput,
      });
    }

    if (role === "STARTUP") {
      const st = buildStartupProfileData(steps);
      await tx.startupProfile.upsert({
        where: { userId: session.user.id },
        update: st,
        create: {
          userId: session.user.id,
          ...st,
        } as Prisma.StartupProfileUncheckedCreateInput,
      });
    }

    if (role === "EXPERT") {
      const ex = buildExpertProfileData(steps);
      if (!ex.firstName && !ex.lastName) {
        const fb = splitName(dbUser.name);
        ex.firstName = fb.firstName;
        ex.lastName = fb.lastName;
      }
      await tx.expertProfile.upsert({
        where: { userId: session.user.id },
        update: ex,
        create: {
          userId: session.user.id,
          ...ex,
        } as Prisma.ExpertProfileUncheckedCreateInput,
      });
    }
  });
  return NextResponse.json({ ok: true });
}
