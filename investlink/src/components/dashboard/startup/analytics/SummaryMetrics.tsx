import { DollarSign, FileText, Users, TrendingUp } from "lucide-react";
import type { SummaryMetrics as SummaryMetricsType } from "@/lib/dashboard/get-investment-analytics";

function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n.toLocaleString("en-US")}`;
}

function Card({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[12px] border border-[#E8EBF0] bg-white p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#EFF4FF]">
        {icon}
      </div>
      <div className="text-[24px] font-bold leading-tight text-[#1A1D23]">
        {value}
      </div>
      <div className="text-[12.5px] text-[#9CA3AF]">{label}</div>
    </div>
  );
}

export function SummaryMetrics({ data }: { data: SummaryMetricsType }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card
        icon={<DollarSign className="h-[18px] w-[18px] text-[#2563EB]" />}
        value={formatUsd(data.totalRaisedUsd)}
        label="Total raised"
      />
      <Card
        icon={<FileText className="h-[18px] w-[18px] text-[#2563EB]" />}
        value={String(data.investmentCount)}
        label="Investments"
      />
      <Card
        icon={<Users className="h-[18px] w-[18px] text-[#2563EB]" />}
        value={String(data.distinctInvestorCount)}
        label="Investors"
      />
      <Card
        icon={<TrendingUp className="h-[18px] w-[18px] text-[#2563EB]" />}
        value={formatUsd(data.averageInvestmentUsd)}
        label="Avg investment"
      />
    </div>
  );
}
