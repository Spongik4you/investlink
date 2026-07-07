import { redirect } from "next/navigation";

import { getCurrentExpertProfile } from "@/lib/dashboard/get-current-expert";
import { getExpertInvitations } from "@/lib/dashboard/get-expert-invitations";
import { ExpertInvitationsSection } from "@/components/dashboard/expert/ExpertInvitationsSection";

// Autorizarea de rută (rol EXPERT) e făcută de middleware.ts. Aici derivăm
// expertProfileId din sesiune — un expert vede doar invitațiile lui.
export default async function ExpertOpportunitiesPage() {
  const expert = await getCurrentExpertProfile();

  if (!expert) {
    redirect("/dashboard/expert");
  }

  const data = await getExpertInvitations(expert.expertProfileId);

  return <ExpertInvitationsSection data={data} />;
}
