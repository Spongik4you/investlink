import { Inbox } from "lucide-react";
import type { StartupApplicationsData } from "@/lib/dashboard/get-startup-applications";
import { ApplicationCard } from "./ApplicationCard";

export function StartupApplicationsSection({
  data,
}: {
  data: StartupApplicationsData;
}) {
  return (
    <section>
      <div className="mb-1 flex items-center gap-2 text-[15px] font-bold text-[#1A1D23]">
        Applications Received
        {data.pendingCount > 0 && (
          <span className="rounded-full bg-[#2563EB] px-[8px] py-[1px] text-[11px] font-semibold text-white">
            {data.pendingCount}
          </span>
        )}
      </div>
      <div className="mb-4 text-[12.5px] text-[#9CA3AF]">
        Experts who applied to work with your startup. Accept or decline each.
      </div>

      {data.pending.length === 0 ? (
        <div className="mb-8 flex flex-col items-center justify-center rounded-[10px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-5 py-10 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF4FF]">
            <Inbox className="h-5 w-5 text-[#2563EB]" />
          </div>
          <div className="mb-1 text-[13.5px] font-semibold text-[#374151]">
            No pending applications
          </div>
          <p className="max-w-sm text-[12.5px] text-[#9CA3AF]">
            When an expert applies to work with you, it appears here. Experts
            find you through their startup directory.
          </p>
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.pending.map((app) => (
            <ApplicationCard key={app.id} application={app} interactive />
          ))}
        </div>
      )}

      {data.responded.length > 0 && (
        <>
          <div className="mb-1 text-[15px] font-bold text-[#1A1D23]">
            History
          </div>
          <div className="mb-4 text-[12.5px] text-[#9CA3AF]">
            Applications you&apos;ve already responded to.
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.responded.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                interactive={false}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
