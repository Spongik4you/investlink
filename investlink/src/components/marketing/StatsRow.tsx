import { Users, Rocket, Globe, TrendingUp } from "lucide-react";
import IconCircle from "@/components/ui/IconCircle";

type StatProps = {
  value: string;
  label: string;
  Icon: any;
};

const Stat = ({ value, label, Icon }: StatProps) => (
  <div
    className="
      rounded-xl border border-slate-100 bg-white p-4 text-center
      shadow-sm transition
      hover:-translate-y-1 hover:shadow-lg hover:border-slate-200
    "
  >
    {/* icon circle (ca in foto 2) */}
    <IconCircle Icon={Icon} tone="blue" />

    {/* value */}
    <div className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
      {value}
    </div>

    {/* label */}
    <div className="mt-3 text-sm text-slate-600">{label}</div>
  </div>
);

export default function StatsRow() {
  return (
    <div className="mx-auto mt-5 grid max-w-5l gap-6 md:grid-cols-4">
      <Stat Icon={Users} value="5,000+" label="Active Investors" />
      <Stat Icon={Rocket} value="1,200+" label="Funded Startups" />
      <Stat Icon={Globe} value="15,000+" label="Global Experts" />
      <Stat Icon={TrendingUp} value="$500M+" label="Total Investment" />
    </div>
  );
}
