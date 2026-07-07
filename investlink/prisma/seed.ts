/**
 * Seed de development pentru InvestLink.
 *
 * Creează conturi de test cu profile COMPLETE (onboarding COMPLETED),
 * ca să poți testa dashboardurile și fluxul de invitații fără să treci
 * manual prin wizard de fiecare dată.
 *
 * - Idempotent: upsert pe email — rulat de mai multe ori, nu duplică nimic
 *   și nu atinge conturile tale existente.
 * - Toate conturile au aceeași parolă de development: "Parola123!"
 * - NU rula acest script pe o bază de producție cu utilizatori reali.
 *
 * Rulare: npx prisma db seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

// Seeding-ul merge pe conexiunea DIRECTĂ (fără -pooler): PgBouncer în
// transaction mode rupe prepared statements la scripturi cu multe query-uri.
const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DIRECT_URL ?? process.env.DATABASE_URL },
  },
});

const DEV_PASSWORD = "Parola123!";

type ExpertSeed = {
  email: string;
  name: string;
  phone: string;
  profile: {
    firstName: string;
    lastName: string;
    title: string;
    headline: string;
    bio: string;
    country: string;
    city: string;
    linkedinUrl: string;
    yearsExperience: number;
    primaryCategory: string;
    skills: string[];
    industries: string[];
    areasOfExpertise: string[];
    hourlyRateUsd: number;
    availability: string;
    collaborationTypes: string[];
    preferredStartupStages: string[];
  };
};

const EXPERTS: ExpertSeed[] = [
  {
    email: "expert.ana@dev.investlink.test",
    name: "Ana Rusu",
    phone: "+37360000001",
    profile: {
      firstName: "Ana",
      lastName: "Rusu",
      title: "Senior Product Designer",
      headline: "Design de produs pentru SaaS B2B, de la research la handoff",
      bio: "10 ani de design de produs în echipe SaaS din România și Germania. Specializată în onboarding flows și design systems.",
      country: "Moldova",
      city: "Chișinău",
      linkedinUrl: "https://linkedin.com/in/ana-rusu-dev",
      yearsExperience: 10,
      primaryCategory: "Design",
      skills: ["UI/UX Design", "Design Systems", "User Research", "Figma"],
      industries: ["SaaS", "Fintech", "E-commerce"],
      areasOfExpertise: ["Product Design", "Onboarding Optimization"],
      hourlyRateUsd: 75,
      availability: "Part-time",
      collaborationTypes: ["Consulting", "Project-based"],
      preferredStartupStages: ["Pre-seed", "Seed"],
    },
  },
  {
    email: "expert.mihai@dev.investlink.test",
    name: "Mihai Popescu",
    phone: "+37360000002",
    profile: {
      firstName: "Mihai",
      lastName: "Popescu",
      title: "Fractional CTO",
      headline: "Arhitectură software și scaling pentru startupuri early-stage",
      bio: "Ex-CTO la două startupuri exit-uite. Ajut fondatori non-tehnici să ia decizii de arhitectură fără să angajeze un CTO full-time.",
      country: "România",
      city: "București",
      linkedinUrl: "https://linkedin.com/in/mihai-popescu-dev",
      yearsExperience: 15,
      primaryCategory: "Engineering",
      skills: ["System Architecture", "Node.js", "PostgreSQL", "AWS", "Team Building"],
      industries: ["SaaS", "Marketplace", "Fintech"],
      areasOfExpertise: ["Technical Due Diligence", "Scaling Infrastructure"],
      hourlyRateUsd: 120,
      availability: "Limited",
      collaborationTypes: ["Advisory", "Fractional"],
      preferredStartupStages: ["Seed", "Series A"],
    },
  },
  {
    email: "expert.irina@dev.investlink.test",
    name: "Irina Ceban",
    phone: "+37360000003",
    profile: {
      firstName: "Irina",
      lastName: "Ceban",
      title: "Growth Marketing Consultant",
      headline: "Growth loops și paid acquisition pentru piețe CEE",
      bio: "Am condus growth la un marketplace regional de la 0 la 200k utilizatori. Focus pe canale măsurabile și unit economics sănătoase.",
      country: "Moldova",
      city: "Chișinău",
      linkedinUrl: "https://linkedin.com/in/irina-ceban-dev",
      yearsExperience: 8,
      primaryCategory: "Marketing",
      skills: ["Growth Strategy", "Paid Acquisition", "SEO", "Analytics"],
      industries: ["Marketplace", "E-commerce", "Consumer Apps"],
      areasOfExpertise: ["Go-to-Market", "Retention"],
      hourlyRateUsd: 60,
      availability: "Full-time",
      collaborationTypes: ["Consulting", "Project-based", "Fractional"],
      preferredStartupStages: ["Pre-seed", "Seed"],
    },
  },
  {
    email: "expert.dan@dev.investlink.test",
    name: "Dan Munteanu",
    phone: "+37360000004",
    profile: {
      firstName: "Dan",
      lastName: "Munteanu",
      title: "Legal & Compliance Advisor",
      headline: "Structuri juridice și fundraising pentru startupuri din Moldova și România",
      bio: "Avocat specializat pe venture: SAFE-uri, ESOP, due diligence. Am asistat peste 30 de rundele de finanțare early-stage.",
      country: "Moldova",
      city: "Chișinău",
      linkedinUrl: "https://linkedin.com/in/dan-munteanu-dev",
      yearsExperience: 12,
      primaryCategory: "Legal",
      skills: ["Corporate Law", "Fundraising Documents", "ESOP", "GDPR"],
      industries: ["SaaS", "Fintech"],
      areasOfExpertise: ["Investment Structuring", "Compliance"],
      hourlyRateUsd: 90,
      availability: "Part-time",
      collaborationTypes: ["Advisory", "Project-based"],
      preferredStartupStages: ["Pre-seed", "Seed", "Series A"],
    },
  },
];

const STARTUPS = [
  {
    email: "startup.agrosense@dev.investlink.test",
    name: "Victor Lungu",
    phone: "+37360000010",
    profile: {
      companyName: "AgroSense",
      legalEntityType: "SRL",
      country: "Moldova",
      city: "Chișinău",
      website: "https://agrosense.dev.test",
      oneLiner: "Senzori IoT și analytics pentru fermele mici din Europa de Est.",
      shortPitch:
        "AgroSense oferă fermierilor mici monitorizare de sol și predicții de irigare la un preț accesibil, printr-un abonament lunar.",
      problem: "Fermele mici nu-și permit soluțiile enterprise de agricultură de precizie.",
      solution: "Hardware ieftin + platformă SaaS cu predicții bazate pe date locale.",
      industries: ["AgriTech", "IoT"],
      businessModels: ["SaaS", "Hardware"],
      companyStage: "MVP",
      fundingStage: "Pre-seed",
      foundedYear: 2025,
      fundraisingGoalUsd: 150000,
      founderCount: 2,
      teamSize: 4,
      expertNeeds: ["Growth Strategy", "System Architecture"],
      startupValues: ["Sustainability", "Transparency"],
    },
  },
  {
    email: "startup.plativo@dev.investlink.test",
    name: "Elena Bors",
    phone: "+37360000011",
    profile: {
      companyName: "Plativo",
      legalEntityType: "SRL",
      country: "Moldova",
      city: "Chișinău",
      website: "https://plativo.dev.test",
      oneLiner: "Plăți recurente și facturare pentru freelanceri din Moldova și România.",
      shortPitch:
        "Plativo automatizează facturarea, plățile recurente și rapoartele fiscale pentru freelanceri, integrat cu băncile locale.",
      problem: "Freelancerii pierd ore lunar pe facturi manuale și evidență fiscală.",
      solution: "Platformă care emite facturi, urmărește plățile și pregătește rapoartele automat.",
      industries: ["Fintech", "SaaS"],
      businessModels: ["SaaS", "Subscription"],
      companyStage: "Early Revenue",
      fundingStage: "Seed",
      foundedYear: 2024,
      fundraisingGoalUsd: 400000,
      founderCount: 3,
      teamSize: 7,
      expertNeeds: ["UI/UX Design", "Corporate Law", "Paid Acquisition"],
      startupValues: ["Customer Obsession", "Speed"],
    },
  },
];

const INVESTOR = {
  email: "investor.andrei@dev.investlink.test",
  name: "Andrei Cojocaru",
  phone: "+37360000020",
  profile: {
    firstName: "Andrei",
    lastName: "Cojocaru",
    country: "România",
    city: "Cluj-Napoca",
    professionalTitle: "Angel Investor",
    linkedinUrl: "https://linkedin.com/in/andrei-cojocaru-dev",
    bio: "Angel cu 8 investiții active în CEE. Ex-fondator exit-uit în 2022, acum investesc în SaaS și fintech early-stage.",
    investorType: "Angel",
    sectors: ["SaaS", "Fintech", "AgriTech"],
    stages: ["Pre-seed", "Seed"],
    geographies: ["Moldova", "România", "CEE"],
    ticketMinUsd: 10000,
    ticketMaxUsd: 50000,
    riskAppetite: "Moderate",
    investmentFrequency: "2-4 per year",
    involvementTypes: ["Advisory", "Board Observer"],
  },
};

async function main() {
  const passwordHash = await bcrypt.hash(DEV_PASSWORD, 12);

  // ── Experți ──────────────────────────────────────────────
  for (const expert of EXPERTS) {
    const user = await prisma.user.upsert({
      where: { email: expert.email },
      update: {},
      create: {
        email: expert.email,
        name: expert.name,
        phone: expert.phone,
        passwordHash,
        type: "EXPERT",
        onboardingStatus: "COMPLETED",
      },
    });

    await prisma.expertProfile.upsert({
      where: { userId: user.id },
      update: expert.profile,
      create: { userId: user.id, ...expert.profile },
    });

    console.log(`✔ Expert: ${expert.email}`);
  }

  // ── Startupuri ───────────────────────────────────────────
  for (const startup of STARTUPS) {
    const user = await prisma.user.upsert({
      where: { email: startup.email },
      update: {},
      create: {
        email: startup.email,
        name: startup.name,
        phone: startup.phone,
        passwordHash,
        type: "STARTUP",
        onboardingStatus: "COMPLETED",
      },
    });

    await prisma.startupProfile.upsert({
      where: { userId: user.id },
      update: startup.profile,
      create: { userId: user.id, ...startup.profile },
    });

    console.log(`✔ Startup: ${startup.email}`);
  }

  // ── Investitor ───────────────────────────────────────────
  const investorUser = await prisma.user.upsert({
    where: { email: INVESTOR.email },
    update: {},
    create: {
      email: INVESTOR.email,
      name: INVESTOR.name,
      phone: INVESTOR.phone,
      passwordHash,
      type: "INVESTOR",
      onboardingStatus: "COMPLETED",
    },
  });

  await prisma.investorProfile.upsert({
    where: { userId: investorUser.id },
    update: INVESTOR.profile,
    create: { userId: investorUser.id, ...INVESTOR.profile },
  });

  console.log(`✔ Investor: ${INVESTOR.email}`);

  console.log(`\nToate conturile de test au parola: ${DEV_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
