"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, TrendingUp, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type DashboardNavData = {
  fullName: string;
  firstName: string;
  email: string;
  avatarUrl: string | null;
  initials: string;
  roleLabel: string;
};

export type DashboardNavItem<TPageKey extends string> = {
  key: TPageKey;
  label: string;
  href: string;
  icon: LucideIcon;
  section: string;
};

export type DashboardPageMeta<TPageKey extends string> = Record<
  TPageKey,
  { title: string; subtitle: string }
>;

type Props<TPageKey extends string> = {
  navData: DashboardNavData;
  navItems: DashboardNavItem<TPageKey>[];
  pageMeta: DashboardPageMeta<TPageKey>;
  getPageFromPathname: (pathname: string) => TPageKey;
  dashboardDateLabel: string;
  children: ReactNode;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Avatar({
  initials,
  avatarUrl,
}: {
  initials: string;
  avatarUrl: string | null;
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={initials}
        className="h-[34px] w-[34px] rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#60a5fa,#2563EB)] text-[13px] font-bold text-white">
      {initials}
    </div>
  );
}

export function DashboardLayoutClient<TPageKey extends string>({
  navData,
  navItems,
  pageMeta,
  getPageFromPathname,
  dashboardDateLabel,
  children,
}: Props<TPageKey>) {
  const pathname = usePathname();
  const currentPage = getPageFromPathname(pathname);
  const meta = pageMeta[currentPage];

  const coreItems = navItems.filter((item) => item.section === "core");
  const collaborationItems = navItems.filter(
    (item) => item.section === "collaboration",
  );
  const complianceItems = navItems.filter(
    (item) => item.section === "compliance",
  );

  const subtitle =
    currentPage === "dashboard" ? dashboardDateLabel : meta.subtitle;

  const renderItems = (items: DashboardNavItem<TPageKey>[]) =>
    items.map((item) => {
      const Icon = item.icon;
      const isActive = currentPage === item.key;

      return (
        <Link
          key={item.key}
          href={item.href}
          className={cn(
            "mx-1 my-[1px] flex items-center gap-[10px] rounded-[8px] px-3 py-[9px] text-[14px] font-medium transition-all",
            isActive
              ? "bg-[#EFF4FF] text-[#2563EB]"
              : "text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827]",
          )}
        >
          <Icon className="h-4 w-4" />
          <span>{item.label}</span>
        </Link>
      );
    });

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-[#1F2937]">
      <aside className="flex h-screen w-[220px] shrink-0 flex-col overflow-y-auto border-r border-[#E5E7EB] bg-white">
        <div className="flex items-center gap-[10px] border-b border-[#F3F4F6] px-5 py-[18px]">
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-[#2563EB]">
            <TrendingUp className="h-[17px] w-[17px] text-white" />
          </div>
          <span className="text-[17px] font-bold text-[#111827]">
            InvestLink
          </span>
        </div>

        <div className="px-3 pt-[18px] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">
          Core Platform
        </div>
        <nav className="mt-[6px] px-1">{renderItems(coreItems)}</nav>

        {collaborationItems.length > 0 && (
          <>
            <div className="px-3 pt-[18px] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">
              Collaboration
            </div>
            <nav className="mt-[6px] px-1">
              {renderItems(collaborationItems)}
            </nav>
          </>
        )}

        {complianceItems.length > 0 && (
          <>
            <div className="px-3 pt-[18px] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">
              Compliance & Data
            </div>
            <nav className="mt-[6px] px-1">
              {renderItems(complianceItems)}
            </nav>
          </>
        )}

        <div className="mt-auto border-t border-[#F3F4F6] px-3 py-4">
          <div className="flex items-center gap-[10px]">
            <Avatar initials={navData.initials} avatarUrl={navData.avatarUrl} />
            <div className="min-w-0 leading-[1.3]">
              <div className="truncate text-[13px] font-semibold text-[#1F2937]">
                {navData.fullName}
              </div>
              <div className="truncate text-[11px] uppercase text-[#9CA3AF]">
                {navData.roleLabel}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[60px] shrink-0 items-center gap-4 border-b border-[#E5E7EB] bg-white px-7">
          <div className="flex-1">
            <div className="text-[19px] font-bold text-[#111827]">
              {meta.title}
            </div>
            <div className="text-[12px] text-[#9CA3AF]">{subtitle}</div>
          </div>

          <div className="relative flex items-center">
            <Search className="absolute left-[10px] h-[14px] w-[14px] text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search deals, experts, or docs…"
              className="h-9 w-[260px] rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] pl-9 pr-3 text-[13px] text-[#374151] outline-none transition focus:border-[#2563EB] focus:bg-white"
            />
          </div>

          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB]"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 text-[#4B5563]" />
            <span className="absolute right-[7px] top-[7px] h-2 w-2 rounded-full border-2 border-white bg-[#2563EB]" />
          </button>

          <div className="flex items-center gap-[10px]">
            <div className="text-right">
              <div className="text-[13px] font-semibold text-[#111827]">
                {navData.fullName}
              </div>
              <div className="text-[11px] uppercase text-[#9CA3AF]">
                {navData.roleLabel}
              </div>
            </div>

            <Avatar initials={navData.initials} avatarUrl={navData.avatarUrl} />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-7">{children}</main>
      </div>
    </div>
  );
}