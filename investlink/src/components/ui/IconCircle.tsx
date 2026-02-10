import type { LucideIcon } from "lucide-react";

export default function IconCircle({
  Icon,
  tone = "blue",
}: {
  Icon: LucideIcon;
  tone?: "blue" | "green" | "purple";
}) {
  const cls =
    tone === "green"
      ? "bg-green-50 text-green-700"
      : tone === "purple"
      ? "bg-purple-50 text-purple-700"
      : "bg-blue-50 text-blue-700";

  return (
    <div className={`mx-auto grid h-13 w-13 place-items-center rounded-full ${cls}`}>
      <Icon className="h-7 w-7" strokeWidth={2.2} />
    </div>
  );
}
