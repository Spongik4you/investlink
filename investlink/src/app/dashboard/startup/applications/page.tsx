import { redirect } from "next/navigation";

import { getCurrentStartupProfile } from "@/lib/dashboard/get-current-startup";
import { getStartupApplications } from "@/lib/dashboard/get-startup-applications";
import { StartupApplicationsSection } from "@/components/dashboard/startup/StartupApplicationsSection";

// Autorizarea de rută (rol STARTUP) e făcută de middleware.ts. Aici derivăm
// startupProfileId din sesiune — un startup vede doar aplicațiile primite de el.
export default async function StartupApplicationsPage() {
  const startup = await getCurrentStartupProfile();

  if (!startup) {
    redirect("/dashboard/startup");
  }

  const data = await getStartupApplications(startup.startupProfileId);

  return <StartupApplicationsSection data={data} />;
}
