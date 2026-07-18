/*
  Warnings:

  - You are about to drop the column `rating` on the `StartupExpertCollaboration` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InvestmentParty" AS ENUM ('INVESTOR', 'STARTUP');

-- CreateEnum
CREATE TYPE "InvestmentInterestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'WITHDRAWN');

-- AlterTable
ALTER TABLE "StartupExpertCollaboration" DROP COLUMN "rating";

-- CreateTable
CREATE TABLE "InvestmentInterest" (
    "id" TEXT NOT NULL,
    "investorProfileId" TEXT NOT NULL,
    "startupProfileId" TEXT NOT NULL,
    "message" TEXT,
    "initiatedBy" "InvestmentParty" NOT NULL,
    "status" "InvestmentInterestStatus" NOT NULL DEFAULT 'PENDING',
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "startupProfileId" TEXT NOT NULL,
    "investorProfileId" TEXT,
    "investorName" TEXT NOT NULL,
    "amountUsd" DECIMAL(18,2) NOT NULL,
    "round" TEXT,
    "equityPercent" DECIMAL(8,4),
    "investedAt" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InvestmentInterest_investorProfileId_status_idx" ON "InvestmentInterest"("investorProfileId", "status");

-- CreateIndex
CREATE INDEX "InvestmentInterest_startupProfileId_status_idx" ON "InvestmentInterest"("startupProfileId", "status");

-- CreateIndex
CREATE INDEX "Investment_startupProfileId_idx" ON "Investment"("startupProfileId");

-- CreateIndex
CREATE INDEX "Investment_investorProfileId_idx" ON "Investment"("investorProfileId");

-- AddForeignKey
ALTER TABLE "InvestmentInterest" ADD CONSTRAINT "InvestmentInterest_investorProfileId_fkey" FOREIGN KEY ("investorProfileId") REFERENCES "InvestorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentInterest" ADD CONSTRAINT "InvestmentInterest_startupProfileId_fkey" FOREIGN KEY ("startupProfileId") REFERENCES "StartupProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_startupProfileId_fkey" FOREIGN KEY ("startupProfileId") REFERENCES "StartupProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_investorProfileId_fkey" FOREIGN KEY ("investorProfileId") REFERENCES "InvestorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
