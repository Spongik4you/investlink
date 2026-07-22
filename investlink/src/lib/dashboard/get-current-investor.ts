import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Rezolvă InvestorProfile-ul utilizatorului autentificat, din sesiune.
 * Simetric cu getCurrentStartupProfile / getCurrentExpertProfile.
 *
 * investorProfileId NU trebuie acceptat din client — se derivă mereu de aici,
 * ca un investitor să nu poată acționa în numele altuia.
 */
export async function getCurrentInvestorProfile() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      type: true,
      investorProfile: { select: { id: true } },
    },
  });

  if (!user || user.type !== "INVESTOR" || !user.investorProfile) {
    return null;
  }

  return { investorProfileId: user.investorProfile.id };
}
