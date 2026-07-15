import { Briefcase } from "lucide-react";
import type { ExpertCollaborationsData } from "@/lib/dashboard/get-expert-collaborations";
import { EndCollaborationButton } from "@/components/dashboard/shared/EndCollaborationButton";

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-600",
  BUSY: "bg-amber-50 text-amber-600",
  PAUSED: "bg-gray-100 text-gray-500",
  COMPLETED: "bg-blue-50 text-blue-600",
  CANCELLED: "bg-red-50 text-red-500",
};

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`shrink-0 rounded-full px-[8px] py-[2px] text-[11px] font-semibold ${STATUS_BADGE[status] ?? "bg-gray-100 text-gray-500"}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export function ExpertPortfolioSection({
  data,
}: {
  data: ExpertCollaborationsData;
}) {
  return (
    <div className="space-y-10">
      {/* Active */}
      <section>
        <div className="mb-1 flex items-center gap-2 text-[15px] font-bold text-[#1A1D23]">
          Active Collaborations
          {data.activeCount > 0 && (
            <span className="rounded-full bg-[#2563EB] px-[8px] py-[1px] text-[11px] font-semibold text-white">
              {data.activeCount}
            </span>
          )}
        </div>
        <div className="mb-4 text-[12.5px] text-[#9CA3AF]">
          Startups you&apos;re currently working with.
        </div>

        {data.active.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-5 py-10 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF4FF]">
              <Briefcase className="h-5 w-5 text-[#2563EB]" />
            </div>
            <div className="mb-1 text-[13.5px] font-semibold text-[#374151]">
              No active collaborations
            </div>
            <p className="max-w-sm text-[12.5px] text-[#9CA3AF]">
              When you accept a startup&apos;s invitation, it appears here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.active.map((c) => (
              <div
                key={c.id}
                className="flex flex-col rounded-[10px] border border-[#E8EBF0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,.06),0_1px_8px_rgba(0,0,0,.04)]"
              >
                <div className="mb-[14px] flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#EFF4FF] text-[14px] font-bold text-[#2563EB]">
                    {initialsFrom(c.startupName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-bold text-[#1A1D23]">
                      {c.startupName}
                    </div>
                    <div className="truncate text-[12px] text-[#9CA3AF]">
                      {c.roleTitle}
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>

                <div className="mb-[14px] text-[12px] text-[#6B7280]">
                  {c.currentProjectTitle ? (
                    <>
                      <span className="text-[#9CA3AF]">Current project: </span>
                      {c.currentProjectTitle}
                    </>
                  ) : (
                    <span className="italic text-[#9CA3AF]">
                      No project assigned yet
                    </span>
                  )}
                </div>

                <div className="mt-auto flex justify-end border-t border-[#F1F3F5] pt-[14px]">
                  <EndCollaborationButton
                    collaborationId={c.id}
                    counterpartLabel="startup"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* History */}
      {data.past.length > 0 && (
        <section>
          <div className="mb-1 text-[15px] font-bold text-[#1A1D23]">
            Past Collaborations
          </div>
          <div className="mb-4 text-[12.5px] text-[#9CA3AF]">
            Completed and cancelled collaborations.
          </div>

          <div className="overflow-hidden rounded-[10px] border border-[#E8EBF0] bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8EBF0] bg-[#F9FAFB] text-left">
                  <th className="px-4 py-[10px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                    Startup
                  </th>
                  <th className="px-4 py-[10px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                    Role
                  </th>
                  <th className="px-4 py-[10px] text-right text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                    Outcome
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.past.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-[#F1F3F5] last:border-0"
                  >
                    <td className="px-4 py-3 text-[13px] font-semibold text-[#1A1D23]">
                      {c.startupName}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#6B7280]">
                      {c.roleTitle}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <StatusBadge status={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
