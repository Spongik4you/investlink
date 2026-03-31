/*
  Warnings:

  - You are about to drop the column `budgetRange` on the `InvestorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `investmentFocus` on the `InvestorProfile` table. All the data in the column will be lost.
  - The `strategicNotes` column on the `InvestorProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `fundingGoal` on the `StartupProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExpertProfile" ADD COLUMN     "availability" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "certifications" TEXT[],
ADD COLUMN     "city" TEXT,
ADD COLUMN     "collaborationTypes" TEXT[],
ADD COLUMN     "country" TEXT,
ADD COLUMN     "extras" JSONB,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "hourlyRateUsd" INTEGER,
ADD COLUMN     "industries" TEXT[],
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "minProjectBudgetUsd" INTEGER,
ADD COLUMN     "noticePeriod" TEXT,
ADD COLUMN     "pastClients" TEXT,
ADD COLUMN     "portfolioUrl" TEXT,
ADD COLUMN     "preferredStartupStages" TEXT[],
ADD COLUMN     "primaryCategory" TEXT,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "title" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "InvestorProfile" DROP COLUMN "budgetRange",
DROP COLUMN "investmentFocus",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "budgetMaxUsd" INTEGER,
ADD COLUMN     "budgetMinUsd" INTEGER,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "coInvestingPreference" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "extras" JSONB,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "geographies" TEXT[],
ADD COLUMN     "hearAboutSource" TEXT,
ADD COLUMN     "investmentFrequency" TEXT,
ADD COLUMN     "investorTypeOther" TEXT,
ADD COLUMN     "involvementTypes" TEXT[],
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "preferredStartupValues" TEXT[],
ADD COLUMN     "previousInvestments" TEXT,
ADD COLUMN     "professionalTitle" TEXT,
ADD COLUMN     "sectors" TEXT[],
ADD COLUMN     "stages" TEXT[],
ADD COLUMN     "successfulExits" TEXT,
ADD COLUMN     "ticketMaxUsd" INTEGER,
ADD COLUMN     "ticketMinUsd" INTEGER,
DROP COLUMN "strategicNotes",
ADD COLUMN     "strategicNotes" JSONB;

-- AlterTable
ALTER TABLE "StartupProfile" DROP COLUMN "fundingGoal",
ADD COLUMN     "businessModels" TEXT[],
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "deckUrl" TEXT,
ADD COLUMN     "expertNeeds" TEXT[],
ADD COLUMN     "extras" JSONB,
ADD COLUMN     "foundedYear" INTEGER,
ADD COLUMN     "founderCount" INTEGER,
ADD COLUMN     "fundingStage" TEXT,
ADD COLUMN     "fundraisingGoalUsd" INTEGER,
ADD COLUMN     "hiringNeeds" TEXT[],
ADD COLUMN     "industries" TEXT[],
ADD COLUMN     "legalEntityType" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "maxCheckUsd" INTEGER,
ADD COLUMN     "minCheckUsd" INTEGER,
ADD COLUMN     "monthlyGrowthRate" DOUBLE PRECISION,
ADD COLUMN     "monthlyRevenueUsd" INTEGER,
ADD COLUMN     "oneLiner" TEXT,
ADD COLUMN     "pitchVideoUrl" TEXT,
ADD COLUMN     "problem" TEXT,
ADD COLUMN     "solution" TEXT,
ADD COLUMN     "startupValues" TEXT[],
ADD COLUMN     "teamSize" INTEGER,
ADD COLUMN     "tractionSummary" TEXT,
ADD COLUMN     "useOfFunds" TEXT[],
ADD COLUMN     "usersCount" INTEGER;

-- CreateIndex
CREATE INDEX "ExpertProfile_primaryCategory_idx" ON "ExpertProfile"("primaryCategory");

-- CreateIndex
CREATE INDEX "ExpertProfile_yearsExperience_idx" ON "ExpertProfile"("yearsExperience");

-- CreateIndex
CREATE INDEX "ExpertProfile_country_idx" ON "ExpertProfile"("country");

-- CreateIndex
CREATE INDEX "ExpertProfile_city_idx" ON "ExpertProfile"("city");

-- CreateIndex
CREATE INDEX "InvestorProfile_investorType_idx" ON "InvestorProfile"("investorType");

-- CreateIndex
CREATE INDEX "InvestorProfile_riskAppetite_idx" ON "InvestorProfile"("riskAppetite");

-- CreateIndex
CREATE INDEX "InvestorProfile_country_idx" ON "InvestorProfile"("country");

-- CreateIndex
CREATE INDEX "InvestorProfile_city_idx" ON "InvestorProfile"("city");

-- CreateIndex
CREATE INDEX "StartupProfile_companyStage_idx" ON "StartupProfile"("companyStage");

-- CreateIndex
CREATE INDEX "StartupProfile_fundingStage_idx" ON "StartupProfile"("fundingStage");

-- CreateIndex
CREATE INDEX "StartupProfile_country_idx" ON "StartupProfile"("country");

-- CreateIndex
CREATE INDEX "StartupProfile_city_idx" ON "StartupProfile"("city");
