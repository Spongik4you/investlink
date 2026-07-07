import {
  Bell,
  BookOpenText,
  BriefcaseBusiness,
  CreditCard,
  LayoutGrid,
  MessageSquareMore,
  Sparkles,
  Star,
  UserRoundCog,
  type LucideIcon,
} from "lucide-react";

export type ExpertPageKey =
  | "dashboard"
  | "opportunities"
  | "portfolio"
  | "casestudies"
  | "messages"
  | "payments"
  | "reviews"
  | "profile"
  | "notifications";

export const EXPERT_PAGE_META: Record<
  ExpertPageKey,
  { title: string; subtitle: string }
> = {
  dashboard: {
    title: "Expert Dashboard",
    subtitle: "Your activity summary and latest opportunities.",
  },
  opportunities: {
    title: "Opportunities",
    subtitle: "Startup matches and quick gigs for your expertise.",
  },
  portfolio: {
    title: "My Portfolio",
    subtitle: "Active collaborations and past projects.",
  },
  casestudies: {
    title: "Case Studies",
    subtitle: "Showcase your best work to attract startups.",
  },
  messages: {
    title: "Messages",
    subtitle: "Conversations with startups and investors.",
  },
  payments: {
    title: "Payments",
    subtitle: "Earnings, invoices, and payout settings.",
  },
  reviews: {
    title: "Reviews",
    subtitle: "Feedback from your collaborations.",
  },
  profile: {
    title: "Profile Settings",
    subtitle: "Keep your expert profile up to date.",
  },
  notifications: {
    title: "Notifications",
    subtitle: "Stay updated on platform activity.",
  },
};

export type ExpertNavItem = {
  key: ExpertPageKey;
  label: string;
  href: string;
  icon: LucideIcon;
  section: "core" | "collaboration" | "compliance";
};

export const EXPERT_NAV_ITEMS: ExpertNavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard/expert",
    icon: LayoutGrid,
    section: "core",
  },
  {
    key: "opportunities",
    label: "Opportunities",
    href: "/dashboard/expert/opportunities",
    icon: Sparkles,
    section: "core",
  },
  {
    key: "portfolio",
    label: "My Portfolio",
    href: "/dashboard/expert/portfolio",
    icon: BriefcaseBusiness,
    section: "core",
  },
  {
    key: "casestudies",
    label: "Case Studies",
    href: "/dashboard/expert/casestudies",
    icon: BookOpenText,
    section: "core",
  },
  {
    key: "messages",
    label: "Messages",
    href: "/dashboard/expert/messages",
    icon: MessageSquareMore,
    section: "collaboration",
  },
  {
    key: "payments",
    label: "Payments",
    href: "/dashboard/expert/payments",
    icon: CreditCard,
    section: "collaboration",
  },
  {
    key: "reviews",
    label: "Reviews",
    href: "/dashboard/expert/reviews",
    icon: Star,
    section: "collaboration",
  },
  {
    key: "profile",
    label: "Profile Settings",
    href: "/dashboard/expert/profile",
    icon: UserRoundCog,
    section: "compliance",
  },
  {
    key: "notifications",
    label: "Notifications",
    href: "/dashboard/expert/notifications",
    icon: Bell,
    section: "compliance",
  },
];

const EXPERT_PAGE_KEYS: ExpertPageKey[] = [
  "dashboard",
  "opportunities",
  "portfolio",
  "casestudies",
  "messages",
  "payments",
  "reviews",
  "profile",
  "notifications",
];

export function getExpertPageFromPathname(pathname: string): ExpertPageKey {
  const cleanPath = pathname.replace(/\/+$/, "");
  const parts = cleanPath.split("/").filter(Boolean);

  const pageKey = parts[2];

  if (!pageKey) return "dashboard";

  if (EXPERT_PAGE_KEYS.includes(pageKey as ExpertPageKey)) {
    return pageKey as ExpertPageKey;
  }

  return "dashboard";
}
