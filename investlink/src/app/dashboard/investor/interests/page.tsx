import { redirect } from "next/navigation";

import { getCurrentInvestorProfile } from "@/lib/dashboard/get-current-investor";
import { getInvestorReceivedInterests } from "@/lib/dashboard/get-investor-received-interests";
import { ReceivedInterestsSection } from "@/components/dashboard/investor/ReceivedInterestsSection";

export default async function InvestorInterestsPage() {
  const investor = await getCurrentInvestorProfile();
  if (!investor) redirect("/dashboard/investor");

  const data = await getInvestorReceivedInterests(investor.investorProfileId);

  return <ReceivedInterestsSection data={data} />;
}
