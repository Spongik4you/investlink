import type { ReactNode } from "react";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getInvestorNavData } from "@/lib/dashboard/get-investor-nav-data";
import { InvestorDashboardLayoutClient } from "@/components/dashboard/investor/InvestorDashboardLayoutClient";

export default async function InvestorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error(
      "InvestorLayout: sesiune lipsă deși middleware ar fi trebuit să blocheze accesul.",
    );
  }

  const navData = await getInvestorNavData(session.user.email);

  const dashboardDateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Europe/Chisinau",
  }).format(new Date());

  return (
    <InvestorDashboardLayoutClient
      navData={navData}
      dashboardDateLabel={dashboardDateLabel}
    >
      {children}
    </InvestorDashboardLayoutClient>
  );
}