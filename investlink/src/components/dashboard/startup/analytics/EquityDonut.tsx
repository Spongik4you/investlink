"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AlertTriangle } from "lucide-react";
import type { EquityBreakdown } from "@/lib/dashboard/get-investment-analytics";

const ALLOCATED_COLOR = "#2563EB";
const RETAINED_COLOR = "#E5EAF2";

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0];
  return (
    <div className="rounded-[8px] border border-[#E8EBF0] bg-white px-3 py-2 shadow-lg">
      <div className="text-[12px] font-semibold text-[#1A1D23]">{p.name}</div>
      <div className="text-[13px] font-bold text-[#2563EB]">{p.value}%</div>
    </div>
  );
}

export function EquityDonut({
  data,
  hasAnyEquityDeclared,
}: {
  data: EquityBreakdown;
  hasAnyEquityDeclared: boolean;
}) {
  const chartData = [
    { name: "Allocated to investors", value: data.allocatedPercent },
    { name: "Retained", value: data.retainedPercent },
  ];

  return (
    <div>
      <div className="mb-3">
        <div className="text-[15px] font-bold text-[#1A1D23]">
          Equity distribution
        </div>
        <div className="text-[12px] text-[#9CA3AF]">
          Allocated to investors vs. retained.
        </div>
      </div>

      {!hasAnyEquityDeclared ? (
        <div className="flex h-[200px] items-center justify-center rounded-[10px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-4 text-center text-[12.5px] text-[#9CA3AF]">
          No equity declared yet. Add equity % when recording an investment.
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <div className="relative h-[160px] w-[160px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={1}
                >
                  <Cell fill={ALLOCATED_COLOR} />
                  <Cell fill={RETAINED_COLOR} />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-[20px] font-bold text-[#1A1D23]">
                {data.allocatedPercent}%
              </div>
              <div className="text-[10px] text-[#9CA3AF]">allocated</div>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-sm"
                  style={{ background: ALLOCATED_COLOR }}
                />
                <span className="text-[12.5px] text-[#374151]">
                  Allocated to investors
                </span>
              </div>
              <span className="text-[12.5px] font-semibold text-[#1A1D23]">
                {data.allocatedPercent}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-sm"
                  style={{ background: RETAINED_COLOR }}
                />
                <span className="text-[12.5px] text-[#374151]">Retained</span>
              </div>
              <span className="text-[12.5px] font-semibold text-[#1A1D23]">
                {data.retainedPercent}%
              </span>
            </div>

            {data.overAllocated && (
              <div className="flex items-start gap-2 rounded-[7px] bg-[#FEF2F2] px-3 py-2 text-[11.5px] text-[#DC2626]">
                <AlertTriangle className="mt-[1px] h-[14px] w-[14px] shrink-0" />
                <span>
                  Allocated equity exceeds 100% — check your recorded equity
                  values.
                </span>
              </div>
            )}

            <p className="text-[11px] leading-relaxed text-[#9CA3AF]">
              Based on {data.investmentsWithEquity}{" "}
              {data.investmentsWithEquity === 1 ? "investment" : "investments"}{" "}
              with declared equity. &ldquo;Retained&rdquo; is what hasn&apos;t
              been allocated through recorded investments.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
