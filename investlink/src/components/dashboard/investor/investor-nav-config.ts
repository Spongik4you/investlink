import {
    BriefcaseBusiness,
    FolderLock,
    LayoutGrid,
    LineChart,
    MessageSquareMore,
    Settings,
    UserRound,
    type LucideIcon,
  } from "lucide-react";
  
  export type InvestorPageKey =
    | "dashboard"
    | "portfolio"
    | "experts"
    | "analytics"
    | "consultations"
    | "vault"
    | "settings";
  
  export const INVESTOR_PAGE_META: Record<
    InvestorPageKey,
    { title: string; subtitle: string }
  > = {
    dashboard: {
      title: "Financial Overview",
      subtitle: new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "Europe/Chisinau",
      }).format(new Date()),
    },
    portfolio: {
      title: "Equity Portfolio",
      subtitle: "Portfolio positions and performance.",
    },
    experts: {
      title: "Expert Access",
      subtitle: "Your expert network and retained specialists.",
    },
    analytics: {
      title: "Market Analytics",
      subtitle: "Signals, market watch, and sector performance.",
    },
    consultations: {
      title: "Consultations",
      subtitle: "Upcoming and completed investor consultations.",
    },
    vault: {
      title: "Tax & Legal Vault",
      subtitle: "Tax, legal, and compliance documents.",
    },
    settings: {
      title: "User Preferences",
      subtitle: "Personal settings and account preferences.",
    },
  };
  
  export type InvestorNavItem = {
    key: InvestorPageKey;
    label: string;
    href: string;
    icon: LucideIcon;
    section: "core" | "compliance";
  };
  
  export const INVESTOR_NAV_ITEMS: InvestorNavItem[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      href: "/dashboard/investor",
      icon: LayoutGrid,
      section: "core",
    },
    {
      key: "portfolio",
      label: "Equity Portfolio",
      href: "/dashboard/investor/portfolio",
      icon: BriefcaseBusiness,
      section: "core",
    },
    {
      key: "experts",
      label: "Expert Access",
      href: "/dashboard/investor/experts",
      icon: UserRound,
      section: "core",
    },
    {
      key: "analytics",
      label: "Market Analytics",
      href: "/dashboard/investor/analytics",
      icon: LineChart,
      section: "core",
    },
    {
      key: "consultations",
      label: "Consultations",
      href: "/dashboard/investor/consultations",
      icon: MessageSquareMore,
      section: "core",
    },
    {
      key: "vault",
      label: "Tax & Legal Vault",
      href: "/dashboard/investor/vault",
      icon: FolderLock,
      section: "compliance",
    },
    {
      key: "settings",
      label: "User Preferences",
      href: "/dashboard/investor/settings",
      icon: Settings,
      section: "compliance",
    },
  ];

  const INVESTOR_PAGE_KEYS: InvestorPageKey[] = [
    "dashboard",
    "portfolio",
    "experts",
    "analytics",
    "consultations",
    "vault",
    "settings",
  ];
  
  export function getInvestorPageFromPathname(pathname: string): InvestorPageKey {
    const cleanPath = pathname.replace(/\/+$/, "");
    const parts = cleanPath.split("/").filter(Boolean);
  
    // /dashboard/investor -> dashboard
    // /dashboard/investor/portfolio -> portfolio
    const pageKey = parts[2];
  
    if (!pageKey) {
      return "dashboard";
    }
  
    if (INVESTOR_PAGE_KEYS.includes(pageKey as InvestorPageKey)) {
      return pageKey as InvestorPageKey;
    }
  
    return "dashboard";
  }

