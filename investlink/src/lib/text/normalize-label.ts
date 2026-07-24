/**
 * Normalizează etichetele introduse de utilizatori (categorii, nevoi, tipuri
 * de colaborare) înainte de a le afișa pe paginile publice.
 *
 * Utilizatorii scriu cum vor la onboarding: „ui/ux design", „GROWTH",
 * „Product management". Afișate una lângă alta arată neîngrijit.
 *
 * DAR Title Case simplu strică exact cuvintele unde contează cel mai mult:
 * „AI & ML" → „Ai & Ml", „CTO" → „Cto", „UX/UI" → „Ux/Ui". De aceea sunt
 * două excepții:
 *   1. token deja ALL-CAPS și scurt (≤5 litere) → lăsat neatins
 *   2. acronim cunoscut, scris oricum → ridicat la majuscule
 * Restul primesc Prima Literă Mare.
 */

/**
 * Acronime cunoscute, cu forma LOR canonică — nu doar majuscule.
 * „saas" trebuie să devină „SaaS", nu „SAAS".
 */
const KNOWN_ACRONYMS = new Map<string, string>(
  [
    "AI", "ML", "UX", "UI", "HR", "IT", "QA", "PR", "VC", "KPI",
    "CTO", "CEO", "CFO", "COO", "CMO", "SEO", "SEM", "API", "SDK",
    "B2B", "B2C", "D2C", "ROI", "CRM", "ERP", "NLP", "LLM",
    "AR", "VR", "IoT", "ESG", "IP", "GTM", "SaaS", "PaaS", "IaaS",
  ].map((a) => [a.toLowerCase(), a]),
);

/** Separatorii peste care păstrăm forma originală (spațiu, /, -, &, .). */
const SPLIT_RE = /([\s/\-&.]+)/;

function normalizeToken(token: string): string {
  if (!token) return token;

  // Deja ALL-CAPS și scurt → probabil acronim scris corect de utilizator.
  if (token.length <= 5 && token === token.toUpperCase() && /[A-Z]/.test(token)) {
    return token;
  }

  const lower = token.toLowerCase();
  const canonical = KNOWN_ACRONYMS.get(lower);
  if (canonical) return canonical;

  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function normalizeLabel(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;

  return trimmed
    .split(SPLIT_RE)
    .map((part) => (SPLIT_RE.test(part) ? part : normalizeToken(part)))
    .join("")
    .replace(/\s+/g, " ");
}

/** Normalizează o listă și elimină duplicatele apărute după normalizare. */
export function normalizeLabels(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const norm = normalizeLabel(item);
    const key = norm.toLowerCase();
    if (norm && !seen.has(key)) {
      seen.add(key);
      out.push(norm);
    }
  }
  return out;
}
