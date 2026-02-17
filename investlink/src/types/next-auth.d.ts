import { OnboardingStatus, UserType, VerificationStatus } from "@prisma/client";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      type: UserType;
      verificationStatus: VerificationStatus;
      onboardingStatus: OnboardingStatus;
    } & Session["user"];
  }

  interface User {
    id: string;
    type: UserType;
    verificationStatus: VerificationStatus;
    onboardingStatus: OnboardingStatus;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    type?: UserType;
    verificationStatus?: VerificationStatus;
    onboardingStatus?: OnboardingStatus;
  }
}
