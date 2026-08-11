import type { ReactNode } from "react";

/**
 * Layout propriu pentru auth — FĂRĂ Navbar/Footer.
 *
 * Paginile de auth erau sub (public), care montează Navbar + Footer pe tot.
 * Pe un ecran de autentificare cu shell propriu (panou întunecat), navbar-ul
 * și footer-ul erau zgomot vizual și, când ești deja logat, arătau chiar
 * insigna „Dashboard" peste ecranul de creare cont. Mutate afară, ca
 * onboarding-ul, care are aceeași nevoie.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <main className="min-h-screen w-full bg-slate-50">{children}</main>;
}
