import { prisma } from "@/lib/prisma";

export type PlatformStats = {
  investors: number;
  startups: number;
  experts: number;
  totalInvestedUsd: number;
  /** true doar când cifrele sunt destul de mari ca să spună ceva. */
  meetsThreshold: boolean;
};

/**
 * Pragul sub care NU afișăm statistici publice.
 *
 * Motivul e de produs, nu tehnic: o secțiune de statistici există ca să
 * transmită „alții folosesc asta". Cu 2 investitori transmite exact opusul —
 * face vizibil că platforma e goală. Iar cifre inventate se prind în 30 de
 * secunde: cineva se înscrie, deschide directorul, și numără.
 *
 * Deci: cifre REALE, afișate doar peste prag. Secțiunea se „aprinde" singură
 * când platforma crește — fără să mai atingem codul, fără să minți nicio zi.
 */
const MIN_PER_CATEGORY = 25;

export async function getPlatformStats(): Promise<PlatformStats> {
  const [investors, startups, experts, investmentAgg] = await Promise.all([
    prisma.investorProfile.count(),
    prisma.startupProfile.count(),
    prisma.expertProfile.count(),
    prisma.investment.aggregate({ _sum: { amountUsd: true } }),
  ]);

  return {
    investors,
    startups,
    experts,
    totalInvestedUsd: Number(investmentAgg._sum.amountUsd ?? 0),
    meetsThreshold:
      investors >= MIN_PER_CATEGORY &&
      startups >= MIN_PER_CATEGORY &&
      experts >= MIN_PER_CATEGORY,
  };
}
