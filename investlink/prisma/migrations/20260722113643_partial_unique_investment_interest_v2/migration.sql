-- B1.5: Extinde blocarea strictă să acopere ȘI interesele ACCEPTED, nu doar
-- PENDING. Un interes acceptat înseamnă "relație deschisă" — nu are sens să
-- ceri iar "hai să discutăm" când deja ați fost de acord.
--
-- Înlocuiește indexul de la B1 (care acoperea doar PENDING). DROP + CREATE,
-- ca să nu rămână două indexuri suprapuse.
--
-- Efect: o pereche (investor, startup) poate avea CEL MULT un interes
-- "activ" (PENDING sau ACCEPTED) simultan. Stările terminale (DECLINED,
-- WITHDRAWN) nu blochează — istoricul de reluări rămâne posibil.

DROP INDEX IF EXISTS "uniq_pending_investment_interest_per_pair";

CREATE UNIQUE INDEX "uniq_active_investment_interest_per_pair"
ON "InvestmentInterest" ("investorProfileId", "startupProfileId")
WHERE "status" IN ('PENDING', 'ACCEPTED');
