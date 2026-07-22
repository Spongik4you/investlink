import { Inbox } from "lucide-react";
import type { StartupInvestmentInterestsData } from "@/lib/dashboard/get-startup-investment-interests";
import { InvestmentInterestCard } from "./InvestmentInterestCard";

export function InvestmentInterestsSection({
  data,
}: {
  data: StartupInvestmentInterestsData;
}) {
  return (
    <section>
      <div className="mb-1 flex items-center gap-2 text-[15px] font-bold text-[#1A1D23]">
        Investor Interest
        {data.pendingCount > 0 && (
          <span className="rounded-full bg-[#2563EB] px-[8px] py-[1px] text-[11px] font-semibold text-white">
            {data.pendingCount}
          </span>
        )}
      </div>
      <div className="mb-4 text-[12.5px] text-[#9CA3AF]">
        Investors interested in your startup. Accept to start a conversation.
      </div>

      {data.pending.length === 0 ? (
        <div className="mb-8 flex flex-col items-center justify-center rounded-[10px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-5 py-10 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF4FF]">
            <Inbox className="h-5 w-5 text-[#2563EB]" />
          </div>
          <div className="mb-1 text-[13.5px] font-semibold text-[#374151]">
            No pending interest
          </div>
          <p className="max-w-sm text-[12.5px] text-[#9CA3AF]">
            When an investor expresses interest, it appears here.
          </p>
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.pending.map((i) => (
            <InvestmentInterestCard key={i.id} interest={i} interactive />
          ))}
        </div>
      )}

      {data.responded.length > 0 && (
        <>
          <div className="mb-1 text-[15px] font-bold text-[#1A1D23]">History</div>
          <div className="mb-4 text-[12.5px] text-[#9CA3AF]">
            Interest you&apos;ve already responded to.
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.responded.map((i) => (
              <InvestmentInterestCard key={i.id} interest={i} interactive={false} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
