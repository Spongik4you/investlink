import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { RoleOnboardingForm } from "@/components/onboarding/RoleOnboardingForm";
import { authOptions } from "@/lib/auth";

export default async function ExpertOnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/auth/signin");
  if (session.user.type !== "EXPERT") redirect("/auth/continue");
  if (session.user.onboardingStatus === "COMPLETED") redirect("/dashboard/expert");

  return (
    <RoleOnboardingForm
      role="EXPERT"
      title="Expert onboarding"
      description="Completează datele principale pentru profilul tău de expert."
      submitLabel="Complete onboarding"
      dashboardPath="/dashboard/expert"
      fields={[
        { name: "headline", label: "Headline", placeholder: "Product advisor / Go-to-market mentor" },
        { name: "yearsExperience", label: "Years of experience", placeholder: "10", type: "number" },
        { name: "areasOfExpertise", label: "Areas of expertise", placeholder: "fintech, sales, operations" },
        {
          name: "collaborationInterests",
          label: "Collaboration interests",
          placeholder: "advisory, fractional leadership, consulting",
        },
      ]}
    />
  );
}
