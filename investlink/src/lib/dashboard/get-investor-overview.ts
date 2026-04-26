import { prisma } from "@/lib/prisma";

export type InvestorOverviewData = {
  userName: string;
  firstName: string;
  portfolioReturnPct: number;
  currentValue: number;
  activeAssets: number;
  unrealizedProfit: number;
  avgRiskScore: number;
  riskLabel: "Stable" | "Moderate" | "High";
};

function toNumber(value: unknown): number {
  return Number(value ?? 0);
}

function getRiskLabel(score: number): "Stable" | "Moderate" | "High" {
  if (score < 35) return "Stable";
  if (score < 65) return "Moderate";
  return "High";
}

export async function getInvestorOverviewByEmail(
  email: string,
): Promise<InvestorOverviewData> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      name: true,
      investorProfile: {
        select: {
          id: true,
          investments: {
            where: { isActive: true },
            select: {
              investedAmount: true,
              currentValue: true,
              riskScore: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const positions = user.investorProfile?.investments ?? [];

  const activeAssets = positions.reduce(
    (sum, position) => sum + toNumber(position.investedAmount),
    0,
  );

  const currentValue = positions.reduce(
    (sum, position) => sum + toNumber(position.currentValue),
    0,
  );

  const unrealizedProfit = currentValue - activeAssets;

  const portfolioReturnPct =
    activeAssets > 0 ? (unrealizedProfit / activeAssets) * 100 : 0;

  const avgRiskScore =
    positions.length > 0
      ? positions.reduce((sum, position) => sum + position.riskScore, 0) /
        positions.length
      : 0;

  const fullName = user.name?.trim() || "Investor";
  const firstName = fullName.split(" ")[0] || "Investor";

  return {
    userName: fullName,
    firstName,
    portfolioReturnPct,
    currentValue,
    activeAssets,
    unrealizedProfit,
    avgRiskScore,
    riskLabel: getRiskLabel(avgRiskScore),
  };
}  