import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OnboardingWizardProvider } from "@/contexts/OnboardingWizardContext";
import OnboardingFlowClient from "./OnboardingFlowClient";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/auth/signin");

  return (
    <OnboardingWizardProvider>
      <OnboardingFlowClient />
    </OnboardingWizardProvider>
  );
}