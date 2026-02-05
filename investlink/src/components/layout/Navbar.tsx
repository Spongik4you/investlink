"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/investors", label: "Investors" },
  { href: "/startups", label: "Startups" },
  { href: "/experts", label: "Experts" },
  { href: "/pricing", label: "Pricing" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo (aici pui icon-ul nou, vezi punctul 3) */}
        <Link href="/" className="flex items-center gap-2 font-bold">
          <div className="h-9 w-9 overflow-hidden rounded-xl bg-blue-600 text-white grid place-items-center">
            {/* opțional: svg inline mic */}
            ↗
          </div>
          InvestLink
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  active
                    ? "rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700"
                    : "rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/signin" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
            Sign In
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
