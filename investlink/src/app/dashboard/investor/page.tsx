import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { getInvestorOverviewByEmail } from "@/lib/dashboard/get-investor-overview";
import { InvestorOverviewSection } from "@/components/dashboard/investor/InvestorOverviewSection";

export default async function InvestorDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const overview = await getInvestorOverviewByEmail(session.user.email);

  return <InvestorOverviewSection data={overview} />;
}