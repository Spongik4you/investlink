import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const email = String(body?.email ?? "").toLowerCase().trim();
  const password = String(body?.password ?? "");
  const name = body?.name ? String(body.name) : null;
  const type = body?.type ?? "STARTUP"; // STARTUP / INVESTOR / EXPERT

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Email valid și parola min 8 caractere." },
      { status: 400 }
    );
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "Email deja folosit." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, passwordHash, name, type },
    select: { id: true, email: true, type: true },
  });

  return NextResponse.json({ user }, { status: 201 });
}
