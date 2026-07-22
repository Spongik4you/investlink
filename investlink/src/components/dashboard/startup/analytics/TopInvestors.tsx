import type { TopInvestorItem } from "@/lib/dashboard/get-investment-analytics";

function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n.toLocaleString("en-US")}`;
}

export function TopInvestors({ data }: { data: TopInvestorItem[] }) {
  const max = data.length > 0 ? data[0].totalUsd : 0;

  return (
    <div>
      <div className="mb-3">
        <div className="text-[15px] font-bold text-[#1A1D23]">Top investors</div>
        <div className="text-[12px] text-[#9CA3AF]">Ranked by total invested.</div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center rounded-[10px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] text-[12.5px] text-[#9CA3AF]">
          No investments recorded yet.
        </div>
      ) : (
        <div className="space-y-[14px]">
          {data.map((inv, i) => (
            <div key={`${inv.name}-${i}`}>
              <div className="mb-[5px] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1A1D23]">
                  {inv.name}
                  {!inv.onPlatform && (
                    <span className="rounded-full bg-[#F3F4F6] px-[6px] py-[1px] text-[10px] font-medium text-[#6B7280]">
                      External
                    </span>
                  )}
                </div>
                <span className="text-[13px] font-semibold text-[#2563EB]">
                  {formatUsd(inv.totalUsd)}
                </span>
              </div>
              <div className="h-[7px] w-full overflow-hidden rounded-full bg-[#EFF1F4]">
                <div
                  className="h-full rounded-full bg-[#2563EB]"
                  style={{ width: `${max > 0 ? (inv.totalUsd / max) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
