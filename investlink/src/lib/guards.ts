import { UserType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getOnboardingPath } from "@/lib/navigation";

export async function requireDashboardAccess(expectedType: UserType) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.type !== expectedType) {
    redirect("/auth/continue");
  }

  if (session.user.onboardingStatus !== "COMPLETED") {
    redirect(getOnboardingPath(expectedType));
  }

  return session;
}
