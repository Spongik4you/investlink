import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { RoleOnboardingForm } from "@/components/onboarding/RoleOnboardingForm";
import { authOptions } from "@/lib/auth";

export default async function InvestorOnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/auth/signin");
  if (session.user.type !== "INVESTOR") redirect("/auth/continue");
  if (session.user.onboardingStatus === "COMPLETED") redirect("/dashboard/investor");

  return (
    <RoleOnboardingForm
      role="INVESTOR"
      title="Investor onboarding"
      description="Configurează profilul tău de investiții pentru matching relevant."
      submitLabel="Complete onboarding"
      dashboardPath="/dashboard/investor"
      fields={[
        { name: "investorType", label: "Investor type", placeholder: "Angel / VC / Syndicate" },
        { name: "budgetRange", label: "Budget range", placeholder: "€25k - €250k" },
        { name: "riskAppetite", label: "Risk appetite", placeholder: "Low / Medium / High" },
        { name: "investmentFocus", label: "Investment focus", placeholder: "B2B SaaS, AI, climate" },
        {
          name: "strategicNotes",
          label: "Strategic notes",
          placeholder: "Preferred geography, thesis, ticket strategy",
          type: "textarea",
        },
      ]}
    />
  );
}
