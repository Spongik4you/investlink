import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { UserType } from "@prisma/client";
import { getOnboardingPath } from "@/lib/navigation";

// Mapare: prefix de rută -> rolul obligatoriu pentru acea rută.
const ROLE_BY_PATH_PREFIX: Array<[string, UserType]> = [
  ["/dashboard/startup", "STARTUP"],
  ["/dashboard/investor", "INVESTOR"],
  ["/dashboard/expert", "EXPERT"],
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Neautentificat -> înapoi la login, cu revenire la pagina cerută.
  if (!token) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  const matchedRule = ROLE_BY_PATH_PREFIX.find(([prefix]) =>
    pathname.startsWith(prefix),
  );

  if (matchedRule) {
    const [, requiredRole] = matchedRule;

    // Rol greșit pentru acest dashboard -> pagină de redirecționare, nu acces.
    if (token.type !== requiredRole) {
      return NextResponse.redirect(new URL("/auth/continue", req.url));
    }

    // Onboarding neterminat -> înapoi la wizard, nu la dashboard gol.
    if (token.onboardingStatus !== "COMPLETED") {
      return NextResponse.redirect(
        new URL(getOnboardingPath(requiredRole), req.url),
      );
    }
  }

  return NextResponse.next();
}

// Middleware-ul rulează DOAR pe rutele de dashboard.
// Orice pagină nouă adăugată sub /dashboard e automat protejată,
// fără să mai fie nevoie de verificări manuale în fiecare page.tsx.
export const config = {
  matcher: ["/dashboard/:path*"],
};