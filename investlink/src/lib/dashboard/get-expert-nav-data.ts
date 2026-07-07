import { prisma } from "@/lib/prisma";
import type { DashboardNavData } from "@/components/dashboard/shared/DashboardLayoutClient";

function getInitials(name?: string | null, email?: string | null) {
  const source = (name?.trim() || email?.trim() || "Expert").replace(
    /\s+/g,
    " ",
  );

  const parts = source.split(" ").filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

export async function getExpertNavData(
  email: string,
): Promise<DashboardNavData> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      name: true,
      email: true,
      image: true,
      expertProfile: {
        select: {
          firstName: true,
          lastName: true,
          title: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const profileName = [
    user.expertProfile?.firstName?.trim(),
    user.expertProfile?.lastName?.trim(),
  ]
    .filter(Boolean)
    .join(" ");

  const fullName = profileName || user.name?.trim() || "Expert";

  return {
    fullName,
    firstName: fullName.split(" ")[0] || "Expert",
    email: user.email,
    avatarUrl: user.image,
    initials: getInitials(fullName, user.email),
    roleLabel: user.expertProfile?.title?.trim() || "Expert Account",
  };
}
