"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CumulativePoint } from "@/lib/dashboard/get-investment-analytics";

type Range = "3M" | "6M" | "1Y" | "ALL";

const RANGES: { key: Range; label: string; months: number | null }[] = [
  { key: "3M", label: "3M", months: 3 },
  { key: "6M", label: "6M", months: 6 },
  { key: "1Y", label: "1Y", months: 12 },
  { key: "ALL", label: "All", months: null },
];

function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { date: string; cumulativeUsd: number } }>;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-[8px] border border-[#E8EBF0] bg-white px-3 py-2 shadow-lg">
      <div className="text-[11px] text-[#9CA3AF]">{formatDate(p.date)}</div>
      <div className="text-[14px] font-bold text-[#1A1D23]">
        {formatUsd(p.cumulativeUsd)}
      </div>
    </div>
  );
}

export function CumulativeChart({ data }: { data: CumulativePoint[] }) {
  const [range, setRange] = useState<Range>("ALL");

  const filtered = useMemo(() => {
    if (data.length === 0) return [];
    const cfg = RANGES.find((r) => r.key === range);
    if (!cfg || cfg.months == null) return data;
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - cfg.months);
    const inRange = data.filter((d) => new Date(d.date) >= cutoff);
    // Dacă filtrarea lasă < 2 puncte, arătăm tot (un interval gol nu ajută).
    return inRange.length >= 2 ? inRange : data;
  }, [data, range]);

  const chartData = useMemo(
    () =>
      filtered.map((d) => ({
        date: d.date,
        label: formatDate(d.date),
        cumulativeUsd: d.cumulativeUsd,
      })),
    [filtered],
  );

  if (data.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center rounded-[10px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] text-[13px] text-[#9CA3AF]">
        No investment data yet.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[15px] font-bold text-[#1A1D23]">
            Capital over time
          </div>
          <div className="text-[12px] text-[#9CA3AF]">
            Cumulative capital raised.
          </div>
        </div>
        <div className="flex gap-1 rounded-[8px] bg-[#F3F4F6] p-[3px]">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`rounded-[6px] px-[10px] py-[4px] text-[12px] font-semibold transition ${
                range === r.key
                  ? "bg-white text-[#2563EB] shadow-sm"
                  : "text-[#9CA3AF] hover:text-[#374151]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="capitalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            tickLine={false}
            axisLine={{ stroke: "#E8EBF0" }}
            minTickGap={30}
          />
          <YAxis
            tickFormatter={formatUsd}
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            tickLine={false}
            axisLine={false}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="cumulativeUsd"
            stroke="#2563EB"
            strokeWidth={2.5}
            fill="url(#capitalGradient)"
            dot={{ r: 3, fill: "#2563EB" }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
