import { Inbox } from "lucide-react";
import type { ExpertInvitationsData } from "@/lib/dashboard/get-expert-invitations";
import { InvitationCard } from "./InvitationCard";

export function ExpertInvitationsSection({
  data,
}: {
  data: ExpertInvitationsData;
}) {
  const hasAny = data.pending.length > 0 || data.responded.length > 0;

  return (
    <section>
      <div className="mb-1 flex items-center gap-2 text-[15px] font-bold text-[#1A1D23]">
        Pending Invitations
        {data.pendingCount > 0 && (
          <span className="rounded-full bg-[#2563EB] px-[8px] py-[1px] text-[11px] font-semibold text-white">
            {data.pendingCount}
          </span>
        )}
      </div>
      <div className="mb-4 text-[12.5px] text-[#9CA3AF]">
        Startups inviting you to collaborate. Accept or decline each one.
      </div>

      {data.pending.length === 0 ? (
        <div className="mb-8 flex flex-col items-center justify-center rounded-[10px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-5 py-10 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF4FF]">
            <Inbox className="h-5 w-5 text-[#2563EB]" />
          </div>
          <div className="mb-1 text-[13.5px] font-semibold text-[#374151]">
            No pending invitations
          </div>
          <p className="max-w-sm text-[12.5px] text-[#9CA3AF]">
            When a startup invites you, it appears here. A complete profile
            attracts more invitations.
          </p>
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.pending.map((inv) => (
            <InvitationCard key={inv.id} invitation={inv} interactive />
          ))}
        </div>
      )}

      {data.responded.length > 0 && (
        <>
          <div className="mb-1 text-[15px] font-bold text-[#1A1D23]">
            History
          </div>
          <div className="mb-4 text-[12.5px] text-[#9CA3AF]">
            Invitations you&apos;ve already responded to.
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.responded.map((inv) => (
              <InvitationCard
                key={inv.id}
                invitation={inv}
                interactive={false}
              />
            ))}
          </div>
        </>
      )}

      {!hasAny && null}
    </section>
  );
}
