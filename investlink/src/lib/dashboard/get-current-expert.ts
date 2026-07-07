import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Rezolvă ExpertProfile-ul utilizatorului autentificat, din sesiune.
 *
 * Simetric cu getCurrentStartupProfile. Sursă unică de adevăr pentru
 * "care e profilul meu de expert" — folosit de pagini și de API. NU accepta
 * niciodată expertProfileId din client la operații de răspuns la invitații;
 * derivă-l mereu de aici, altfel un expert poate acționa asupra invitațiilor
 * altuia (IDOR).
 */
export async function getCurrentExpertProfile() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      type: true,
      expertProfile: { select: { id: true } },
    },
  });

  if (!user || user.type !== "EXPERT" || !user.expertProfile) {
    return null;
  }

  return { expertProfileId: user.expertProfile.id };
}
