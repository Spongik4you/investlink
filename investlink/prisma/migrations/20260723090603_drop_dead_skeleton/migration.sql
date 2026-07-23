/*
  Warnings:

  - You are about to drop the `InvestmentPosition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StartupCompany` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StartupFundingRound` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StartupInvestment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StartupInvestorRelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InvestmentPosition" DROP CONSTRAINT "InvestmentPosition_investorProfileId_fkey";

-- DropForeignKey
ALTER TABLE "InvestmentPosition" DROP CONSTRAINT "InvestmentPosition_startupCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "StartupFundingRound" DROP CONSTRAINT "StartupFundingRound_startupProfileId_fkey";

-- DropForeignKey
ALTER TABLE "StartupInvestment" DROP CONSTRAINT "StartupInvestment_startupFundingRoundId_fkey";

-- DropForeignKey
ALTER TABLE "StartupInvestment" DROP CONSTRAINT "StartupInvestment_startupInvestorRelationId_fkey";

-- DropForeignKey
ALTER TABLE "StartupInvestorRelation" DROP CONSTRAINT "StartupInvestorRelation_startupProfileId_fkey";

-- DropTable
DROP TABLE "InvestmentPosition";

-- DropTable
DROP TABLE "StartupCompany";

-- DropTable
DROP TABLE "StartupFundingRound";

-- DropTable
DROP TABLE "StartupInvestment";

-- DropTable
DROP TABLE "StartupInvestorRelation";

-- DropEnum
DROP TYPE "FundingRoundStatus";

-- DropEnum
DROP TYPE "InvestmentPositionStatus";

-- DropEnum
DROP TYPE "InvestmentStatus";

-- DropEnum
DROP TYPE "InvestorRelationStatus";

-- DropEnum
DROP TYPE "StartupStage";
