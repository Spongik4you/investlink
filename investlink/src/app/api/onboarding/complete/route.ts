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
    select: { type: true },
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
  console.log("COMPLETE route hit");
  console.log("session user:", session?.user);
  console.log("dbUser:", dbUser);
  console.log("role from body:", role);
  console.log("steps keys:", Object.keys(payload?.steps ?? {}));
  const beforeUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      investorProfile: true,
      startupProfile: true,
      expertProfile: true,
    },
  });
  console.log("BEFORE:", beforeUser);

  const updatedUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      investorProfile: true,
      startupProfile: true,
      expertProfile: true,
    },
  });
  
  console.log("updatedUser after complete:", updatedUser);
  return NextResponse.json({ ok: true });
}
