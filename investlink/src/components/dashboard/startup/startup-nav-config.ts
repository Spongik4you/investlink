import {
    Bell,
    Compass,
    BriefcaseBusiness,
    Inbox,
    LayoutGrid,
    LineChart,
    ScrollText,
    Settings,
    UserRound,
    UsersRound,
    type LucideIcon,
  } from "lucide-react";
  
  export type StartupPageKey =
    | "dashboard"
    | "analytics"
    | "portfolios"
    | "investors"
    | "browse-investors"
    | "experts"
    | "applications"
    | "auditlogs"
    | "settings"
    | "notifications";
  
  export const STARTUP_PAGE_META: Record<
    StartupPageKey,
    { title: string; subtitle: string }
  > = {
    dashboard: {
      title: "Executive Dashboard",
      subtitle: "Monitor funding and collaboration performance.",
    },
    analytics: {
      title: "Investment Analytics",
      subtitle: "Detailed funding insights and trends.",
    },
    portfolios: {
      title: "Portfolios",
      subtitle: "Funding structure and expert collaborations.",
    },
    investors: {
      title: "Investors",
      subtitle: "Manage and track all your investors.",
    },
    "browse-investors": {
      title: "Discover Investors",
      subtitle: "Find investors matching your stage and sector.",
    },
    experts: {
      title: "Expert Network",
      subtitle: "Manage current experts and discover new talent.",
    },
    applications: {
      title: "Applications",
      subtitle: "Experts who applied to work with you.",
    },
    auditlogs: {
      title: "Audit Logs",
      subtitle: "Track important account activity.",
    },
    settings: {
      title: "System Settings",
      subtitle: "Configure your startup account.",
    },
    notifications: {
      title: "Notifications",
      subtitle: "Stay updated on platform activity.",
    },
  };
  
  export type StartupNavItem = {
    key: StartupPageKey;
    label: string;
    href: string;
    icon: LucideIcon;
    section: "core" | "collaboration" | "compliance";
  };
  
  export const STARTUP_NAV_ITEMS: StartupNavItem[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      href: "/dashboard/startup",
      icon: LayoutGrid,
      section: "core",
    },
    {
      key: "analytics",
      label: "Investment Analytics",
      href: "/dashboard/startup/analytics",
      icon: LineChart,
      section: "core",
    },
    {
      key: "portfolios",
      label: "Portfolios",
      href: "/dashboard/startup/portfolios",
      icon: BriefcaseBusiness,
      section: "core",
    },
    {
      key: "investors",
      label: "Investors",
      href: "/dashboard/startup/investors",
      icon: UsersRound,
      section: "core",
    },
    {
      key: "browse-investors",
      label: "Discover Investors",
      href: "/dashboard/startup/browse-investors",
      icon: Compass,
      section: "core",
    },
    {
      key: "experts",
      label: "Expert Network",
      href: "/dashboard/startup/experts",
      icon: UserRound,
      section: "collaboration",
    },
    {
      key: "applications",
      label: "Applications",
      href: "/dashboard/startup/applications",
      icon: Inbox,
      section: "collaboration",
    },
    {
      key: "auditlogs",
      label: "Audit Logs",
      href: "/dashboard/startup/auditlogs",
      icon: ScrollText,
      section: "compliance",
    },
    {
      key: "settings",
      label: "System Settings",
      href: "/dashboard/startup/settings",
      icon: Settings,
      section: "compliance",
    },
    {
      key: "notifications",
      label: "Notifications",
      href: "/dashboard/startup/notifications",
      icon: Bell,
      section: "compliance",
    },
  ];
  
  const STARTUP_PAGE_KEYS: StartupPageKey[] = [
    "dashboard",
    "analytics",
    "portfolios",
    "investors",
    "browse-investors",
    "experts",
    "applications",
    "auditlogs",
    "settings",
    "notifications",
  ];
  
  export function getStartupPageFromPathname(pathname: string): StartupPageKey {
    const cleanPath = pathname.replace(/\/+$/, "");
    const parts = cleanPath.split("/").filter(Boolean);
  
    const pageKey = parts[2];
  
    if (!pageKey) return "dashboard";
  
    if (STARTUP_PAGE_KEYS.includes(pageKey as StartupPageKey)) {
      return pageKey as StartupPageKey;
    }
  
    return "dashboard";
  }