-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'WITHDRAWN');

-- AlterTable
ALTER TABLE "StartupExpertCollaboration" ADD COLUMN     "expertProfileId" TEXT;

-- CreateTable
CREATE TABLE "CollaborationInvitation" (
    "id" TEXT NOT NULL,
    "startupProfileId" TEXT NOT NULL,
    "expertProfileId" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "message" TEXT,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollaborationInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CollaborationInvitation_expertProfileId_status_idx" ON "CollaborationInvitation"("expertProfileId", "status");

-- CreateIndex
CREATE INDEX "CollaborationInvitation_startupProfileId_status_idx" ON "CollaborationInvitation"("startupProfileId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "CollaborationInvitation_startupProfileId_expertProfileId_st_key" ON "CollaborationInvitation"("startupProfileId", "expertProfileId", "status");

-- CreateIndex
CREATE INDEX "StartupExpertCollaboration_expertProfileId_idx" ON "StartupExpertCollaboration"("expertProfileId");

-- AddForeignKey
ALTER TABLE "StartupExpertCollaboration" ADD CONSTRAINT "StartupExpertCollaboration_expertProfileId_fkey" FOREIGN KEY ("expertProfileId") REFERENCES "ExpertProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaborationInvitation" ADD CONSTRAINT "CollaborationInvitation_startupProfileId_fkey" FOREIGN KEY ("startupProfileId") REFERENCES "StartupProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaborationInvitation" ADD CONSTRAINT "CollaborationInvitation_expertProfileId_fkey" FOREIGN KEY ("expertProfileId") REFERENCES "ExpertProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
