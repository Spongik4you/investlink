import { redirect } from "next/navigation";

import { getCurrentExpertProfile } from "@/lib/dashboard/get-current-expert";
import { getExpertOverview } from "@/lib/dashboard/get-expert-overview";
import { ExpertOverviewSection } from "@/components/dashboard/expert/overview/ExpertOverviewSection";

// Autorizarea de rută (rol EXPERT) e făcută de middleware.ts.
export default async function ExpertDashboardPage() {
  const expert = await getCurrentExpertProfile();
  if (!expert) redirect("/dashboard");

  const data = await getExpertOverview(expert.expertProfileId);

  return <ExpertOverviewSection data={data} />;
}
