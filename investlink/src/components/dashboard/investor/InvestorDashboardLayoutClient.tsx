"use client";

import type { ReactNode } from "react";
import { DashboardLayoutClient } from "@/components/dashboard/shared/DashboardLayoutClient";
import type { DashboardNavData } from "@/components/dashboard/shared/DashboardLayoutClient";
import {
  INVESTOR_NAV_ITEMS,
  INVESTOR_PAGE_META,
  getInvestorPageFromPathname,
} from "./investor-nav-config";

type Props = {
  navData: DashboardNavData;
  dashboardDateLabel: string;
  children: ReactNode;
};

export function InvestorDashboardLayoutClient({
  navData,
  dashboardDateLabel,
  children,
}: Props) {
  return (
    <DashboardLayoutClient
      navData={navData}
      navItems={INVESTOR_NAV_ITEMS}
      pageMeta={INVESTOR_PAGE_META}
      getPageFromPathname={getInvestorPageFromPathname}
      dashboardDateLabel={dashboardDateLabel}
    >
      {children}
    </DashboardLayoutClient>
  );
}