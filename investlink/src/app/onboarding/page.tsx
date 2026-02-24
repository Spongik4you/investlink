import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RoleChooseClient from "@/components/onboarding/RoleChooseClient";

export default async function OnboardingRolePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { onboardingStatus: true, type: true },
  });

  if (!user) redirect("/auth/signin");

  // Dacă deja a început onboarding-ul, nu mai are voie aici
  if (user.onboardingStatus !== "NOT_STARTED") {
    redirect("/auth/continue");
  }

  return <RoleChooseClient />;
}