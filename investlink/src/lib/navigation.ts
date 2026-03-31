import { OnboardingStatus, UserType } from "@prisma/client";

export function getOnboardingPath(_type: UserType): string {
  return "/onboarding";
}

export function getDashboardPath(type: UserType): string {
  if (type === "EXPERT") return "/dashboard/expert";
  if (type === "INVESTOR") return "/dashboard/investor";
  return "/dashboard/startup";
}

export function getPostAuthPath(type: UserType, onboardingStatus: OnboardingStatus): string {
  return onboardingStatus === "COMPLETED"
    ? getDashboardPath(type)
    : getOnboardingPath(type);
}