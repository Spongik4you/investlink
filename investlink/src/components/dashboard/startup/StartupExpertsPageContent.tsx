import { Users } from "lucide-react";
import type {
  StartupCollaborationsData,
} from "@/lib/dashboard/get-startup-collaborations";
import type {
  ExpertDirectoryCard,
} from "@/lib/dashboard/get-expert-directory";
import { ActiveCollaborationCard } from "./ActiveCollaborationCard";
import { ExpertDirectorySection } from "./ExpertDirectorySection";
import { WithdrawInvitationButton } from "./WithdrawInvitationButton";

const SENT_STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-600",
  ACCEPTED: "bg-green-50 text-green-600",
  DECLINED: "bg-red-50 text-red-500",
  WITHDRAWN: "bg-gray-100 text-gray-500",
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

export function StartupExpertsPageContent({
  collaborations,
  experts,
  categories,
}: {
  collaborations: StartupCollaborationsData;
  experts: ExpertDirectoryCard[];
  categories: string[];
}) {
  return (
    <div className="space-y-10">
      {/* ── SECȚIUNEA 1: Active Experts ── */}
      <section>
        <div className="mb-1 flex items-center gap-2 text-[15px] font-bold text-[#1A1D23]">
          Active Experts
          {collaborations.activeCount > 0 && (
            <span className="rounded-full bg-[#2563EB] px-[8px] py-[1px] text-[11px] font-semibold text-white">
              {collaborations.activeCount}
            </span>
          )}
        </div>
        <div className="mb-4 text-[12.5px] text-[#9CA3AF]">
          Experts currently collaborating with your startup.
        </div>

        {collaborations.active.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-5 py-10 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF4FF]">
              <Users className="h-5 w-5 text-[#2563EB]" />
            </div>
            <div className="mb-1 text-[13.5px] font-semibold text-[#374151]">
              No active collaborations yet
            </div>
            <p className="max-w-sm text-[12.5px] text-[#9CA3AF]">
              When an expert accepts your invitation, they appear here. Invite
              specialists from the directory below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collaborations.active.map((item) => (
              <ActiveCollaborationCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* ── SECȚIUNEA 2: Sent Invitations ── */}
      {collaborations.sentInvitations.length > 0 && (
        <section>
          <div className="mb-1 flex items-center gap-2 text-[15px] font-bold text-[#1A1D23]">
            Sent Invitations
            {collaborations.pendingSentCount > 0 && (
              <span className="rounded-full bg-amber-500 px-[8px] py-[1px] text-[11px] font-semibold text-white">
                {collaborations.pendingSentCount} pending
              </span>
            )}
          </div>
          <div className="mb-4 text-[12.5px] text-[#9CA3AF]">
            Track the status of invitations you&apos;ve sent.
          </div>

          <div className="overflow-hidden rounded-[10px] border border-[#E8EBF0] bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8EBF0] bg-[#F9FAFB] text-left">
                  <th className="px-4 py-[10px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                    Expert
                  </th>
                  <th className="px-4 py-[10px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                    Role
                  </th>
                  <th className="px-4 py-[10px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                    Sent
                  </th>
                  <th className="px-4 py-[10px] text-right text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                    Status
                  </th>
                  <th className="px-4 py-[10px] text-right text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {collaborations.sentInvitations.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-[#F1F3F5] last:border-0"
                  >
                    <td className="px-4 py-3 text-[13px] font-semibold text-[#1A1D23]">
                      {inv.expertName}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#6B7280]">
                      {inv.roleTitle}
                    </td>
                    <td className="px-4 py-3 text-[12.5px] text-[#9CA3AF]">
                      {formatDate(inv.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`rounded-full px-[8px] py-[2px] text-[11px] font-semibold ${SENT_STATUS_STYLE[inv.status] ?? ""}`}
                      >
                        {inv.status.charAt(0) +
                          inv.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {/* Withdraw doar pe PENDING — celelalte stări sunt
                          finale, nu mai au acțiune. */}
                      {inv.status === "PENDING" ? (
                        <WithdrawInvitationButton invitationId={inv.id} />
                      ) : (
                        <span className="text-[11px] text-[#D1D5DB]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── SECȚIUNEA 3: Discover (directorul existent) ── */}
      <ExpertDirectorySection experts={experts} categories={categories} />
    </div>
  );
}
