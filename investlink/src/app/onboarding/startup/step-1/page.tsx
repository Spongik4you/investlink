import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { RoleOnboardingForm } from "@/components/onboarding/RoleOnboardingForm";
import { authOptions } from "@/lib/auth";

export default async function StartupOnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/auth/signin");
  if (session.user.type !== "STARTUP") redirect("/auth/continue");
  if (session.user.onboardingStatus === "COMPLETED") redirect("/dashboard/startup");

  return (
    <RoleOnboardingForm
      role="STARTUP"
      title="Startup onboarding"
      description="Adaugă informațiile de bază despre startup-ul tău."
      submitLabel="Complete onboarding"
      dashboardPath="/dashboard/startup"
      fields={[
        { name: "companyName", label: "Company name", placeholder: "InvestLink Labs" },
        { name: "companyStage", label: "Company stage", placeholder: "Pre-seed / Seed / Series A" },
        { name: "website", label: "Website", placeholder: "https://example.com" },
        {
          name: "shortPitch",
          label: "Short pitch",
          placeholder: "One-liner about problem, solution and traction",
          type: "textarea",
        },
        { name: "fundingGoal", label: "Funding goal", placeholder: "€500k for 18 months runway" },
      ]}
    />
  );
}
