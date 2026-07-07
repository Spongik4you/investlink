-- Partial unique index: o pereche (startup, expert) poate avea CEL MULT o
-- colaborare "vie" simultan, dar oricâte în stări terminale (istoric).
--
-- De ce SQL manual și nu @@unique în schema.prisma:
-- Prisma @@unique creează un index unic pe TOATE rândurile — ceea ce ar
-- interzice și istoricul (două COMPLETED pentru aceeași pereche). Avem nevoie
-- de un index unic PARȚIAL, condiționat pe status, pe care Prisma nu-l poate
-- exprima. PostgreSQL îl suportă nativ prin clauza WHERE.
--
-- Condiția WHERE face indexul să "vadă" doar colaborările vii:
--   - status IN (ACTIVE, BUSY, PAUSED) -> stări în care colaborarea e activă
--   - expertProfileId IS NOT NULL -> exclude colaborările cu experți externi
--     (manuale, fără profil pe platformă); două astfel de rânduri NU trebuie
--     să intre în conflict fals.
--
-- Efect: la a doua invitație acceptată pentru o pereche care are deja o
-- colaborare vie, INSERT-ul eșuează la nivel de DB — garanție dincolo de
-- verificarea din API.

CREATE UNIQUE INDEX "uniq_live_collaboration_per_pair"
ON "StartupExpertCollaboration" ("startupProfileId", "expertProfileId")
WHERE "status" IN ('ACTIVE', 'BUSY', 'PAUSED')
  AND "expertProfileId" IS NOT NULL;
