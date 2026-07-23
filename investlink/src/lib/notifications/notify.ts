import type { Prisma, PrismaClient } from "@prisma/client";

/**
 * Client Prisma SAU client de tranzacție. Notificările se creează ÎN aceeași
 * tranzacție cu acțiunea care le declanșează: dacă notificarea eșuează, se
 * anulează tot. O notificare pierdută în tăcere e mai rea decât o acțiune
 * eșuată pe care utilizatorul o reîncearcă — tăcerea e exact problema pe care
 * notificările o repară.
 */
type Db = PrismaClient | Prisma.TransactionClient;

function personName(p: { firstName: string | null; lastName: string | null } | null): string {
  if (!p) return "Someone";
  return [p.firstName?.trim(), p.lastName?.trim()].filter(Boolean).join(" ") || "Someone";
}

/**
 * Toate funcțiile de mai jos ies TĂCUT (return, fără throw) dacă datele lipsesc.
 * Motivul: o entitate lipsă e un bug de-al nostru, nu un motiv să anulăm o
 * acțiune legitimă a utilizatorului. Doar eșecurile reale de DB propagă și
 * declanșează rollback — exact când vrem.
 */

/** Cerere de colaborare creată (invitație de la startup SAU aplicație de la expert). */
export async function notifyCollaborationRequestCreated(
  db: Db,
  invitationId: string,
): Promise<void> {
  const inv = await db.collaborationInvitation.findUnique({
    where: { id: invitationId },
    select: {
      roleTitle: true,
      initiatedBy: true,
      startupProfile: { select: { userId: true, companyName: true } },
      expertProfile: { select: { userId: true, firstName: true, lastName: true } },
    },
  });
  if (!inv) return;

  const startupName = inv.startupProfile.companyName || "A startup";
  const expertName = personName(inv.expertProfile);

  if (inv.initiatedBy === "STARTUP") {
    // Startup a invitat expertul → notificăm expertul.
    await db.notification.create({
      data: {
        userId: inv.expertProfile.userId,
        type: "COLLABORATION_INVITATION_RECEIVED",
        title: `${startupName} invited you to collaborate`,
        body: `Role: ${inv.roleTitle}`,
        linkPath: "/dashboard/expert/opportunities",
      },
    });
  } else {
    // Expertul a aplicat → notificăm startup-ul.
    await db.notification.create({
      data: {
        userId: inv.startupProfile.userId,
        type: "COLLABORATION_APPLICATION_RECEIVED",
        title: `${expertName} applied to work with you`,
        body: `Role: ${inv.roleTitle}`,
        linkPath: "/dashboard/startup/applications",
      },
    });
  }
}

/** Cerere de colaborare acceptată/refuzată → notificăm INIȚIATORUL. */
export async function notifyCollaborationRequestAnswered(
  db: Db,
  invitationId: string,
  action: "accept" | "decline",
): Promise<void> {
  const inv = await db.collaborationInvitation.findUnique({
    where: { id: invitationId },
    select: {
      roleTitle: true,
      initiatedBy: true,
      startupProfile: { select: { userId: true, companyName: true } },
      expertProfile: { select: { userId: true, firstName: true, lastName: true } },
    },
  });
  if (!inv) return;

  const accepted = action === "accept";
  const type = accepted
    ? "COLLABORATION_REQUEST_ACCEPTED"
    : "COLLABORATION_REQUEST_DECLINED";
  const verb = accepted ? "accepted" : "declined";

  if (inv.initiatedBy === "STARTUP") {
    // Startup a inițiat → expertul a răspuns → notificăm startup-ul.
    await db.notification.create({
      data: {
        userId: inv.startupProfile.userId,
        type,
        title: `${personName(inv.expertProfile)} ${verb} your invitation`,
        body: `Role: ${inv.roleTitle}`,
        linkPath: accepted
          ? "/dashboard/startup/experts"
          : "/dashboard/startup/experts",
      },
    });
  } else {
    // Expertul a inițiat → startup-ul a răspuns → notificăm expertul.
    await db.notification.create({
      data: {
        userId: inv.expertProfile.userId,
        type,
        title: `${inv.startupProfile.companyName || "A startup"} ${verb} your application`,
        body: `Role: ${inv.roleTitle}`,
        linkPath: accepted
          ? "/dashboard/expert/portfolio"
          : "/dashboard/expert/browse",
      },
    });
  }
}

