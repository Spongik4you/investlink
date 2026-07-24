import { prisma } from "@/lib/prisma";

export type ExpertKpis = {
  activeCollaborations: number;
  /** Invitații de la startup-uri care așteaptă răspunsul expertului. */
  invitationsAwaitingReply: number;
  /** Aplicații trimise de expert, fără răspuns încă. */
  applicationsAwaitingReply: number;
  profileStrengthPct: number;
  /** Media notelor primite — null sub pragul de semnificație. */
  avgRating: number | null;
  ratingCount: number;
};

export type ExpertCollaborationSummary = {
  id: string;
  startupName: string;
  roleTitle: string;
  currentProjectTitle: string | null;
};

export type MatchingStartup = {
  startupProfileId: string;
  companyName: string;
  oneLiner: string | null;
  fundingStage: string | null;
  /** Nevoile startup-ului acoperite de skill-urile expertului — DOVADA. */
  matchedNeeds: string[];
  totalNeeds: number;
};

export type ExpertOverviewData = {
  firstName: string;
  kpis: ExpertKpis;
  missingProfileFields: string[];
  activeCollaborations: ExpertCollaborationSummary[];
  matchingStartups: MatchingStartup[];
};

/** Sub acest prag, o medie de rating e zgomot, nu semnal. */
const MIN_RATINGS_FOR_AVERAGE = 3;

const LIVE_COLLABORATION_STATUSES = ["ACTIVE", "BUSY", "PAUSED"] as const;

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
};

/**
 * Câmpurile care contează pentru „Profile Strength", cu etichete umane pentru
 * lista de „ce lipsește". KPI calculat REAL din datele profilului — spre
 * deosebire de machetă, unde 85% era hardcodat.
 *
 * Nu afișăm o variație („+2%"): ar cere istoric al profilului, pe care nu-l
 * stocăm. Valoarea e reală, delta ar fi inventată.
 */
const PROFILE_FIELDS: Array<{
  label: string;
  isFilled: (p: ExpertProfileSelect) => boolean;
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
  { label: "Areas of expertise", isFilled: (p) => p.areasOfExpertise.length > 0 },
  { label: "Hourly rate", isFilled: (p) => p.hourlyRateUsd != null },
  { label: "Availability", isFilled: (p) => !!p.availability?.trim() },
  { label: "Collaboration types", isFilled: (p) => p.collaborationTypes.length > 0 },
];

function personName(first: string | null, last: string | null): string {
  return [first?.trim(), last?.trim()].filter(Boolean).join(" ") || "Startup";
}

/**
 * Datele dashboard-ului expertului.
 *
 * Răspunde la „la ce lucrez / cine mă vrea / ce merită urmărit", nu la „cine
 * sunt eu" — expertul își știe deja profilul. Singurul element despre el rămas
 * e Profile Strength, pentru că e ACȚIONABIL: pe un marketplace, profilul
 * incomplet înseamnă mai puține invitații.
 *
 * NU calculăm venituri estimate: n-avem ore lucrate, contracte sau muncă
 * programată. O prognoză de venit pe care un om și-ar face planuri ar fi
 * invenție cu consecințe reale.
 */
export async function getExpertOverview(
  expertProfileId: string,
): Promise<ExpertOverviewData> {
  const profile = await prisma.expertProfile.findUnique({
    where: { id: expertProfileId },
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
  });

  const firstName = profile?.firstName?.trim() || "Expert";

  if (!profile) {
    return {
      firstName,
      kpis: {
        activeCollaborations: 0,
        invitationsAwaitingReply: 0,
        applicationsAwaitingReply: 0,
        profileStrengthPct: 0,
        avgRating: null,
        ratingCount: 0,
      },
      missingProfileFields: PROFILE_FIELDS.map((f) => f.label),
      activeCollaborations: [],
      matchingStartups: [],
    };
  }

  const [
    collaborations,
    invitationsAwaitingReply,
    applicationsAwaitingReply,
    ratedCollaborations,
    candidateStartups,
  ] = await Promise.all([
    prisma.startupExpertCollaboration.findMany({
      where: {
        expertProfileId,
        status: { in: [...LIVE_COLLABORATION_STATUSES] },
      },
      orderBy: { startedAt: "desc" },
      select: {
        id: true,
        roleTitle: true,
        currentProjectTitle: true,
        startupProfile: { select: { companyName: true } },
      },
    }),
    prisma.collaborationInvitation.count({
      where: { expertProfileId, initiatedBy: "STARTUP", status: "PENDING" },
    }),
    prisma.collaborationInvitation.count({
      where: { expertProfileId, initiatedBy: "EXPERT", status: "PENDING" },
    }),
    prisma.startupExpertCollaboration.findMany({
      where: { expertProfileId, startupRating: { not: null } },
      select: { startupRating: true },
    }),
    // Startup-uri ale căror nevoi ating skill-urile expertului și cu care NU
    // există deja o cerere în așteptare (blocarea strictă din 4.5).
    profile.skills.length > 0
      ? prisma.startupProfile.findMany({
          where: {
            companyName: { not: null },
            expertNeeds: { hasSome: profile.skills },
            sentInvitations: { none: { expertProfileId, status: "PENDING" } },
          },
          orderBy: { updatedAt: "desc" },
          take: 8,
          select: {
            id: true,
            companyName: true,
            oneLiner: true,
            fundingStage: true,
            expertNeeds: true,
          },
        })
      : Promise.resolve([]),
  ]);

  // ── Rating: doar peste pragul de semnificație ──
  const ratings = ratedCollaborations
    .map((c) => c.startupRating)
    .filter((r): r is number => r != null);
  const ratingCount = ratings.length;
  const avgRating =
    ratingCount >= MIN_RATINGS_FOR_AVERAGE
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratingCount) * 10) / 10
      : null;

  // ── Potriviri: calculăm DOVADA, nu un scor opac ──
  const skillSet = new Set(profile.skills.map((s) => s.toLowerCase().trim()));
  const matchingStartups: MatchingStartup[] = candidateStartups
    .map((s) => {
      const matched = s.expertNeeds.filter((n) =>
        skillSet.has(n.toLowerCase().trim()),
      );
      return {
        startupProfileId: s.id,
        companyName: s.companyName ?? "Unnamed startup",
        oneLiner: s.oneLiner,
        fundingStage: s.fundingStage,
        matchedNeeds: matched,
        totalNeeds: s.expertNeeds.length,
      };
    })
    .filter((s) => s.matchedNeeds.length > 0)
    .sort((a, b) => b.matchedNeeds.length - a.matchedNeeds.length)
    .slice(0, 3);

  const filled = PROFILE_FIELDS.filter((f) => f.isFilled(profile));
  const missingProfileFields = PROFILE_FIELDS.filter(
    (f) => !f.isFilled(profile),
  ).map((f) => f.label);

  return {
    firstName,
    kpis: {
      activeCollaborations: collaborations.length,
      invitationsAwaitingReply,
      applicationsAwaitingReply,
      profileStrengthPct: Math.round(
        (filled.length / PROFILE_FIELDS.length) * 100,
      ),
      avgRating,
      ratingCount,
    },
    missingProfileFields,
    activeCollaborations: collaborations.slice(0, 3).map((c) => ({
      id: c.id,
      startupName: personName(c.startupProfile.companyName, null),
      roleTitle: c.roleTitle,
      currentProjectTitle: c.currentProjectTitle,
    })),
    matchingStartups,
  };
}
