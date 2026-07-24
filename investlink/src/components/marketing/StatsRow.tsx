import { Users, Rocket, Globe, TrendingUp, type LucideIcon } from "lucide-react";
import IconCircle from "@/components/ui/IconCircle";
import type { PlatformStats } from "@/lib/marketing/get-platform-stats";

type StatProps = {
  value: string;
  label: string;
  Icon: LucideIcon;
};

const Stat = ({ value, label, Icon }: StatProps) => (
  <div className="rounded-xl border border-slate-100 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-slate-200 hover:shadow-lg">
    <IconCircle Icon={Icon} tone="blue" />
    <div className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
      {value}
    </div>
    <div className="mt-3 text-sm text-slate-600">{label}</div>
  </div>
);

function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1_000) return `${Math.floor(n / 1_000)}k+`;
  return String(n);
}

function money(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1_000) return `$${Math.floor(n / 1_000)}k+`;
  return `$${n}`;
}

/**
 * Statistici REALE, afișate doar peste prag (vezi get-platform-stats).
 * Sub prag componenta nu randează nimic — pagina rămâne curată, iar secțiunea
 * apare singură când cifrele devin semnificative.
 */
export default function StatsRow({ stats }: { stats: PlatformStats }) {
  if (!stats.meetsThreshold) return null;

  return (
    <div className="max-w-5l mx-auto mt-5 grid gap-6 md:grid-cols-4">
      <Stat Icon={Users} value={compact(stats.investors)} label="Investors" />
      <Stat Icon={Rocket} value={compact(stats.startups)} label="Startups" />
      <Stat Icon={Globe} value={compact(stats.experts)} label="Experts" />
      <Stat
        Icon={TrendingUp}
        value={money(stats.totalInvestedUsd)}
        label="Investment recorded"
      />
    </div>
  );
}
