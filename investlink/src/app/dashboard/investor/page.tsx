import { redirect } from "next/navigation";

import { getCurrentInvestorProfile } from "@/lib/dashboard/get-current-investor";
import { getInvestorOverview } from "@/lib/dashboard/get-investor-overview";
import { InvestorOverviewSection } from "@/components/dashboard/investor/overview/InvestorOverviewSection";

// Autorizarea de rută (rol INVESTOR) e făcută de middleware.ts.
export default async function InvestorDashboardPage() {
  const investor = await getCurrentInvestorProfile();
  if (!investor) redirect("/dashboard");

  const data = await getInvestorOverview(investor.investorProfileId);

  return <InvestorOverviewSection data={data} />;
}
