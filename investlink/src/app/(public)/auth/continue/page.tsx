import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ContinuePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { type: true, onboardingStatus: true },
  });

  if (!user) redirect("/auth/signin");

  // New / not onboarded -> choose role first
  if (user.onboardingStatus === "NOT_STARTED") {
    redirect("/onboarding");
  }

  // If onboarding in progress, send to the right step-1 for now
  if (user.onboardingStatus === "IN_PROGRESS") {
    redirect("/onboarding");
  }

  // Completed
  if (user.type === "EXPERT") redirect("/dashboard/expert");
  if (user.type === "INVESTOR") redirect("/dashboard/investor");
  redirect("/dashboard/startup");
}