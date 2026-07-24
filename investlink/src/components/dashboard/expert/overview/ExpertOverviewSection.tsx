import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Compass,
  Inbox,
  Star,
  UserCog,
} from "lucide-react";
import type { ExpertOverviewData } from "@/lib/dashboard/get-expert-overview";

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

export function ExpertOverviewSection({ data }: { data: ExpertOverviewData }) {
  const { kpis } = data;
  const profileComplete = data.missingProfileFields.length === 0;

  return (
    <div className="space-y-5">
      {/* ── KPI ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Active Collaborations"
          value={String(kpis.activeCollaborations)}
          badge={kpis.activeCollaborations > 0 ? "Working" : undefined}
          badgeTone="neutral"
        />
        <KpiCard
          label="Invitations to Answer"
          value={String(kpis.invitationsAwaitingReply)}
          badge={kpis.invitationsAwaitingReply > 0 ? "Needs reply" : undefined}
          badgeTone="neutral"
        />
        <KpiCard
          label="Applications Sent"
          value={String(kpis.applicationsAwaitingReply)}
          badge={
            kpis.applicationsAwaitingReply > 0 ? "Awaiting reply" : undefined
          }
          badgeTone="neutral"
        />
        <KpiCard
          label="Profile Strength"
          value={`${kpis.profileStrengthPct}%`}
          badge={profileComplete ? "Complete" : undefined}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          {/* ── Colaborări active (rezumat din Portfolio) ── */}
          <Card
            title="Active Collaborations"
            subtitle="Startups you're currently working with"
            action={
              <Link
                href="/dashboard/expert/portfolio"
                className="whitespace-nowrap text-[12px] font-semibold text-[#2563EB] hover:underline"
              >
                View portfolio →
              </Link>
            }
          >
            {data.activeCollaborations.length === 0 ? (
              <EmptyState
                icon={<Briefcase className="h-[18px] w-[18px] text-[#2563EB]" />}
                title="No active collaborations"
                hint="Accept an invitation or apply to a startup to get started."
              />
            ) : (
              <div className="space-y-[14px]">
                {data.activeCollaborations.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 rounded-[8px] border border-[#F1F3F5] p-3"
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] text-[13px] font-bold text-white"
                      style={{ background: gradientFor(c.id) }}
                    >
                      {initialsFrom(c.startupName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13.5px] font-bold text-[#1A1D23]">
                        {c.startupName}
                      </div>
                      <div className="truncate text-[12px] text-[#9CA3AF]">
                        {c.roleTitle}
                      </div>
                      <div className="truncate text-[11.5px] text-[#9CA3AF]">
                        {c.currentProjectTitle ?? (
                          <span className="italic">No project assigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* ── Rating primit ── */}
          <Card
            title="Rating Received"
            subtitle="Average of ratings startups left on ended collaborations"
          >
            {kpis.avgRating != null ? (
              <div className="flex items-center gap-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-[32px] font-bold leading-none text-[#1A1D23]">
                    {kpis.avgRating}
                  </span>
                  <span className="text-[14px] text-[#9CA3AF]">/ 5</span>
                </div>
                <div className="flex gap-[2px]">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`h-[18px] w-[18px] ${
                        n <= Math.round(kpis.avgRating!)
                          ? "fill-[#FBBF24] text-[#FBBF24]"
                          : "text-[#D1D5DB]"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[12px] text-[#9CA3AF]">
                  from {kpis.ratingCount} ratings
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-[8px] bg-[#F9FAFB] px-4 py-3">
                <Star className="h-[18px] w-[18px] shrink-0 text-[#D1D5DB]" />
                <p className="text-[12.5px] text-[#6B7280]">
                  {kpis.ratingCount === 0
                    ? "No ratings yet. Startups can rate you when a collaboration ends."
                    : `${kpis.ratingCount} of 3 ratings received — an average is shown once there are enough to be meaningful.`}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* ── Coloana dreaptă ── */}
        <div className="space-y-5">
          <Card
            title="Matching Startups"
            subtitle="Their needs overlap your skills"
            action={
              <Link
                href="/dashboard/expert/browse"
                className="whitespace-nowrap rounded-[7px] border border-[#E8EBF0] px-[10px] py-[5px] text-[12px] font-semibold text-[#6B7280] transition hover:bg-[#F5F6FA] hover:text-[#1A1D23]"
              >
                Browse
              </Link>
            }
          >
            {data.matchingStartups.length === 0 ? (
              <EmptyState
                icon={<Compass className="h-[18px] w-[18px] text-[#2563EB]" />}
                title="No matches right now"
                hint="Add more skills to your profile, or browse all startups."
              />
            ) : (
              <div className="space-y-3">
                {data.matchingStartups.map((s) => (
                  <Link
                    key={s.startupProfileId}
                    href="/dashboard/expert/browse"
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

                    {/* DOVADA potrivirii, nu un scor opac */}
                    <div className="mb-[6px] text-[11.5px] font-semibold text-[#16A34A]">
                      {s.matchedNeeds.length} of {s.totalNeeds} needs match your
                      skills
                    </div>
                    <div className="flex flex-wrap gap-[4px]">
                      {s.matchedNeeds.map((n) => (
                        <span
                          key={n}
                          className="rounded-full bg-[#F0FDF4] px-[7px] py-[1px] text-[10px] font-medium text-[#16A34A]"
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* ── Profil: singurul „despre tine", pentru că e acționabil ── */}
          <Card
            title="Profile Strength"
            subtitle={
              profileComplete
                ? "Your profile is complete"
                : "Complete your profile to get more invitations"
            }
          >
            <div className="mb-3">
              <div className="mb-[6px] flex items-center justify-between text-[12px]">
                <span className="text-[#6B7280]">Completion</span>
                <span className="font-bold text-[#1A1D23]">
                  {kpis.profileStrengthPct}%
                </span>
              </div>
              <div className="h-[7px] w-full overflow-hidden rounded-full bg-[#EFF1F4]">
                <div
                  className="h-full rounded-full bg-[#2563EB] transition-all"
                  style={{ width: `${kpis.profileStrengthPct}%` }}
                />
              </div>
            </div>

            {profileComplete ? (
              <p className="text-[12px] text-[#9CA3AF]">
                Nothing missing — startups see your full profile.
              </p>
            ) : (
              <>
                <div className="mb-[8px] text-[11.5px] font-semibold text-[#374151]">
                  Missing:
                </div>
                <div className="mb-3 flex flex-wrap gap-[5px]">
                  {data.missingProfileFields.slice(0, 6).map((f) => (
                    <span
                      key={f}
                      className="rounded-full bg-[#FEF3C7] px-[8px] py-[2px] text-[10.5px] font-medium text-[#B45309]"
                    >
                      {f}
                    </span>
                  ))}
                  {data.missingProfileFields.length > 6 && (
                    <span className="rounded-full bg-[#F3F4F6] px-[8px] py-[2px] text-[10.5px] font-medium text-[#6B7280]">
                      +{data.missingProfileFields.length - 6} more
                    </span>
                  )}
                </div>
                <Link
                  href="/dashboard/expert/profile"
                  className="inline-flex items-center gap-[6px] rounded-[7px] bg-[#2563EB] px-[13px] py-[7px] text-[12.5px] font-semibold text-white transition hover:bg-[#1d4ed8]"
                >
                  <UserCog className="h-[14px] w-[14px]" />
                  Complete profile
                </Link>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* ── Bandă de acțiuni ── */}
      {kpis.invitationsAwaitingReply > 0 && (
        <div className="rounded-[10px] border border-[#BFDBFE] bg-[#EFF6FF] px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                <Inbox className="h-[18px] w-[18px] text-[#2563EB]" />
              </div>
              <div>
                <div className="text-[13.5px] font-bold text-[#1A1D23]">
                  {kpis.invitationsAwaitingReply}{" "}
                  {kpis.invitationsAwaitingReply === 1
                    ? "startup is"
                    : "startups are"}{" "}
                  waiting for your response
                </div>
                <div className="text-[12px] text-[#4B5563]">
                  Review their invitations and accept or decline.
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/expert/opportunities"
              className="inline-flex items-center gap-1 rounded-[7px] bg-[#2563EB] px-[13px] py-[7px] text-[12.5px] font-semibold text-white transition hover:bg-[#1d4ed8]"
            >
              Opportunities
              <ArrowRight className="h-[13px] w-[13px]" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
