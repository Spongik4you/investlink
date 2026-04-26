import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { getStartupNavData } from "@/lib/dashboard/get-startup-nav-data";
import { StartupDashboardLayoutClient } from "@/components/dashboard/startup/StartupDashboardLayoutClient";

export default async function StartupLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const navData = await getStartupNavData(session.user.email);

  const dashboardDateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Europe/Chisinau",
  }).format(new Date());

  return (
    <StartupDashboardLayoutClient
      navData={navData}
      dashboardDateLabel={dashboardDateLabel}
    >
      {children}
    </StartupDashboardLayoutClient>
  );
}