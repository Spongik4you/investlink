import { prisma } from "@/lib/prisma";
import { normalizeLabels } from "@/lib/text/normalize-label";

/**
 * Ce caută EFECTIV startup-urile de pe platformă, chiar acum.
 *
 * Simetric cu getExpertCategories de pe pagina /startups: acolo expertul e
 * oferta, aici e cererea. Un specialist care aterizează pe /experts vede
 * imediat dacă abilitățile lui sunt căutate — informație pe care nicio
 * listă hardcodată n-o poate da.
 *
 * Fără numărători, din același motiv: o listă de nevoi e utilă la orice
 * scară, un „2 startup-uri caută Design" ar semnala doar că platforma e goală.
 */
export async function getStartupNeeds(): Promise<string[]> {
  const rows = await prisma.startupProfile.findMany({
    where: { expertNeeds: { isEmpty: false } },
    select: { expertNeeds: true },
    orderBy: { updatedAt: "desc" },
    take: 40,
  });

  const all = rows.flatMap((r) => r.expertNeeds);
  return normalizeLabels(all).slice(0, 12);
}
