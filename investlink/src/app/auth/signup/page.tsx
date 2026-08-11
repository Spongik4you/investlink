import SignUpClient from "@/components/onboarding/SignUpClient";

type Role = "STARTUP" | "INVESTOR" | "EXPERT";

/**
 * Rolul din URL e o SUGESTIE (din butoanele de pe landing), nu un angajament.
 * Signup rămâne email+parolă; rolul se alege la pasul 0 al onboarding-ului,
 * unde sugestia doar pre-selectează cardul.
 */
function normalizeSuggestion(role: string | undefined): Role | undefined {
  const c = (role ?? "").toUpperCase();
  if (c === "EXPERT" || c === "INVESTOR" || c === "STARTUP") return c;
  return undefined;
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  return <SignUpClient roleSuggestion={normalizeSuggestion(params.role)} />;
}
