import { redirect } from "next/navigation";

import { getCurrentStartupProfile } from "@/lib/dashboard/get-current-startup";
import { getStartupOverview } from "@/lib/dashboard/get-startup-overview";
import { StartupOverviewSection } from "@/components/dashboard/startup/overview/StartupOverviewSection";

// Autorizarea de rută (rol STARTUP) e făcută de middleware.ts.
export default async function StartupDashboardPage() {
  const startup = await getCurrentStartupProfile();
  if (!startup) redirect("/dashboard");

  const data = await getStartupOverview(startup.startupProfileId);

  return <StartupOverviewSection data={data} />;
}
