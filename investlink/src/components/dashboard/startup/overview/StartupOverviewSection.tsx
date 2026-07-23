import Link from "next/link";
import { ArrowRight, Briefcase, Inbox, TrendingUp } from "lucide-react";
import type { StartupOverviewData } from "@/lib/dashboard/get-startup-overview";
import { MonthlyBarChart } from "@/components/dashboard/shared/MonthlyBarChart";

function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function formatUsdShort(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

function initialsFrom(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 2) return `${p[0][0]}${p[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#60a5fa,#2563eb)",
  "linear-gradient(135deg,#34d399,#059669)",
  "linear-gradient(135deg,#f472b6,#ec4899)",
  "linear-gradient(135deg,#fbbf24,#f59e0b)",
  "linear-gradient(135deg,#a78bfa,#7c3aed)",
];

function gradientFor(id: string): string {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length];
}

/** Card KPI. Badge-ul e opțional — apare doar dacă are ceva real de spus. */
function KpiCard({
  label,
  value,
  badge,
  badgeTone = "up",
}: {
  label: string;
  value: string;
  badge?: string;
  badgeTone?: "up" | "neutral";
}) {
  return (
    <div className="rounded-[10px] border border-[#E8EBF0] bg-white px-5 py-[18px] shadow-[0_1px_3px_rgba(0,0,0,.06),0_1px_8px_rgba(0,0,0,.04)]">
      {badge && (
        <span
          className={`mb-[10px] inline-block rounded-full px-[8px] py-[2px] text-[11px] font-semibold ${
            badgeTone === "up"
              ? "bg-green-50 text-green-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {badge}
        </span>
      )}
      <div className="mb-[5px] text-[10.5px] font-semibold uppercase tracking-[0.05em] text-[#9CA3AF]">
        {label}
      </div>
      <div className="text-[26px] font-bold leading-none tracking-[-0.5px] text-[#1A1D23]">
        {value}
      </div>
    </div>
  );
}

