import { prisma } from "@/lib/prisma";
import { mapKpis, money, initials } from "./mappers";
import { DashboardVm } from "./types";

export async function getStartupDashboardData(
  email: string
): Promise<DashboardVm> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      startupProfile: {
        include: {
          investorRelations: true,
          expertCollaborations: true,
          fundingRounds: {
            include: {
              investments: true,
            },
          },
        },
      },
    },
  });

  if (!user?.startupProfile) {
    throw new Error("Startup profile missing");
  }

  const profile = user.startupProfile;

  // 💰 total raised
  const totalRaised = profile.fundingRounds.reduce((sum, r) => {
    return sum + Number(r.raisedAmount || 0);
  }, 0);

  // 📊 KPIs
  const kpis = mapKpis(
    totalRaised,
    profile.investorRelations.length,
    profile.expertCollaborations.length
  );

  // 👤 Investors
  const investors = profile.investorRelations.map((inv) => ({
    id: inv.id,
    name: inv.displayName,
    organization: inv.organizationName || "-",
    amount: money(inv.totalCommitted),
    equity: inv.equityPercent ? inv.equityPercent + "%" : "-",
  }));

  // 🧠 Experts
  const experts = profile.expertCollaborations.map((exp) => ({
    id: exp.id,
    name: exp.displayName,
    role: exp.roleTitle,
    paid: money(exp.totalPaid),
    projects: exp.projectsCount,
  }));

  // 💸 Investments
  const investments = profile.fundingRounds.flatMap((round) =>
    round.investments.map((inv) => ({
      id: inv.id,
      investor: "Investor",
      amount: money(inv.amount),
      date: inv.createdAt.toISOString().slice(0, 10),
      status: inv.status,
    }))
  );

  return {
    profile: {
      companyName: profile.companyName || "Startup",
      initials: initials(profile.companyName || "Startup"),
    },
    kpis,
    investors,
    experts,
    investments,
  };
}