import { redirect } from "next/navigation";

import { getCurrentExpertProfile } from "@/lib/dashboard/get-current-expert";
import {
  getStartupDirectory,
  getStartupFundingStages,
} from "@/lib/dashboard/get-startup-directory";
import { StartupDirectorySection } from "@/components/dashboard/expert/StartupDirectorySection";

// Autorizarea de rută (rol EXPERT) e făcută de middleware.ts. expertProfileId
// din sesiune — pentru a marca la ce startup-uri a aplicat deja.
export default async function ExpertBrowsePage() {
  const expert = await getCurrentExpertProfile();

  if (!expert) {
    redirect("/dashboard/expert");
  }

  const [startups, fundingStages] = await Promise.all([
    getStartupDirectory(expert.expertProfileId),
    getStartupFundingStages(),
  ]);

  return (
    <StartupDirectorySection
      startups={startups}
      fundingStages={fundingStages}
    />
  );
}
