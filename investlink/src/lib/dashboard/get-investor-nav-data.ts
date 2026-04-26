import { prisma } from "@/lib/prisma";

export type InvestorNavData = {
  fullName: string;
  firstName: string;
  email: string;
  avatarUrl: string | null;
  initials: string;
  roleLabel: string;
};

function getInitials(name?: string | null, email?: string | null) {
  const source = (name?.trim() || email?.trim() || "Investor").replace(/\s+/g, " ");
  const parts = source.split(" ").filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function getRoleLabel(userType?: string | null) {
  if (userType === "INVESTOR") return "Investor";
  if (!userType) return "Investor";

  return userType
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function getInvestorNavData(email: string): Promise<InvestorNavData> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      name: true,
      email: true,
      image: true,
      type: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const fullName = user.name?.trim() || "Investor";
  const firstName = fullName.split(" ")[0] || "Investor";

  return {
    fullName,
    firstName,
    email: user.email,
    avatarUrl: user.image,
    initials: getInitials(user.name, user.email),
    roleLabel: getRoleLabel(user.type),
  };
}