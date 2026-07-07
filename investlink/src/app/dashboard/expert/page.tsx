import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getExpertOverviewByEmail } from "@/lib/dashboard/get-expert-overview";
import { ExpertOverviewSection } from "@/components/dashboard/expert/ExpertOverviewSection";

// Autorizarea (sesiune + rol EXPERT + onboarding complet) e verificată
// deja de middleware.ts pentru orice rută /dashboard/expert/*.
export default async function ExpertDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error(
      "ExpertDashboardPage: sesiune lipsă deși middleware ar fi trebuit să blocheze accesul.",
    );
  }

  const overview = await getExpertOverviewByEmail(session.user.email);

  return <ExpertOverviewSection data={overview} />;
}