export default function Badge({
  text,
  tone = "blue",
}: {
  text: string;
  tone?: "blue" | "green" | "purple";
}) {
  const toneClasses =
    tone === "green"
      ? "border-green-100 bg-green-50 text-green-700"
      : tone === "purple"
      ? "border-purple-100 bg-purple-50 text-purple-700"
      : "border-blue-100 bg-blue-50 text-blue-700";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs font-semibold ${toneClasses}`}>
      {text}
    </span>
  );
}
