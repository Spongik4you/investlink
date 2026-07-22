import { prisma } from "@/lib/prisma";

export type InvestmentRecord = {
  id: string;
  investorName: string;
  investorProfileId: string | null;
  onPlatform: boolean;
  amountUsd: number;
  round: string | null;
  equityPercent: number | null;
  investedAt: string;
  note: string | null;
};

/** Investitor cu relație acceptată — opțiune în dropdown-ul de înregistrare. */
export type LinkableInvestor = {
  investorProfileId: string;
  name: string;
};

export type StartupInvestmentsData = {
  investments: InvestmentRecord[];
  linkableInvestors: LinkableInvestor[];
  totalRaisedUsd: number;
};

function nameFrom(first?: string | null, last?: string | null): string {
  return [first?.trim(), last?.trim()].filter(Boolean).join(" ") || "Investor";
}

/**
 * Investițiile înregistrate de un startup + investitorii cu care are relație
 * acceptată (pentru dropdown-ul de legare). startupProfileId din sesiune.
 *
 * totalRaisedUsd e o agregare simplă (sumă) — statistica bogată vine la pasul D.
 */
export async function getStartupInvestments(
  startupProfileId: string,
): Promise<StartupInvestmentsData> {
  const [investments, acceptedInterests] = await Promise.all([
    prisma.investment.findMany({
      where: { startupProfileId },
      orderBy: { investedAt: "desc" },
      select: {
        id: true,
        investorName: true,
        investorProfileId: true,
        amountUsd: true,
        round: true,
        equityPercent: true,
        investedAt: true,
        note: true,
      },
    }),
    // Investitori cu care startup-ul are un interes ACCEPTED — candidați de legat.
    prisma.investmentInterest.findMany({
      where: { startupProfileId, status: "ACCEPTED" },
      select: {
        investorProfile: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    }),
  ]);

  const mapped: InvestmentRecord[] = investments.map((inv) => ({
    id: inv.id,
    investorName: inv.investorName,
    investorProfileId: inv.investorProfileId,
    onPlatform: inv.investorProfileId != null,
    amountUsd: Number(inv.amountUsd),
    round: inv.round,
    equityPercent: inv.equityPercent != null ? Number(inv.equityPercent) : null,
    investedAt: inv.investedAt.toISOString(),
    note: inv.note,
  }));

  // Deduplic investitorii (o pereche poate avea un singur interes ACCEPTED,
  // dar defensiv).
  const seen = new Set<string>();
  const linkableInvestors: LinkableInvestor[] = [];
  for (const ai of acceptedInterests) {
    const p = ai.investorProfile;
    if (!seen.has(p.id)) {
      seen.add(p.id);
      linkableInvestors.push({
        investorProfileId: p.id,
        name: nameFrom(p.firstName, p.lastName),
      });
    }
  }

  const totalRaisedUsd = mapped.reduce((sum, i) => sum + i.amountUsd, 0);

  return { investments: mapped, linkableInvestors, totalRaisedUsd };
}
