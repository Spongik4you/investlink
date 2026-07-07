import { redirect } from "next/navigation";

import { getCurrentStartupProfile } from "@/lib/dashboard/get-current-startup";
import {
  getExpertDirectory,
  getExpertCategories,
} from "@/lib/dashboard/get-expert-directory";
import { getStartupCollaborations } from "@/lib/dashboard/get-startup-collaborations";
import { StartupExpertsPageContent } from "@/components/dashboard/startup/StartupExpertsPageContent";

// Autorizarea de rută (rol STARTUP) e făcută de middleware.ts. Aici derivăm
// în plus startupProfileId din sesiune — sursă de adevăr pentru "al meu",
// niciodată din client.
export default async function StartupExpertsPage() {
  const startup = await getCurrentStartupProfile();

  if (!startup) {
    // Rol corect dar profil lipsă (edge case) — trimite la dashboard.
    redirect("/dashboard/startup");
  }

  const [experts, categories, collaborations] = await Promise.all([
    getExpertDirectory(startup.startupProfileId),
    getExpertCategories(),
    getStartupCollaborations(startup.startupProfileId),
  ]);

  return (
    <StartupExpertsPageContent
      collaborations={collaborations}
      experts={experts}
      categories={categories}
    />
  );
}
