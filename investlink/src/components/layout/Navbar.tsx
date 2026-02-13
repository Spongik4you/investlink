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
        <Link href="/" className="group flex items-center gap-2 font-bold text-slate-900">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-blue-700 text-white
                        transition-transform duration-200 group-hover:scale-105" aria-hidden="true">
            <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.0"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* trending line */}
                <path d="M4 16l6-6 4 4 6-6" />
                {/* arrow corner */}
                <path d="M20 8v6" />
                <path d="M20 8h-6" />
              </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">InvestLink</span>
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
                    ? "rounded-md bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700"
                    : "rounded-md px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/auth/signin" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
