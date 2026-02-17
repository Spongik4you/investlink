import { OnboardingStatus, UserType } from "@prisma/client";

export function getOnboardingPath(type: UserType): string {
  if (type === "EXPERT") return "/onboarding/expert/step-1";
  if (type === "INVESTOR") return "/onboarding/investor/step-1";
  return "/onboarding/startup/step-1";
}

export function getDashboardPath(type: UserType): string {
  if (type === "EXPERT") return "/dashboard/expert";
  if (type === "INVESTOR") return "/dashboard/investor";
  return "/dashboard/startup";
}

export function getPostAuthPath(type: UserType, onboardingStatus: OnboardingStatus): string {
  return onboardingStatus === "COMPLETED" ? getDashboardPath(type) : getOnboardingPath(type);
}
