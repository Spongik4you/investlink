-- AlterTable
ALTER TABLE "ExpertProfile" ALTER COLUMN "areasOfExpertise" DROP DEFAULT,
ALTER COLUMN "collaborationInterests" DROP DEFAULT;

-- AlterTable
ALTER TABLE "InvestorProfile" ALTER COLUMN "investmentFocus" DROP DEFAULT;
