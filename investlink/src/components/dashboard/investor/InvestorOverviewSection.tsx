import {
  BriefcaseBusiness,
  DollarSign,
  Shield,
  TrendingUp,
} from "lucide-react";
import type { InvestorOverviewData } from "@/lib/dashboard/get-investor-overview";

type Props = {
  data: InvestorOverviewData;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function badgeClass(value: number): string {
  if (value > 0) {
    return "bg-green-50 text-green-600";
  }
  if (value < 0) {
    return "bg-red-50 text-red-600";
  }
  return "bg-blue-50 text-blue-600";
}

function riskBadgeClass(label: InvestorOverviewData["riskLabel"]): string {
  if (label === "Stable") return "bg-green-50 text-green-600";
  if (label === "Moderate") return "bg-amber-50 text-amber-600";
  return "bg-red-50 text-red-600";
}

function KpiCard(props: {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge: string;
  badgeClassName: string;
}) {
  return (
    <div className="rounded-[10px] border border-[#E8EBF0] bg-white px-5 py-[18px] shadow-[0_1px_3px_rgba(0,0,0,.06),0_1px_8px_rgba(0,0,0,.04)]">
      <div className="mb-[10px] flex items-center justify-between">
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px]">
          {props.icon}
        </div>
        <span
          className={`rounded-full px-[7px] py-[2px] text-[11px] font-semibold ${props.badgeClassName}`}
        >
          {props.badge}
        </span>
      </div>

      <div className="mb-[5px] text-[10.5px] font-semibold uppercase tracking-[0.05em] text-[#9CA3AF]">
        {props.label}
      </div>

      <div className="text-[24px] font-bold leading-none tracking-[-0.5px] text-[#1A1D23]">
        {props.value}
      </div>
    </div>
  );
}

export function InvestorOverviewSection({ data }: Props) {
  return (
    <section className="mb-5">
      <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <h1 className="text-[22px] font-bold tracking-[-0.4px] text-[#1A1D23]">
            Welcome back, {data.firstName}! 👋
          </h1>
          <p className="mt-[3px] text-[13px] text-[#9CA3AF]">
            Your portfolio is{" "}
            <strong className={data.portfolioReturnPct >= 0 ? "text-green-600" : "text-red-600"}>
              {formatPercent(data.portfolioReturnPct)}
            </strong>{" "}
            versus invested capital.
          </p>
        </div>

        <div className="flex gap-[10px]">
          <button className="inline-flex h-[34px] items-center rounded-[7px] border border-[#E8EBF0] bg-white px-[14px] text-[12.5px] font-semibold text-[#6B7280] transition hover:bg-[#F5F6FA] hover:text-[#1A1D23]">
            Generate Report
          </button>
          <button className="inline-flex h-[34px] items-center rounded-[7px] bg-[#2563EB] px-[14px] text-[12.5px] font-semibold text-white transition hover:bg-[#1d4ed8]">
            + New Investment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px] bg-[#EFF4FF]">
              <DollarSign className="h-4 w-4 text-[#2563EB]" />
            </div>
          }
          label="Current Value"
          value={formatCurrency(data.currentValue)}
          badge={formatPercent(data.portfolioReturnPct)}
          badgeClassName={badgeClass(data.portfolioReturnPct)}
        />

        <KpiCard
          icon={
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px] bg-[#F0FDF4]">
              <BriefcaseBusiness className="h-4 w-4 text-[#16A34A]" />
            </div>
          }
          label="Active Assets"
          value={formatCurrency(data.activeAssets)}
          badge={`${Math.round(data.avgRiskScore)} risk`}
          badgeClassName="bg-green-50 text-green-600"
        />

        <KpiCard
          icon={
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px] bg-[#FFFBEB]">
              <TrendingUp className="h-4 w-4 text-[#D97706]" />
            </div>
          }
          label="Unrealized Profit"
          value={formatCurrency(data.unrealizedProfit)}
          badge={formatPercent(data.portfolioReturnPct)}
          badgeClassName={badgeClass(data.unrealizedProfit)}
        />

        <KpiCard
          icon={
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px] bg-[#F3F4F6]">
              <Shield className="h-4 w-4 text-[#6B7280]" />
            </div>
          }
          label="Risk Analysis"
          value={data.riskLabel}
          badge={`${Math.round(data.avgRiskScore)}%`}
          badgeClassName={riskBadgeClass(data.riskLabel)}
        />
      </div>
    </section>
  );
}