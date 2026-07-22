import { prisma } from "@/lib/prisma";

export type InvestorReceivedInterestItem = {
  id: string;
  message: string | null;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "WITHDRAWN";
  createdAt: string;
  respondedAt: string | null;
  startup: {
    companyName: string;
    oneLiner: string | null;
    location: string | null;
    industries: string[];
    fundingStage: string | null;
  };
};

export type InvestorReceivedInterestsData = {
  pending: InvestorReceivedInterestItem[];
  responded: InvestorReceivedInterestItem[];
  pendingCount: number;
};

function locationOf(country: string | null, city: string | null): string | null {
  const parts = [city?.trim(), country?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

/**
 * Interesele primite de un investitor — cereri unde STARTUP-ul a inițiat
 * (initiatedBy = STARTUP). La acestea răspunde investitorul.
 * Simetric cu inbox-ul de interese al startup-ului (B1).
 */
export async function getInvestorReceivedInterests(
  investorProfileId: string,
): Promise<InvestorReceivedInterestsData> {
  const interests = await prisma.investmentInterest.findMany({
    where: { investorProfileId, initiatedBy: "STARTUP" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      message: true,
      status: true,
      createdAt: true,
      respondedAt: true,
      startupProfile: {
        select: {
          companyName: true,
          oneLiner: true,
          country: true,
          city: true,
          industries: true,
          fundingStage: true,
        },
      },
    },
  });

  const mapped: InvestorReceivedInterestItem[] = interests.map((i) => ({
    id: i.id,
    message: i.message,
    status: i.status,
    createdAt: i.createdAt.toISOString(),
    respondedAt: i.respondedAt?.toISOString() ?? null,
    startup: {
      companyName: i.startupProfile.companyName ?? "Unnamed startup",
      oneLiner: i.startupProfile.oneLiner,
      location: locationOf(i.startupProfile.country, i.startupProfile.city),
      industries: i.startupProfile.industries.slice(0, 4),
      fundingStage: i.startupProfile.fundingStage,
    },
  }));

  const pending = mapped.filter((i) => i.status === "PENDING");
  const responded = mapped.filter((i) => i.status !== "PENDING");

  return { pending, responded, pendingCount: pending.length };
}
