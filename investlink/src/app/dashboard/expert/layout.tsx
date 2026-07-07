import type { ReactNode } from "react";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getExpertNavData } from "@/lib/dashboard/get-expert-nav-data";
import { ExpertDashboardLayoutClient } from "@/components/dashboard/expert/ExpertDashboardLayoutClient";

// Autorizarea e verificată deja de middleware.ts. Aici doar luăm datele
// pentru sidebar/header (nume, avatar, rol afișat).
export default async function ExpertLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error(
      "ExpertLayout: sesiune lipsă deși middleware ar fi trebuit să blocheze accesul.",
    );
  }

  const navData = await getExpertNavData(session.user.email);

  const dashboardDateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Europe/Chisinau",
  }).format(new Date());

  return (
    <ExpertDashboardLayoutClient
      navData={navData}
      dashboardDateLabel={dashboardDateLabel}
    >
      {children}
    </ExpertDashboardLayoutClient>
  );
}
