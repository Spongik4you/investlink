-- CreateEnum
CREATE TYPE "InvestmentPositionStatus" AS ENUM ('ACTIVE', 'WATCHLIST', 'EXITED');

-- CreateEnum
CREATE TYPE "StartupStage" AS ENUM ('PRE_SEED', 'SEED', 'SERIES_A', 'SERIES_B', 'SERIES_C');

-- CreateTable
CREATE TABLE "StartupCompany" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sector" TEXT,
    "stage" "StartupStage",
    "logoUrl" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StartupCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentPosition" (
    "id" TEXT NOT NULL,
    "investorProfileId" TEXT NOT NULL,
    "startupCompanyId" TEXT NOT NULL,
    "investedAmount" DECIMAL(18,2) NOT NULL,
    "currentValue" DECIMAL(18,2) NOT NULL,
    "equityPercent" DECIMAL(8,4),
    "positionStatus" "InvestmentPositionStatus" NOT NULL DEFAULT 'ACTIVE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "riskScore" INTEGER NOT NULL DEFAULT 30,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentPosition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StartupCompany_slug_key" ON "StartupCompany"("slug");

-- CreateIndex
CREATE INDEX "InvestmentPosition_investorProfileId_isActive_idx" ON "InvestmentPosition"("investorProfileId", "isActive");

-- CreateIndex
CREATE INDEX "InvestmentPosition_startupCompanyId_idx" ON "InvestmentPosition"("startupCompanyId");

-- AddForeignKey
ALTER TABLE "InvestmentPosition" ADD CONSTRAINT "InvestmentPosition_investorProfileId_fkey" FOREIGN KEY ("investorProfileId") REFERENCES "InvestorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentPosition" ADD CONSTRAINT "InvestmentPosition_startupCompanyId_fkey" FOREIGN KEY ("startupCompanyId") REFERENCES "StartupCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;
