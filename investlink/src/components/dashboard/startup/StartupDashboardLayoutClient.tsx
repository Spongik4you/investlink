"use client";

import type { ReactNode } from "react";
import { DashboardLayoutClient } from "@/components/dashboard/shared/DashboardLayoutClient";
import {
  STARTUP_NAV_ITEMS,
  STARTUP_PAGE_META,
  getStartupPageFromPathname,
} from "./startup-nav-config";
import type { DashboardNavData } from "@/components/dashboard/shared/DashboardLayoutClient";

type Props = {
  navData: DashboardNavData;
  dashboardDateLabel: string;
  children: ReactNode;
};

export function StartupDashboardLayoutClient({
  navData,
  dashboardDateLabel,
  children,
}: Props) {
  return (
    <DashboardLayoutClient
      navData={navData}
      navItems={STARTUP_NAV_ITEMS}
      pageMeta={STARTUP_PAGE_META}
      getPageFromPathname={getStartupPageFromPathname}
      dashboardDateLabel={dashboardDateLabel}
    >
      {children}
    </DashboardLayoutClient>
  );
}