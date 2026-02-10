import type { LucideIcon } from "lucide-react";

export default function IconTile({
  Icon,
  tone,
}: {
  Icon: LucideIcon;
  tone: "red" | "orange" | "purple";
}) {
  const styles =
    tone === "red"
      ? "bg-red-50 text-red-600"
      : tone === "orange"
      ? "bg-orange-50 text-orange-600"
      : "bg-purple-50 text-purple-600";

  return (
    <div className={`mb-2 inline-flex h-12 w-12 items-center justify-center rounded-md ${styles}`}>
      <Icon className="h-6 w-6" strokeWidth={2.2} />
    </div>
  );
}
