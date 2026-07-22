"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RoundBreakdownItem } from "@/lib/dashboard/get-investment-analytics";

const COLORS = ["#2563EB", "#7C3AED", "#059669", "#F59E0B", "#EC4899", "#9CA3AF"];

function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: RoundBreakdownItem }>;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-[8px] border border-[#E8EBF0] bg-white px-3 py-2 shadow-lg">
      <div className="text-[12px] font-semibold text-[#1A1D23]">{p.round}</div>
      <div className="text-[13px] font-bold text-[#2563EB]">
        {formatUsd(p.totalUsd)}
      </div>
      <div className="text-[11px] text-[#9CA3AF]">
        {p.count} {p.count === 1 ? "investment" : "investments"}
      </div>
    </div>
  );
}

export function RoundBreakdown({
  data,
  hasAnyRoundDeclared,
}: {
  data: RoundBreakdownItem[];
  hasAnyRoundDeclared: boolean;
}) {
  return (
    <div>
      <div className="mb-3">
        <div className="text-[15px] font-bold text-[#1A1D23]">By round</div>
        <div className="text-[12px] text-[#9CA3AF]">
          Capital raised per funding round.
        </div>
      </div>

      {!hasAnyRoundDeclared ? (
        <div className="flex h-[220px] items-center justify-center rounded-[10px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-4 text-center text-[12.5px] text-[#9CA3AF]">
          No rounds specified yet. Add a round when recording an investment to
          see the breakdown.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" vertical={false} />
            <XAxis
              dataKey="round"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={{ stroke: "#E8EBF0" }}
            />
            <YAxis
              tickFormatter={formatUsd}
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={false}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F9FAFB" }} />
            <Bar dataKey="totalUsd" radius={[6, 6, 0, 0]} maxBarSize={80}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
