import { prisma } from "@/lib/prisma";
import { normalizeLabels } from "@/lib/text/normalize-label";

/**
 * Categoriile de experți prezente EFECTIV pe platformă.
 *
 * Macheta avea o grilă hardcodată de 12 domenii („Blockchain", „HR &
 * Recruiting"…) — decor, nu informație. Astea sunt reale: un fondator vede ce
 * specializări există acum.
 *
 * Afișăm doar NUMELE, fără numărători: o listă de domenii e utilă la orice
 * scară, dar „2 experți în Design" ar semnala doar că platforma e goală.
 */
export async function getExpertCategories(): Promise<string[]> {
  const rows = await prisma.expertProfile.findMany({
    where: { primaryCategory: { not: null } },
    select: { primaryCategory: true },
    distinct: ["primaryCategory"],
    orderBy: { primaryCategory: "asc" },
    take: 12,
  });

  // Normalizate: utilizatorii scriu „ui/ux design" sau „GROWTH" la onboarding;
  // pe pagina publică apar consistent, cu acronimele păstrate.
  return normalizeLabels(
    rows.map((r) => r.primaryCategory).filter((c): c is string => !!c?.trim()),
  );
}
