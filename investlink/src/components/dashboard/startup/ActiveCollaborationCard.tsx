import type { StartupCollaborationItem } from "@/lib/dashboard/get-startup-collaborations";
import { EndCollaborationButton } from "@/components/dashboard/shared/EndCollaborationButton";

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

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-600",
  BUSY: "bg-amber-50 text-amber-600",
  PAUSED: "bg-gray-100 text-gray-500",
};

export function ActiveCollaborationCard({
  item,
}: {
  item: StartupCollaborationItem;
}) {
  return (
    <div className="rounded-[10px] border border-[#E8EBF0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,.06),0_1px_8px_rgba(0,0,0,.04)]">
      <div className="mb-[14px] flex items-center gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-bold text-white"
          style={{ background: gradientFor(item.id) }}
        >
          {initialsFrom(item.expertName)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-bold text-[#1A1D23]">
            {item.expertName}
          </div>
          <div className="truncate text-[12px] text-[#9CA3AF]">
            {item.roleTitle}
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-[8px] py-[2px] text-[11px] font-semibold ${STATUS_BADGE[item.status] ?? "bg-gray-100 text-gray-500"}`}
        >
          {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
        </span>
      </div>

      {/* Proiect curent — onest: dacă nu e setat încă, spunem asta,
          nu inventăm un titlu. Colaborarea se naște fără proiect (pasul 4). */}
      <div className="mb-[6px] text-[12px] text-[#6B7280]">
        {item.currentProjectTitle ? (
          <>
            <span className="text-[#9CA3AF]">Current project: </span>
            {item.currentProjectTitle}
          </>
        ) : (
          <span className="italic text-[#9CA3AF]">No project assigned yet</span>
        )}
      </div>

      {/* Workload bar — doar dacă e setat; altfel îl omitem, nu afișăm 0% fals */}
      {item.workloadPercent != null ? (
        <>
          <div className="mb-[6px] text-[11px] text-[#9CA3AF]">
            Workload: {item.workloadPercent}%
          </div>
          <div className="mb-[14px] h-[6px] w-full overflow-hidden rounded-full bg-[#EFF1F4]">
            <div
              className="h-full rounded-full bg-[#2563EB]"
              style={{ width: `${Math.min(item.workloadPercent, 100)}%` }}
            />
          </div>
        </>
      ) : (
        <div className="mb-[14px]" />
      )}

      <div className="flex items-center justify-between text-[12px]">
        <span className="text-[#9CA3AF]">
          {item.hourlyRateUsd != null
            ? `$${item.hourlyRateUsd} / hour`
            : "Rate not set"}
        </span>
        {!item.onPlatform && (
          <span className="rounded-full bg-[#F3F4F6] px-[7px] py-[2px] text-[10.5px] font-medium text-[#6B7280]">
            External
          </span>
        )}
      </div>

      <div className="mt-[14px] flex justify-end border-t border-[#F1F3F5] pt-[14px]">
        <EndCollaborationButton
          collaborationId={item.id}
          counterpartLabel="expert"
        />
      </div>
    </div>
  );
}
