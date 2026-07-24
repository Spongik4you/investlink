"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ChevronsUpDown, Loader2, LogOut, UserCog } from "lucide-react";

/** Ruta de profil/setări diferă per rol — expertul are „profile", ceilalți „settings". */
const SETTINGS_PATH: Record<string, string> = {
  startup: "/dashboard/startup/settings",
  expert: "/dashboard/expert/profile",
  investor: "/dashboard/investor/settings",
};

export function AccountMenu({
  fullName,
  roleLabel,
  children,
}: {
  fullName: string;
  roleLabel: string;
  /** Avatarul, randat de layout ca să păstrăm o singură definiție. */
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const role = pathname?.split("/")[2] ?? "startup";
  const settingsHref = SETTINGS_PATH[role] ?? "/dashboard";

  // Închide la click în afară.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Închide la Escape — meniul e o suprapunere, trebuie să poată fi anulat.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      {open && (
        <div className="absolute bottom-[calc(100%+8px)] left-0 z-50 w-[196px] overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white shadow-xl">
          <div className="border-b border-[#F1F3F5] px-3 py-[10px]">
            <div className="truncate text-[12.5px] font-semibold text-[#111827]">
              {fullName}
            </div>
            <div className="truncate text-[10.5px] uppercase tracking-[0.04em] text-[#9CA3AF]">
              {roleLabel}
            </div>
          </div>

          <Link
            href={settingsHref}
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-[9px] px-3 py-[9px] text-[12.5px] font-medium text-[#374151] transition hover:bg-[#F9FAFB]"
          >
            <UserCog className="h-[15px] w-[15px] text-[#9CA3AF]" />
            Profile settings
          </Link>

          <button
            onClick={() => {
              setSigningOut(true);
              // callbackUrl: după delogare ajungi pe pagina publică, nu pe
              // dashboard-ul care oricum ar redirecționa la login.
              signOut({ callbackUrl: "/" });
            }}
            disabled={signingOut}
            className="flex w-full items-center gap-[9px] border-t border-[#F1F3F5] px-3 py-[9px] text-[12.5px] font-medium text-[#DC2626] transition hover:bg-[#FEF2F2] disabled:opacity-60"
          >
            {signingOut ? (
              <Loader2 className="h-[15px] w-[15px] animate-spin" />
            ) : (
              <LogOut className="h-[15px] w-[15px]" />
            )}
            Sign out
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex w-full items-center gap-[10px] rounded-[8px] px-2 py-[6px] text-left transition ${
          open ? "bg-[#F3F4F6]" : "hover:bg-[#F9FAFB]"
        }`}
      >
        {children}
        <div className="min-w-0 flex-1 leading-[1.3]">
          <div className="truncate text-[13px] font-semibold text-[#1F2937]">
            {fullName}
          </div>
          <div className="truncate text-[11px] uppercase text-[#9CA3AF]">
            {roleLabel}
          </div>
        </div>
        <ChevronsUpDown className="h-[14px] w-[14px] shrink-0 text-[#9CA3AF]" />
      </button>
    </div>
  );
}
