import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Marchează O notificare ca citită.
 * Anti-IDOR: updateMany filtrat pe userId — dacă notificarea e a altcuiva,
 * count = 0 și răspundem 404, fără să confirmăm că există.
 */
export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  const result = await prisma.notification.updateMany({
    where: { id, userId: user.id, readAt: null },
    data: { readAt: new Date() },
  });

  if (result.count === 0) {
    // Fie nu e a lui, fie era deja citită — ambele sunt "nimic de făcut".
    const exists = await prisma.notification.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });
    if (!exists) {
      return NextResponse.json(
        { error: "Notificarea nu a fost găsită." },
        { status: 404 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
