import { redirect } from "next/navigation";

import { getCurrentStartupProfile } from "@/lib/dashboard/get-current-startup";
import { getStartupInvestmentInterests } from "@/lib/dashboard/get-startup-investment-interests";
import { InvestmentInterestsSection } from "@/components/dashboard/startup/InvestmentInterestsSection";

// Autorizarea de rută (rol STARTUP) e făcută de middleware.ts.
export default async function StartupInvestorsPage() {
  const startup = await getCurrentStartupProfile();

  if (!startup) {
    redirect("/dashboard/startup");
  }

  const data = await getStartupInvestmentInterests(startup.startupProfileId);

  return <InvestmentInterestsSection data={data} />;
}
