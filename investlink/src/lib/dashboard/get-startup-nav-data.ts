import { prisma } from "@/lib/prisma";
import type { DashboardNavData } from "@/components/dashboard/shared/DashboardLayoutClient";

function getInitials(name?: string | null, email?: string | null) {
  const source = (name?.trim() || email?.trim() || "Startup").replace(
    /\s+/g,
    " ",
  );

  const parts = source.split(" ").filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

export async function getStartupNavData(
  email: string,
): Promise<DashboardNavData> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      name: true,
      email: true,
      image: true,
      type: true,
      startupProfile: {
        select: {
          companyName: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const companyName =
    user.startupProfile?.companyName?.trim() ||
    user.name?.trim() ||
    "Startup";

  return {
    fullName: companyName,
    firstName: companyName.split(" ")[0] || "Startup",
    email: user.email,
    avatarUrl: user.image,
    initials: getInitials(companyName, user.email),
    roleLabel: "Startup Account",
  };
}