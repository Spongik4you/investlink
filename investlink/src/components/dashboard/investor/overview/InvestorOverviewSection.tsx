import Link from "next/link";
import { ArrowRight, Compass, Inbox, TrendingUp } from "lucide-react";
import type { InvestorOverviewData } from "@/lib/dashboard/get-investor-overview";
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
    year: "numeric",
  }).format(new Date(iso));
}

function initialsFrom(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 2) return `${p[0][0]}${p[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const GRADIENTS = [
  "linear-gradient(135deg,#60a5fa,#2563eb)",
  "linear-gradient(135deg,#34d399,#059669)",
  "linear-gradient(135deg,#f472b6,#ec4899)",
  "linear-gradient(135deg,#fbbf24,#f59e0b)",
  "linear-gradient(135deg,#a78bfa,#7c3aed)",
];

function gradientFor(id: string): string {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return GRADIENTS[sum % GRADIENTS.length];
}

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

export function InvestorOverviewSection({
  data,
}: {
  data: InvestorOverviewData;
}) {
  const { kpis } = data;

  return (
    <div className="space-y-5">
      {/* ── KPI: doar fapte, fără valoare estimată sau scor de risc ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total Invested"
          value={formatUsdShort(kpis.totalInvestedUsd)}
          badge={
            kpis.investedThisMonthUsd > 0
              ? `↑ ${formatUsdShort(kpis.investedThisMonthUsd)} this month`
              : undefined
          }
        />
        <KpiCard
          label="Startups Backed"
          value={String(kpis.startupsBacked)}
        />
        <KpiCard
          label="Active Relationships"
          value={String(kpis.activeRelationships)}
          badge={kpis.activeRelationships > 0 ? "Open" : undefined}
          badgeTone="neutral"
        />
        <KpiCard
          label="Incoming Interest"
          value={String(kpis.incomingInterest)}
          badge={kpis.incomingInterest > 0 ? "Needs reply" : undefined}
          badgeTone="neutral"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Card
            title="Capital Deployed"
            subtitle="Your investments per month – last 12 months"
          >
            <MonthlyBarChart
              data={data.monthlyDeployed}
              zeroLabel="No capital deployed"
              emptyMessage="No investments recorded in the last 12 months."
            />
          </Card>

          <Card
            title="Portfolio"
            subtitle="Startups you've backed — as recorded by each startup"
            action={
              <Link
                href="/dashboard/investor/browse"
                className="whitespace-nowrap text-[12px] font-semibold text-[#2563EB] hover:underline"
              >
                Find more →
              </Link>
            }
          >
            {data.portfolio.length === 0 ? (
              <EmptyState
                icon={<TrendingUp className="h-[18px] w-[18px] text-[#2563EB]" />}
                title="No investments yet"
                hint="Investments appear here once a startup you've backed records them."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#F1F3F5] text-left">
                      <th className="pb-[10px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                        Startup
                      </th>
                      <th className="pb-[10px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                        Invested
                      </th>
                      <th className="pb-[10px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                        Equity
                      </th>
                      <th className="pb-[10px] text-right text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                        Last
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.portfolio.map((row) => (
                      <tr
                        key={row.startupProfileId}
                        className="border-b border-[#F5F6F8] last:border-0"
                      >
                        <td className="py-[11px]">
                          <div className="flex items-center gap-[9px]">
                            <div
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] text-[10.5px] font-bold text-white"
                              style={{ background: gradientFor(row.startupProfileId) }}
                            >
                              {initialsFrom(row.companyName)}
                            </div>
                            <span className="text-[13px] font-semibold text-[#1A1D23]">
                              {row.companyName}
                            </span>
                          </div>
                        </td>
                        <td className="text-[13px] font-semibold text-[#1A1D23]">
                          {formatUsd(row.totalInvestedUsd)}
                        </td>
                        <td className="text-[12.5px] text-[#6B7280]">
                          {row.equityPercent != null
                            ? `${row.equityPercent}%`
                            : "—"}
                        </td>
                        <td className="text-right text-[12px] text-[#9CA3AF]">
                          {formatDate(row.lastInvestedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className="mt-3 text-[11px] leading-relaxed text-[#9CA3AF]">
                  Figures are as recorded by each startup. If something looks
                  wrong, raise it with them directly.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Coloana dreaptă: deal flow, în locul „Advisory Network" */}
        <Card
          title="Discover Startups"
          subtitle="Not yet connected with you"
          action={
            <Link
              href="/dashboard/investor/browse"
              className="whitespace-nowrap rounded-[7px] border border-[#E8EBF0] px-[10px] py-[5px] text-[12px] font-semibold text-[#6B7280] transition hover:bg-[#F5F6FA] hover:text-[#1A1D23]"
            >
              Browse all
            </Link>
          }
        >
          {data.discoverStartups.length === 0 ? (
            <EmptyState
              icon={<Compass className="h-[18px] w-[18px] text-[#2563EB]" />}
              title="Nothing new right now"
              hint="You're connected with every startup currently on the platform."
            />
          ) : (
            <div className="space-y-[14px]">
              {data.discoverStartups.map((s) => (
                <Link
                  key={s.startupProfileId}
                  href="/dashboard/investor/browse"
                  className="block rounded-[8px] border border-[#F1F3F5] p-3 transition hover:border-[#BFDBFE] hover:bg-[#F9FBFF]"
                >
                  <div className="mb-[6px] flex items-center gap-[9px]">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-[11px] font-bold text-white"
                      style={{ background: gradientFor(s.startupProfileId) }}
                    >
                      {initialsFrom(s.companyName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-bold text-[#1A1D23]">
                        {s.companyName}
                      </div>
                      <div className="truncate text-[11px] text-[#9CA3AF]">
                        {s.fundingStage ?? "Stage n/a"}
                      </div>
                    </div>
                  </div>
                  {s.oneLiner && (
                    <p className="line-clamp-2 text-[11.5px] leading-snug text-[#6B7280]">
                      {s.oneLiner}
                    </p>
                  )}
                  {s.industries.length > 0 && (
                    <div className="mt-[7px] flex flex-wrap gap-[4px]">
                      {s.industries.map((i) => (
                        <span
                          key={i}
                          className="rounded-full bg-[#EFF4FF] px-[7px] py-[1px] text-[10px] font-medium text-[#2563EB]"
                        >
                          {i}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ── Bandă de acțiuni: doar dacă cineva așteaptă răspuns ── */}
      {kpis.incomingInterest > 0 && (
        <div className="rounded-[10px] border border-[#BFDBFE] bg-[#EFF6FF] px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                <Inbox className="h-[18px] w-[18px] text-[#2563EB]" />
              </div>
              <div>
                <div className="text-[13.5px] font-bold text-[#1A1D23]">
                  {kpis.incomingInterest}{" "}
                  {kpis.incomingInterest === 1 ? "startup is" : "startups are"}{" "}
                  waiting for your response
                </div>
                <div className="text-[12px] text-[#4B5563]">
                  Review their interest and decide whether to start a
                  conversation.
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/investor/interests"
              className="inline-flex items-center gap-1 rounded-[7px] bg-[#2563EB] px-[13px] py-[7px] text-[12.5px] font-semibold text-white transition hover:bg-[#1d4ed8]"
            >
              Startup interest
              <ArrowRight className="h-[13px] w-[13px]" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
