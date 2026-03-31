import type { UserType, Prisma } from "@prisma/client";

export type OnboardingStepPayload = Record<
  string,
  Record<string, unknown> | undefined
>;

function toJsonValue(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

function toJsonObject(value: Record<string, unknown>): Prisma.InputJsonObject {
  return value as Prisma.InputJsonObject;
}

export type CompleteOnboardingBody = {
  role: UserType;
  investorType?: string;
  payload: {
    steps: OnboardingStepPayload;
  };
};

function step(steps: OnboardingStepPayload, n: number): Record<string, unknown> {
  const raw = steps[String(n)];
  return raw && typeof raw === "object" ? raw : {};
}

function parseYearsExperience(label: unknown): number | null {
  const s = String(label ?? "");
  const m = s.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

function parseUsdRange(value: unknown): { min: number | null; max: number | null } {
  const s = String(value ?? "").toLowerCase().trim();
  if (!s) return { min: null, max: null };

  const nums = [...s.matchAll(/(\d+(?:[.,]\d+)?)\s*(k|m)?/g)].map((m) => {
    let n = parseFloat(m[1].replace(",", "."));
    const unit = m[2];
    if (unit === "k") n *= 1_000;
    if (unit === "m") n *= 1_000_000;
    return Math.round(n);
  });

  if (nums.length >= 2) return { min: nums[0], max: nums[1] };
  if (nums.length === 1) return { min: nums[0], max: nums[0] };

  return { min: null, max: null };
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map((x) => String(x).trim()).filter(Boolean)
    : [];
}

function cleanString(value: unknown): string | null {
  const s = String(value ?? "").trim();
  return s || null;
}

function cleanInt(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : null;
}

function cleanFloat(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function buildUserUpdateFromPayload(
  role: UserType,
  steps: OnboardingStepPayload
): { name?: string } {
  const s1 = step(steps, 1);

  if (role === "STARTUP") {
    const name = String(s1.companyName ?? "").trim();
    return name ? { name } : {};
  }

  const first = String(s1.firstName ?? "").trim();
  const last = String(s1.lastName ?? "").trim();
  const display = [first, last].filter(Boolean).join(" ").trim();
  return display ? { name: display } : {};
}

export function buildInvestorProfileData(
  investorType: string | undefined,
  steps: OnboardingStepPayload
): Prisma.InvestorProfileUncheckedUpdateInput {
  const s1 = step(steps, 1);
  const s2 = step(steps, 2);
  const s3 = step(steps, 3);
  const s4 = step(steps, 4);
  const s5 = step(steps, 5);
  const s6 = step(steps, 6);

  const typeResolved = [
    investorType,
    s2.investorType,
    s2.otherInvestorType,
  ]
    .map((x) => String(x ?? "").trim())
    .find(Boolean) || null;

  const budgetParsed = parseUsdRange(s4.budgetRange ?? s4.budget ?? s4.totalBudget);
  const ticketParsed = parseUsdRange(s4.ticketSize ?? s4.otherTicket);

  const involvementTypes = [
    ...toStringArray(s5.involvementTypes),
    ...toStringArray(s5.involvementStyle),
    ...toStringArray(s5.collaborationStyle),
  ];

  return {
    firstName: cleanString(s1.firstName),
    lastName: cleanString(s1.lastName),
    country: cleanString(s1.country),
    city: cleanString(s1.city),
    professionalTitle: cleanString(s1.professionalTitle),
    linkedinUrl: cleanString(s1.linkedIn),
    bio: cleanString(s1.bio),

    investorType: typeResolved,
    investorTypeOther: cleanString(s2.otherInvestorType),

    sectors: [
      ...toStringArray(s3.sectors),
      ...toStringArray(s3.otherSector ? [s3.otherSector] : []),
    ],
    stages: [
      ...toStringArray(s3.stages),
      ...toStringArray(s3.otherStage ? [s3.otherStage] : []),
    ],
    geographies: [
      ...toStringArray(s3.geographies),
      ...toStringArray(s3.otherGeo ? [s3.otherGeo] : []),
    ],

    budgetMinUsd: budgetParsed.min,
    budgetMaxUsd: budgetParsed.max,
    ticketMinUsd: ticketParsed.min,
    ticketMaxUsd: ticketParsed.max,
    riskAppetite: cleanString(s4.riskTolerance),
    investmentFrequency: cleanString(s4.investmentFrequency ?? s4.otherFrequency),

    preferredStartupValues: toStringArray(s5.startupValues),
    involvementTypes,
    coInvestingPreference: cleanString(s5.coInvesting ?? s5.otherCoInvesting),
    hearAboutSource: cleanString(s5.hearAbout),

    previousInvestments: cleanString(s1.prevInvestments ?? s1.prevInvestmentsOther),
    successfulExits: cleanString(s1.successfulExits ?? s1.successfulExitsOther),

    strategicNotes: toJsonValue({
      step1: toJsonObject(s1),
      step4: toJsonObject(s4),
      step5: toJsonObject(s5),
      step6: toJsonObject(s6),
    }),
    extras: toJsonValue({
      raw: {
        step2: toJsonObject(s2),
        step3: toJsonObject(s3),
        step6: toJsonObject(s6),
      },
    }),
  };
}

export function buildStartupProfileData(
  steps: OnboardingStepPayload
): Prisma.StartupProfileUncheckedUpdateInput {
  const s1 = step(steps, 1);
  const s2 = step(steps, 2);
  const s3 = step(steps, 3);
  const s4 = step(steps, 4);
  const s5 = step(steps, 5);
  const s6 = step(steps, 6);

  const fundraisingParsed = parseUsdRange(
    s3.fundraisingGoal ?? s3.fundingGoal ?? s3.raiseAmount
  );
  const checkParsed = parseUsdRange(
    s3.checkSize ?? s3.minCheck ?? s3.maxCheck
  );

  return {
    companyName: cleanString(s1.companyName),
    legalEntityType: cleanString(s1.legalEntityType),
    country: cleanString(s1.country),
    city: cleanString(s1.city),
    website: cleanString(s1.website),
    linkedinUrl: cleanString(s1.linkedIn),

    oneLiner: cleanString(s1.oneLiner),
    shortPitch: cleanString(s1.shortPitch ?? s1.pitch),
    problem: cleanString(s1.problem),
    solution: cleanString(s1.solution),

    industries: [
      ...toStringArray(s2.industries),
      ...toStringArray(s2.industryOther ? [s2.industryOther] : []),
    ],
    businessModels: [
      ...toStringArray(s2.businessModels),
      ...toStringArray(s2.businessModelOther ? [s2.businessModelOther] : []),
    ],
    companyStage: cleanString(s2.companyStage ?? s2.stage),
    fundingStage: cleanString(s2.fundingStage ?? s2.stageOther),
    foundedYear: cleanInt(s1.foundedYear),

    fundraisingGoalUsd: fundraisingParsed.max ?? fundraisingParsed.min,
    minCheckUsd: checkParsed.min,
    maxCheckUsd: checkParsed.max,
    useOfFunds: [
      ...toStringArray(s3.useOfFunds),
      ...toStringArray(s3.fundUseOther ? [s3.fundUseOther] : []),
    ],

    founderCount: cleanInt(s4.founderCount),
    teamSize: cleanInt(s4.teamSize),
    tractionSummary: cleanString(s4.tractionSummary ?? s4.keyMetric),
    monthlyRevenueUsd: cleanInt(s4.monthlyRevenueUsd ?? s4.revenue),
    monthlyGrowthRate: cleanFloat(s4.monthlyGrowthRate),
    usersCount: cleanInt(s4.usersCount ?? s4.users),

    expertNeeds: [
      ...toStringArray(s5.categories),
      ...toStringArray(s5.otherCategory ? [s5.otherCategory] : []),
    ],
    hiringNeeds: [
      ...toStringArray(s5.hiringNeeds),
      ...toStringArray(s5.hiringOther ? [s5.hiringOther] : []),
    ],
    startupValues: toStringArray(s5.startupValues),

    deckUrl: cleanString(s1.deckUrl),
    pitchVideoUrl: cleanString(s1.pitchVideoUrl),

    extras: toJsonValue({
      raw: {
        step6: toJsonObject(s6),
      },
    }),
  };
}

export function buildExpertProfileData(
  steps: OnboardingStepPayload
): Prisma.ExpertProfileUncheckedUpdateInput {
  const s1 = step(steps, 1);
  const s2 = step(steps, 2);
  const s3 = step(steps, 3);
  const s4 = step(steps, 4);
  const s5 = step(steps, 5);
  const s6 = step(steps, 6);

  return {
    firstName: cleanString(s1.firstName),
    lastName: cleanString(s1.lastName),
    title: cleanString(s1.title),
    headline: cleanString(s1.headline ?? s1.title),
    bio: cleanString(s1.bio),
    country: cleanString(s1.country),
    city: cleanString(s1.city),
    linkedinUrl: cleanString(s1.linkedIn),
    website: cleanString(s1.website),
    portfolioUrl: cleanString(s4.portfolioUrl),

    yearsExperience: parseYearsExperience(s1.yearsExp),
    primaryCategory: cleanString(s2.primaryCategory ?? s2.category),
    skills: [
      ...toStringArray(s2.skills),
      ...toStringArray(s2.skillsOther ? [s2.skillsOther] : []),
    ],
    industries: [
      ...toStringArray(s2.industries),
      ...toStringArray(s2.industriesOther ? [s2.industriesOther] : []),
    ],
    areasOfExpertise: [
      ...toStringArray(s2.skills),
      ...toStringArray(s2.industries),
    ],

    hourlyRateUsd: cleanInt(s3.rate ?? s3.hourlyRate),
    minProjectBudgetUsd: cleanInt(s3.minProjectBudgetUsd ?? s3.projectBudget),
    availability: cleanString(s3.availability),
    noticePeriod: cleanString(s5.notice ?? s5.noticeOther),

    collaborationTypes: [
      ...toStringArray(s5.collab),
      ...toStringArray(s5.collabOther ? [s5.collabOther] : []),
    ],
    preferredStartupStages: [
      ...toStringArray(s5.startupStages),
      ...toStringArray(s5.stageOther ? [s5.stageOther] : []),
    ],
    collaborationInterests: [
      ...toStringArray(s5.projects),
      ...toStringArray(s5.projectsOther ? [s5.projectsOther] : []),
    ],

    pastClients: cleanString(s4.pastClients),
    certifications: [
      ...toStringArray(s4.credentials),
      ...toStringArray(s4.credOther ? [s4.credOther] : []),
    ],

    extras: toJsonValue({
      raw: {
        step4: toJsonObject(s4),
        step6: toJsonObject(s6),
      },
    }),
  };
}