import { redirect } from "next/navigation";

import { getCurrentExpertProfile } from "@/lib/dashboard/get-current-expert";
import { getExpertCollaborations } from "@/lib/dashboard/get-expert-collaborations";
import { ExpertPortfolioSection } from "@/components/dashboard/expert/ExpertPortfolioSection";

// Autorizarea de rută (rol EXPERT) e făcută de middleware.ts. Aici derivăm
// expertProfileId din sesiune — un expert vede doar colaborările lui.
export default async function ExpertPortfolioPage() {
  const expert = await getCurrentExpertProfile();

  if (!expert) {
    redirect("/dashboard/expert");
  }

  const data = await getExpertCollaborations(expert.expertProfileId);

  return <ExpertPortfolioSection data={data} />;
}
