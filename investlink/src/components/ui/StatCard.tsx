import type { LucideIcon } from "lucide-react";
import IconCircle from "./IconCircle";

export default function StatCard({
  Icon,
  value,
  label,
  tone = "blue",
}: {
  Icon: LucideIcon;
  value: string;
  label: string;
  tone?: "blue" | "green" | "purple";
}) {
  return (
    <div
      className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition
                 hover:-translate-y-1 hover:shadow-lg hover:border-slate-200"
    >
      <IconCircle Icon={Icon} tone={tone} />
      <div className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900">{value}</div>
      <div className="mt-2 text-lg text-slate-600">{label}</div>
    </div>
  );
}
