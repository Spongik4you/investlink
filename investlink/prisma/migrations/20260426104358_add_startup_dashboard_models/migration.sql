-- CreateEnum
CREATE TYPE "FundingRoundStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InvestmentStatus" AS ENUM ('PENDING', 'ACTIVE', 'DECLINED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "InvestorRelationStatus" AS ENUM ('PIPELINE', 'PENDING', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ExpertCollaborationStatus" AS ENUM ('ACTIVE', 'BUSY', 'COMPLETED', 'PAUSED', 'CANCELLED');

-- CreateTable
CREATE TABLE "StartupFundingRound" (
    "id" TEXT NOT NULL,
    "startupProfileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "targetAmount" DECIMAL(14,2) NOT NULL,
    "raisedAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "equityOfferedPercent" DECIMAL(5,2),
    "status" "FundingRoundStatus" NOT NULL DEFAULT 'DRAFT',
    "openedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StartupFundingRound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StartupInvestorRelation" (
    "id" TEXT NOT NULL,
    "startupProfileId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "organizationName" TEXT,
    "status" "InvestorRelationStatus" NOT NULL DEFAULT 'PIPELINE',
    "email" TEXT,
    "totalCommitted" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "equityPercent" DECIMAL(5,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StartupInvestorRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StartupInvestment" (
    "id" TEXT NOT NULL,
    "startupFundingRoundId" TEXT NOT NULL,
    "startupInvestorRelationId" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "equityPercent" DECIMAL(5,2),
    "status" "InvestmentStatus" NOT NULL DEFAULT 'PENDING',
    "investedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StartupInvestment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StartupExpertCollaboration" (
    "id" TEXT NOT NULL,
    "startupProfileId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "status" "ExpertCollaborationStatus" NOT NULL DEFAULT 'ACTIVE',
    "hourlyRate" DECIMAL(10,2),
    "totalPaid" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "workloadPercent" INTEGER,
    "rating" DECIMAL(3,2),
    "projectsCount" INTEGER NOT NULL DEFAULT 1,
    "currentProjectTitle" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StartupExpertCollaboration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StartupFundingRound_startupProfileId_idx" ON "StartupFundingRound"("startupProfileId");

-- CreateIndex
CREATE INDEX "StartupInvestorRelation_startupProfileId_idx" ON "StartupInvestorRelation"("startupProfileId");

-- CreateIndex
CREATE INDEX "StartupInvestment_startupFundingRoundId_idx" ON "StartupInvestment"("startupFundingRoundId");

-- CreateIndex
CREATE INDEX "StartupInvestment_startupInvestorRelationId_idx" ON "StartupInvestment"("startupInvestorRelationId");

-- CreateIndex
CREATE INDEX "StartupExpertCollaboration_startupProfileId_idx" ON "StartupExpertCollaboration"("startupProfileId");

-- AddForeignKey
ALTER TABLE "StartupFundingRound" ADD CONSTRAINT "StartupFundingRound_startupProfileId_fkey" FOREIGN KEY ("startupProfileId") REFERENCES "StartupProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StartupInvestorRelation" ADD CONSTRAINT "StartupInvestorRelation_startupProfileId_fkey" FOREIGN KEY ("startupProfileId") REFERENCES "StartupProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StartupInvestment" ADD CONSTRAINT "StartupInvestment_startupFundingRoundId_fkey" FOREIGN KEY ("startupFundingRoundId") REFERENCES "StartupFundingRound"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StartupInvestment" ADD CONSTRAINT "StartupInvestment_startupInvestorRelationId_fkey" FOREIGN KEY ("startupInvestorRelationId") REFERENCES "StartupInvestorRelation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StartupExpertCollaboration" ADD CONSTRAINT "StartupExpertCollaboration_startupProfileId_fkey" FOREIGN KEY ("startupProfileId") REFERENCES "StartupProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
