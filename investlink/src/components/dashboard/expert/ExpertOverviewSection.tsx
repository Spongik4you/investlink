import {
  Award,
  Clock,
  DollarSign,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { ExpertOverviewData } from "@/lib/dashboard/get-expert-overview";

type Props = {
  data: ExpertOverviewData;
};

function strengthBadgeClass(pct: number): string {
  if (pct >= 80) return "bg-green-50 text-green-600";
  if (pct >= 50) return "bg-amber-50 text-amber-600";
  return "bg-red-50 text-red-600";
}

function strengthLabel(pct: number): string {
  if (pct >= 80) return "Excellent";
  if (pct >= 50) return "Good";
  return "Needs work";
}

function KpiCard(props: {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: string;
  badgeClassName?: string;
}) {
  return (
    <div className="rounded-[10px] border border-[#E8EBF0] bg-white px-5 py-[18px] shadow-[0_1px_3px_rgba(0,0,0,.06),0_1px_8px_rgba(0,0,0,.04)]">
      <div className="mb-[10px] flex items-center justify-between">
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px]">
          {props.icon}
        </div>
        {props.badge && (
          <span
            className={`rounded-full px-[7px] py-[2px] text-[11px] font-semibold ${props.badgeClassName ?? "bg-blue-50 text-blue-600"}`}
          >
            {props.badge}
          </span>
        )}
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

function ChipList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <div className="mb-[8px] text-[10.5px] font-semibold uppercase tracking-[0.05em] text-[#9CA3AF]">
        {title}
      </div>
      <div className="flex flex-wrap gap-[6px]">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full bg-[#EFF4FF] px-[10px] py-[3px] text-[12px] font-medium text-[#2563EB]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ExpertOverviewSection({ data }: Props) {
  const hasExpertiseData =
    data.skills.length > 0 ||
    data.industries.length > 0 ||
    data.areasOfExpertise.length > 0;

  return (
    <section className="mb-5">
      {/* Header */}
      <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <h1 className="text-[22px] font-bold tracking-[-0.4px] text-[#1A1D23]">
            Welcome back, {data.firstName}! 👋
          </h1>
          <p className="mt-[3px] text-[13px] text-[#9CA3AF]">
            Here&apos;s your activity summary and profile status.
          </p>
        </div>
      </div>

      {/* KPI strip */}
      <div className="mb-6 grid grid-cols-1 gap-[14px] md:grid-cols-3">
        <KpiCard
          icon={
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px] bg-[#EFF4FF]">
              <ShieldCheck className="h-4 w-4 text-[#2563EB]" />
            </div>
          }
          label="Profile Strength"
          value={`${data.profileStrengthPct}%`}
          badge={strengthLabel(data.profileStrengthPct)}
          badgeClassName={strengthBadgeClass(data.profileStrengthPct)}
        />

        <KpiCard
          icon={
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px] bg-[#F0FDF4]">
              <DollarSign className="h-4 w-4 text-[#16A34A]" />
            </div>
          }
          label="Hourly Rate"
          value={
            data.hourlyRateUsd != null ? `$${data.hourlyRateUsd}/h` : "Not set"
          }
        />

        <KpiCard
          icon={
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px] bg-[#FFFBEB]">
              <Award className="h-4 w-4 text-[#D97706]" />
            </div>
          }
          label="Experience"
          value={
            data.yearsExperience != null
              ? `${data.yearsExperience} years`
              : "Not set"
          }
        />
      </div>

      {/* Profile completeness nudge — doar dacă lipsesc câmpuri */}
      {data.missingProfileFields.length > 0 && (
        <div className="mb-6 rounded-[10px] border border-[#FDE68A] bg-[#FFFBEB] px-5 py-4">
          <div className="mb-[4px] text-[13px] font-semibold text-[#92400E]">
            Complete your profile to attract more startups
          </div>
          <div className="text-[12.5px] text-[#B45309]">
            Missing: {data.missingProfileFields.slice(0, 5).join(", ")}
            {data.missingProfileFields.length > 5 &&
              ` and ${data.missingProfileFields.length - 5} more`}
          </div>
        </div>
      )}

      {/* Your Expertise — date reale din onboarding */}
      {hasExpertiseData && (
        <div className="mb-6 rounded-[10px] border border-[#E8EBF0] bg-white px-5 py-[18px] shadow-[0_1px_3px_rgba(0,0,0,.06),0_1px_8px_rgba(0,0,0,.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[#1A1D23]">
              Your Expertise
            </h2>
            {data.availability && (
              <span className="flex items-center gap-[5px] rounded-full bg-green-50 px-[9px] py-[3px] text-[11.5px] font-semibold text-green-600">
                <Clock className="h-3 w-3" />
                {data.availability}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <ChipList title="Skills" items={data.skills} />
            <ChipList title="Industries" items={data.industries} />
            <ChipList
              title="Areas of Expertise"
              items={data.areasOfExpertise}
            />
          </div>
        </div>
      )}

      {/* CTA către invitațiile reale (fluxul de matching există acum). */}
      <a
        href="/dashboard/expert/opportunities"
        className="flex items-center gap-4 rounded-[10px] border border-[#E8EBF0] bg-white px-5 py-[18px] shadow-[0_1px_3px_rgba(0,0,0,.06),0_1px_8px_rgba(0,0,0,.04)] transition-colors hover:border-[#2563EB]"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFF4FF]">
          <Sparkles className="h-5 w-5 text-[#2563EB]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-[2px] text-[14px] font-semibold text-[#1A1D23]">
            Collaboration invitations
          </div>
          <p className="text-[12.5px] text-[#9CA3AF]">
            Startups can invite you to collaborate. Review pending invitations
            on your Opportunities page.
          </p>
        </div>
        <div className="shrink-0 text-[13px] font-semibold text-[#2563EB]">
          View →
        </div>
      </a>
    </section>
  );
}
