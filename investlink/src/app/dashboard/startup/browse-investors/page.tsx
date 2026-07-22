import { redirect } from "next/navigation";

import { getCurrentStartupProfile } from "@/lib/dashboard/get-current-startup";
import {
  getInvestorsForStartup,
  getInvestorTypes,
} from "@/lib/dashboard/get-investors-for-startup";
import { InvestorBrowseSection } from "@/components/dashboard/startup/InvestorBrowseSection";

export default async function StartupBrowseInvestorsPage() {
  const startup = await getCurrentStartupProfile();
  if (!startup) redirect("/dashboard/startup");

  const [investors, investorTypes] = await Promise.all([
    getInvestorsForStartup(startup.startupProfileId),
    getInvestorTypes(),
  ]);

  return (
    <InvestorBrowseSection investors={investors} investorTypes={investorTypes} />
  );
}
