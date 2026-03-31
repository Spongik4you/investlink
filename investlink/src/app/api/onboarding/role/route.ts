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

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const role = parsed.data.role;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      type: role,
      onboardingStatus: "IN_PROGRESS",
    },
  });

  return NextResponse.json({ ok: true });
}