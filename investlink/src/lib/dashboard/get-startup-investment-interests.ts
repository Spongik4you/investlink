import { prisma } from "@/lib/prisma";

export type StartupInvestmentInterestItem = {
  id: string;
  message: string | null;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "WITHDRAWN";
  createdAt: string;
  respondedAt: string | null;
  investor: {
    name: string;
    title: string | null;
    investorType: string | null;
    location: string | null;
    sectors: string[];
  };
};

export type StartupInvestmentInterestsData = {
  pending: StartupInvestmentInterestItem[];
  responded: StartupInvestmentInterestItem[];
  pendingCount: number;
};

function nameFrom(first?: string | null, last?: string | null): string {
  return [first?.trim(), last?.trim()].filter(Boolean).join(" ") || "Investor";
}

function locationOf(country: string | null, city: string | null): string | null {
  const parts = [city?.trim(), country?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

/**
 * Interesele primite de un startup — cereri unde INVESTORUL a inițiat
 * (initiatedBy = INVESTOR). La acestea răspunde startup-ul.
 * Simetric cu inbox-ul de aplicații al startup-ului (de la expert).
 */
export async function getStartupInvestmentInterests(
  startupProfileId: string,
): Promise<StartupInvestmentInterestsData> {
  const interests = await prisma.investmentInterest.findMany({
    where: { startupProfileId, initiatedBy: "INVESTOR" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      message: true,
      status: true,
      createdAt: true,
      respondedAt: true,
      investorProfile: {
        select: {
          firstName: true,
          lastName: true,
          professionalTitle: true,
          investorType: true,
          country: true,
          city: true,
          sectors: true,
        },
      },
    },
  });

  const mapped: StartupInvestmentInterestItem[] = interests.map((i) => ({
    id: i.id,
    message: i.message,
    status: i.status,
    createdAt: i.createdAt.toISOString(),
    respondedAt: i.respondedAt?.toISOString() ?? null,
    investor: {
      name: nameFrom(i.investorProfile.firstName, i.investorProfile.lastName),
      title: i.investorProfile.professionalTitle,
      investorType: i.investorProfile.investorType,
      location: locationOf(i.investorProfile.country, i.investorProfile.city),
      sectors: i.investorProfile.sectors.slice(0, 4),
    },
  }));

  const pending = mapped.filter((i) => i.status === "PENDING");
  const responded = mapped.filter((i) => i.status !== "PENDING");

  return { pending, responded, pendingCount: pending.length };
}
