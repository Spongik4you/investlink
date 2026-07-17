-- AlterTable
ALTER TABLE "CollaborationInvitation" ADD COLUMN     "initiatedBy" "CollaborationParty" NOT NULL DEFAULT 'STARTUP';
