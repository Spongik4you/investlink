import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getPostAuthPath } from "@/lib/navigation";

export default async function AuthContinuePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  redirect(getPostAuthPath(session.user.type, session.user.onboardingStatus));
}
