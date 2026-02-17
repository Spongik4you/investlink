import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { UserType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseRole(role: string): UserType {
  if (role === "EXPERT" || role === "INVESTOR" || role === "STARTUP") {
    return role;
  }

  return "STARTUP";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const phone = String(body?.phone ?? "").trim();
    const password = String(body?.password ?? "");
    const confirmPassword = String(body?.confirmPassword ?? "");
    const type = parseRole(String(body?.role ?? "STARTUP").toUpperCase());

    if (!name || !email || !phone || !password || !confirmPassword) {
      return NextResponse.json({ error: "Completează toate câmpurile." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Email invalid." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Parola trebuie să aibă minim 8 caractere." }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Parolele nu coincid." }, { status: 400 });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ error: "Există deja un cont cu acest email." }, { status: 409 });
    }

    const existingPhone = await prisma.user.findUnique({ where: { phone } });
    if (existingPhone) {
      return NextResponse.json({ error: "Există deja un cont cu acest număr de telefon." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        type,
        onboardingStatus: "NOT_STARTED",
      },
      select: { id: true, name: true, email: true, phone: true, type: true, onboardingStatus: true, createdAt: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Eroare la înregistrare." }, { status: 500 });
  }
}
