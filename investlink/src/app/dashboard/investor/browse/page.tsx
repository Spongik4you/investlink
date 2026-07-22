import { redirect } from "next/navigation";

import { getCurrentInvestorProfile } from "@/lib/dashboard/get-current-investor";
import {
  getStartupsForInvestor,
  getStartupFundingStagesForInvestor,
} from "@/lib/dashboard/get-startups-for-investor";
import { StartupBrowseSection } from "@/components/dashboard/investor/StartupBrowseSection";

// Autorizarea de rută (rol INVESTOR) e făcută de middleware.ts.
export default async function InvestorBrowsePage() {
  const investor = await getCurrentInvestorProfile();

  if (!investor) {
    redirect("/dashboard/investor");
  }

  const [startups, fundingStages] = await Promise.all([
    getStartupsForInvestor(investor.investorProfileId),
    getStartupFundingStagesForInvestor(),
  ]);

  return <StartupBrowseSection startups={startups} fundingStages={fundingStages} />;
}
