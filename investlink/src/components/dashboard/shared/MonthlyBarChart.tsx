"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Grafic cu bare lunare, partajat între dashboard-ul startup („cât am strâns
 * în fiecare lună") și cel al investitorului („cât am desfășurat"). Aceeași
 * formă de date, texte parametrizate.
 */
export type MonthlyPoint = {
  month: string;
  label: string;
  totalUsd: number;
};

function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

export function MonthlyBarChart({
  data,
  zeroLabel,
  emptyMessage,
  height = 240,
}: {
  data: MonthlyPoint[];
  /** Text în tooltip pentru o lună fără activitate. */
  zeroLabel: string;
  /** Mesaj când nu există absolut nicio dată în perioadă. */
  emptyMessage: string;
  height?: number;
}) {
  const hasAny = data.some((d) => d.totalUsd > 0);

  if (!hasAny) {
    return (
      <div
        className="flex items-center justify-center rounded-[10px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-4 text-center text-[12.5px] text-[#9CA3AF]"
        style={{ height }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#9CA3AF" }}
          tickLine={false}
          axisLine={{ stroke: "#E8EBF0" }}
          interval="preserveStartEnd"
          minTickGap={8}
        />
        <YAxis
          tickFormatter={formatUsd}
          tick={{ fontSize: 11, fill: "#9CA3AF" }}
          tickLine={false}
          axisLine={false}
          width={52}
        />
        <Tooltip
          cursor={{ fill: "#F9FAFB" }}
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            const p = payload[0].payload as MonthlyPoint;
            return (
              <div className="rounded-[8px] border border-[#E8EBF0] bg-white px-3 py-2 shadow-lg">
                <div className="text-[11px] text-[#9CA3AF]">{p.label}</div>
                <div className="text-[14px] font-bold text-[#1A1D23]">
                  {p.totalUsd > 0 ? formatUsd(p.totalUsd) : zeroLabel}
                </div>
              </div>
            );
          }}
        />
        <Bar
          dataKey="totalUsd"
          fill="#2563EB"
          radius={[5, 5, 0, 0]}
          maxBarSize={44}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
