import { prisma } from "@/lib/prisma";

export type ExpertOverviewData = {
  firstName: string;
  profileStrengthPct: number;
  missingProfileFields: string[];
  hourlyRateUsd: number | null;
  yearsExperience: number | null;
  availability: string | null;
  primaryCategory: string | null;
  skills: string[];
  industries: string[];
  areasOfExpertise: string[];
};

/**
 * Câmpurile care contează pentru "Profile Strength", cu etichete umane
 * pentru lista de "ce lipsește". Fiecare câmp completat = puncte egale.
 *
 * NOTĂ: KPI-ul e calculat REAL din datele profilului, spre deosebire de
 * macheta HTML unde 85% era o cifră hardcodată. Când profilul e complet,
 * arată 100% — și scade vizibil dacă expertul lasă goluri.
 */
const PROFILE_FIELDS: Array<{
  label: string;
  isFilled: (p: NonNullable<ExpertProfileSelect>) => boolean;
}> = [
  { label: "First name", isFilled: (p) => !!p.firstName?.trim() },
  { label: "Last name", isFilled: (p) => !!p.lastName?.trim() },
  { label: "Professional title", isFilled: (p) => !!p.title?.trim() },
  { label: "Headline", isFilled: (p) => !!p.headline?.trim() },
  { label: "Bio", isFilled: (p) => !!p.bio?.trim() },
  { label: "Country", isFilled: (p) => !!p.country?.trim() },
  { label: "City", isFilled: (p) => !!p.city?.trim() },
  { label: "LinkedIn URL", isFilled: (p) => !!p.linkedinUrl?.trim() },
  { label: "Years of experience", isFilled: (p) => p.yearsExperience != null },
  { label: "Primary category", isFilled: (p) => !!p.primaryCategory?.trim() },
  { label: "Skills", isFilled: (p) => p.skills.length > 0 },
  { label: "Industries", isFilled: (p) => p.industries.length > 0 },
  {
    label: "Areas of expertise",
    isFilled: (p) => p.areasOfExpertise.length > 0,
  },
  { label: "Hourly rate", isFilled: (p) => p.hourlyRateUsd != null },
  { label: "Availability", isFilled: (p) => !!p.availability?.trim() },
  {
    label: "Collaboration types",
    isFilled: (p) => p.collaborationTypes.length > 0,
  },
];

type ExpertProfileSelect = {
  firstName: string | null;
  lastName: string | null;
  title: string | null;
  headline: string | null;
  bio: string | null;
  country: string | null;
  city: string | null;
  linkedinUrl: string | null;
  yearsExperience: number | null;
  primaryCategory: string | null;
  skills: string[];
  industries: string[];
  areasOfExpertise: string[];
  hourlyRateUsd: number | null;
  availability: string | null;
  collaborationTypes: string[];
} | null;

export async function getExpertOverviewByEmail(
  email: string,
): Promise<ExpertOverviewData> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      name: true,
      expertProfile: {
        select: {
          firstName: true,
          lastName: true,
          title: true,
          headline: true,
          bio: true,
          country: true,
          city: true,
          linkedinUrl: true,
          yearsExperience: true,
          primaryCategory: true,
          skills: true,
          industries: true,
          areasOfExpertise: true,
          hourlyRateUsd: true,
          availability: true,
          collaborationTypes: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const profile = user.expertProfile;

  const firstName =
    profile?.firstName?.trim() ||
    user.name?.trim().split(" ")[0] ||
    "Expert";

  if (!profile) {
    return {
      firstName,
      profileStrengthPct: 0,
      missingProfileFields: PROFILE_FIELDS.map((f) => f.label),
      hourlyRateUsd: null,
      yearsExperience: null,
      availability: null,
      primaryCategory: null,
      skills: [],
      industries: [],
      areasOfExpertise: [],
    };
  }

  const filled = PROFILE_FIELDS.filter((f) => f.isFilled(profile));
  const missing = PROFILE_FIELDS.filter((f) => !f.isFilled(profile)).map(
    (f) => f.label,
  );

  return {
    firstName,
    profileStrengthPct: Math.round(
      (filled.length / PROFILE_FIELDS.length) * 100,
    ),
    missingProfileFields: missing,
    hourlyRateUsd: profile.hourlyRateUsd,
    yearsExperience: profile.yearsExperience,
    availability: profile.availability,
    primaryCategory: profile.primaryCategory,
    skills: profile.skills,
    industries: profile.industries,
    areasOfExpertise: profile.areasOfExpertise,
  };
}