function Card({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[10px] border border-[#E8EBF0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,.06),0_1px_8px_rgba(0,0,0,.04)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-[15px] font-bold text-[#1A1D23]">{title}</div>
          <div className="text-[12px] text-[#9CA3AF]">{subtitle}</div>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-4 py-8 text-center">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#EFF4FF]">
        {icon}
      </div>
      <div className="mb-[2px] text-[13px] font-semibold text-[#374151]">
        {title}
      </div>
      <p className="max-w-[240px] text-[12px] text-[#9CA3AF]">{hint}</p>
    </div>
  );
}

export function StartupOverviewSection({ data }: { data: StartupOverviewData }) {
  const { kpis, pendingActions } = data;

  return (
    <div className="space-y-5">
      {/* ── KPI ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard
          label="Total Money Raised"
          value={formatUsdShort(kpis.totalRaisedUsd)}
          badge={
            kpis.raisedThisMonthUsd > 0
              ? `↑ ${formatUsdShort(kpis.raisedThisMonthUsd)} this month`
              : undefined
          }
        />
        <KpiCard
          label="Total Investors"
          value={String(kpis.investorCount)}
          badge={
            kpis.newInvestorsThisMonth > 0
              ? `↑ +${kpis.newInvestorsThisMonth} this month`
              : undefined
          }
        />
        <KpiCard
          label="Experts Collaborated With"
          value={String(kpis.activeExpertCount)}
          badge={kpis.activeExpertCount > 0 ? "Active" : undefined}
          badgeTone="neutral"
        />
      </div>

      {/* ── Două coloane: stânga grafic + investiții, dreapta experți ── */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Card
            title="Capital Growth"
            subtitle="Monthly funding trend – last 12 months"
            action={
              <Link
                href="/dashboard/startup/analytics"
                className="whitespace-nowrap text-[12px] font-semibold text-[#2563EB] hover:underline"
              >
                View analytics →
              </Link>
            }
          >
            <MonthlyBarChart
              data={data.monthlyCapital}
              zeroLabel="No capital raised"
              emptyMessage="No capital recorded in the last 12 months."
            />
          </Card>

          <Card
            title="Recent Investments"
            subtitle="Latest funding activity"
            action={
              <Link
                href="/dashboard/startup/analytics"
                className="whitespace-nowrap text-[12px] font-semibold text-[#2563EB] hover:underline"
              >
                View all →
              </Link>
            }
          >
            {data.recentInvestments.length === 0 ? (
              <EmptyState
                icon={<TrendingUp className="h-[18px] w-[18px] text-[#2563EB]" />}
                title="No investments recorded"
                hint="Record investments you've received to track your funding."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#F1F3F5] text-left">
                      <th className="pb-[10px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                        Investor
                      </th>
                      <th className="pb-[10px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                        Round
                      </th>
                      <th className="pb-[10px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                        Amount
                      </th>
                      <th className="pb-[10px] text-right text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentInvestments.map((inv) => (
                      <tr
                        key={inv.id}
                        className="border-b border-[#F5F6F8] last:border-0"
                      >
                        <td className="py-[11px]">
                          <div className="flex items-center gap-[9px]">
                            <div
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] text-[10.5px] font-bold text-white"
                              style={{ background: gradientFor(inv.id) }}
                            >
                              {initialsFrom(inv.investorName)}
                            </div>
                            <span className="text-[13px] font-semibold text-[#1A1D23]">
                              {inv.investorName}
                            </span>
                            {!inv.onPlatform && (
                              <span className="rounded-full bg-[#F3F4F6] px-[6px] py-[1px] text-[10px] font-medium text-[#6B7280]">
                                External
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="text-[12.5px] text-[#6B7280]">
                          {inv.round ?? "—"}
                        </td>
                        <td className="text-[13px] font-semibold text-[#1A1D23]">
                          {formatUsd(inv.amountUsd)}
                        </td>
                        <td className="text-right text-[12px] text-[#9CA3AF]">
                          {formatDate(inv.investedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Coloana dreaptă */}
        <Card
          title="Active Experts"
          subtitle="Current collaborations"
          action={
            <Link
              href="/dashboard/startup/experts"
              className="whitespace-nowrap rounded-[7px] border border-[#E8EBF0] px-[10px] py-[5px] text-[12px] font-semibold text-[#6B7280] transition hover:bg-[#F5F6FA] hover:text-[#1A1D23]"
            >
              + Invite
            </Link>
          }
        >
          {data.activeExperts.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="h-[18px] w-[18px] text-[#2563EB]" />}
              title="No active collaborations"
              hint="Invite specialists from the expert directory."
            />
          ) : (
            <div className="space-y-[14px]">
              {data.activeExperts.map((e) => (
                <div key={e.id} className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
                    style={{ background: gradientFor(e.id) }}
                  >
                    {initialsFrom(e.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-bold text-[#1A1D23]">
                      {e.name}
                    </div>
                    <div className="truncate text-[11.5px] text-[#9CA3AF]">
                      {e.roleTitle}
                    </div>
                    <div className="truncate text-[11px] text-[#9CA3AF]">
                      {e.currentProjectTitle ?? (
                        <span className="italic">No project assigned</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ── Bandă de acțiuni: apare DOAR dacă ceva așteaptă răspunsul ── */}
      {pendingActions.total > 0 && (
        <div className="rounded-[10px] border border-[#BFDBFE] bg-[#EFF6FF] px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                <Inbox className="h-[18px] w-[18px] text-[#2563EB]" />
              </div>
              <div>
                <div className="text-[13.5px] font-bold text-[#1A1D23]">
                  {pendingActions.total}{" "}
                  {pendingActions.total === 1 ? "request is" : "requests are"}{" "}
                  waiting for your response
                </div>
                <div className="text-[12px] text-[#4B5563]">
                  {[
                    pendingActions.expertApplications > 0 &&
                      `${pendingActions.expertApplications} expert ${
                        pendingActions.expertApplications === 1
                          ? "application"
                          : "applications"
                      }`,
                    pendingActions.investorInterests > 0 &&
                      `${pendingActions.investorInterests} investor ${
                        pendingActions.investorInterests === 1
                          ? "request"
                          : "requests"
                      }`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {pendingActions.expertApplications > 0 && (
                <Link
                  href="/dashboard/startup/applications"
                  className="inline-flex items-center gap-1 rounded-[7px] bg-[#2563EB] px-[13px] py-[7px] text-[12.5px] font-semibold text-white transition hover:bg-[#1d4ed8]"
                >
                  Applications
                  <ArrowRight className="h-[13px] w-[13px]" />
                </Link>
              )}
              {pendingActions.investorInterests > 0 && (
                <Link
                  href="/dashboard/startup/investors"
                  className="inline-flex items-center gap-1 rounded-[7px] border border-[#2563EB] bg-white px-[13px] py-[7px] text-[12.5px] font-semibold text-[#2563EB] transition hover:bg-[#F5F8FF]"
                >
                  Investor interest
                  <ArrowRight className="h-[13px] w-[13px]" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
