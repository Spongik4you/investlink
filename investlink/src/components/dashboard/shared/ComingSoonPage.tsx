import { Construction } from "lucide-react";

/**
 * Placeholder onest pentru rutele de meniu care încă nu au model de date.
 * Scopul: meniul nu are link-uri moarte (fiecare rută duce la o pagină reală),
 * dar nici nu minte utilizatorul cu date inventate. Se înlocuiește cu pagina
 * reală când modelul din spate există.
 */
export function ComingSoonPage({
  feature,
  description,
}: {
  feature: string;
  description?: string;
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[10px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF4FF]">
        <Construction className="h-6 w-6 text-[#2563EB]" />
      </div>
      <h2 className="mb-2 text-[17px] font-bold text-[#1A1D23]">
        {feature} — coming soon
      </h2>
      <p className="max-w-md text-[13px] text-[#9CA3AF]">
        {description ??
          "This section is being built. It will appear here once the underlying data is available."}
      </p>
    </div>
  );
}