/** Colaborare încheiată → notificăm CEALALTĂ parte (nu pe cea care a încheiat). */
export async function notifyCollaborationEnded(
  db: Db,
  collaborationId: string,
): Promise<void> {
  const collab = await db.startupExpertCollaboration.findUnique({
    where: { id: collaborationId },
    select: {
      roleTitle: true,
      endedBy: true,
      startupProfile: { select: { userId: true, companyName: true } },
      expertProfile: { select: { userId: true, firstName: true, lastName: true } },
    },
  });
  // expertProfile e opțional (colaborări externe) — fără el nu avem pe cine notifica.
  if (!collab || !collab.expertProfile) return;

  const endedByStartup = collab.endedBy === "STARTUP";

  await db.notification.create({
    data: {
      userId: endedByStartup
        ? collab.expertProfile.userId
        : collab.startupProfile.userId,
      type: "COLLABORATION_ENDED",
      title: endedByStartup
        ? `${collab.startupProfile.companyName || "A startup"} ended your collaboration`
        : `${personName(collab.expertProfile)} ended your collaboration`,
      body: `Role: ${collab.roleTitle}`,
      linkPath: endedByStartup
        ? "/dashboard/expert/portfolio"
        : "/dashboard/startup/experts",
    },
  });
}

/** Interes de investiție creat (din oricare direcție). */
export async function notifyInvestmentInterestCreated(
  db: Db,
  interestId: string,
): Promise<void> {
  const interest = await db.investmentInterest.findUnique({
    where: { id: interestId },
    select: {
      initiatedBy: true,
      startupProfile: { select: { userId: true, companyName: true } },
      investorProfile: { select: { userId: true, firstName: true, lastName: true } },
    },
  });
  if (!interest) return;

  if (interest.initiatedBy === "INVESTOR") {
    await db.notification.create({
      data: {
        userId: interest.startupProfile.userId,
        type: "INVESTMENT_INTEREST_RECEIVED",
        title: `${personName(interest.investorProfile)} is interested in your startup`,
        body: "Review and respond to start a conversation.",
        linkPath: "/dashboard/startup/investors",
      },
    });
  } else {
    await db.notification.create({
      data: {
        userId: interest.investorProfile.userId,
        type: "INVESTMENT_INTEREST_RECEIVED",
        title: `${interest.startupProfile.companyName || "A startup"} is interested in your capital`,
        body: "Review and respond to start a conversation.",
        linkPath: "/dashboard/investor/interests",
      },
    });
  }
}

/** Interes de investiție acceptat/refuzat → notificăm INIȚIATORUL. */
export async function notifyInvestmentInterestAnswered(
  db: Db,
  interestId: string,
  action: "accept" | "decline",
): Promise<void> {
  const interest = await db.investmentInterest.findUnique({
    where: { id: interestId },
    select: {
      initiatedBy: true,
      startupProfile: { select: { userId: true, companyName: true } },
      investorProfile: { select: { userId: true, firstName: true, lastName: true } },
    },
  });
  if (!interest) return;

  const accepted = action === "accept";
  const type = accepted
    ? "INVESTMENT_INTEREST_ACCEPTED"
    : "INVESTMENT_INTEREST_DECLINED";
  const verb = accepted ? "accepted" : "declined";

  if (interest.initiatedBy === "INVESTOR") {
    // Investitorul a inițiat → startup-ul a răspuns → notificăm investitorul.
    await db.notification.create({
      data: {
        userId: interest.investorProfile.userId,
        type,
        title: `${interest.startupProfile.companyName || "A startup"} ${verb} your interest`,
        body: accepted ? "You can now discuss an investment." : null,
        linkPath: "/dashboard/investor/browse",
      },
    });
  } else {
    // Startup-ul a inițiat → investitorul a răspuns → notificăm startup-ul.
    await db.notification.create({
      data: {
        userId: interest.startupProfile.userId,
        type,
        title: `${personName(interest.investorProfile)} ${verb} your interest`,
        body: accepted ? "You can now discuss an investment." : null,
        linkPath: "/dashboard/startup/browse-investors",
      },
    });
  }
}
