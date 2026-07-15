-- CreateEnum
CREATE TYPE "CollaborationParty" AS ENUM ('STARTUP', 'EXPERT');

-- AlterTable
ALTER TABLE "StartupExpertCollaboration" ADD COLUMN     "endedBy" "CollaborationParty",
ADD COLUMN     "expertComment" TEXT,
ADD COLUMN     "expertRating" INTEGER,
ADD COLUMN     "startupComment" TEXT,
ADD COLUMN     "startupRating" INTEGER;
