import SignUpClient from "@/components/onboarding/SignUpClient";

type Role = "STARTUP" | "INVESTOR" | "EXPERT";

function normalizeRole(role: string | undefined): Role {
  const candidate = (role ?? "STARTUP").toUpperCase();
  if (candidate === "EXPERT" || candidate === "INVESTOR" || candidate === "STARTUP") {
    return candidate;
  }

  return "STARTUP";
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const role = normalizeRole(params.role);

  return <SignUpClient role={role} />;
}
