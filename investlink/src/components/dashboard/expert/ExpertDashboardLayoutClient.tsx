"use client";

import type { ReactNode } from "react";
import { DashboardLayoutClient } from "@/components/dashboard/shared/DashboardLayoutClient";
import type { DashboardNavData } from "@/components/dashboard/shared/DashboardLayoutClient";
import {
  EXPERT_NAV_ITEMS,
  EXPERT_PAGE_META,
  getExpertPageFromPathname,
} from "./expert-nav-config";

type Props = {
  navData: DashboardNavData;
  dashboardDateLabel: string;
  children: ReactNode;
};

export function ExpertDashboardLayoutClient({
  navData,
  dashboardDateLabel,
  children,
}: Props) {
  return (
    <DashboardLayoutClient
      navData={navData}
      navItems={EXPERT_NAV_ITEMS}
      pageMeta={EXPERT_PAGE_META}
      getPageFromPathname={getExpertPageFromPathname}
      dashboardDateLabel={dashboardDateLabel}
    >
      {children}
    </DashboardLayoutClient>
  );
}
