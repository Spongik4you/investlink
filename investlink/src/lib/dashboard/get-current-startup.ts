import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Rezolvă StartupProfile-ul utilizatorului autentificat, din sesiune.
 *
 * Sursa unică de adevăr pentru "care e startup-ul meu" — folosit atât de
 * pagini (server components), cât și de rutele API. startupProfileId NU trebuie
 * niciodată acceptat din input-ul clientului; se derivă mereu de aici, ca un
 * startup să nu poată acționa în numele altuia.
 *
 * Întoarce null dacă nu există sesiune sau profil (caller-ul decide dacă
 * asta e 401, 403 sau redirect).
 */
export async function getCurrentStartupProfile() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      type: true,
      startupProfile: { select: { id: true } },
    },
  });

  if (!user || user.type !== "STARTUP" || !user.startupProfile) {
    return null;
  }

  return { startupProfileId: user.startupProfile.id };
}
