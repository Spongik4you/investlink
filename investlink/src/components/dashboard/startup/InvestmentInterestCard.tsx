"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, MapPin, X } from "lucide-react";
import type { StartupInvestmentInterestItem } from "@/lib/dashboard/get-startup-investment-interests";

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const STATUS_STYLES: Record<string, string> = {
  ACCEPTED: "bg-green-50 text-green-600",
  DECLINED: "bg-red-50 text-red-500",
  WITHDRAWN: "bg-gray-100 text-gray-500",
};

export function InvestmentInterestCard({
  interest,
  interactive,
}: {
  interest: StartupInvestmentInterestItem;
  interactive: boolean;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState<null | "accept" | "decline">(null);
  const [error, setError] = useState<string | null>(null);

  async function respond(action: "accept" | "decline") {
    setSubmitting(action);
    setError(null);
    try {
      const res = await fetch(`/api/investment-interests/${interest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Nu s-a putut procesa.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Eroare necunoscută.");
      setSubmitting(null);
    }
  }

  return (
    <div className="rounded-[10px] border border-[#E8EBF0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,.06),0_1px_8px_rgba(0,0,0,.04)]">
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#EFF4FF] text-[14px] font-bold text-[#2563EB]">
          {initialsFrom(interest.investor.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate text-[14px] font-bold text-[#1A1D23]">
              {interest.investor.name}
            </div>
            {!interactive && (
              <span
                className={`rounded-full px-[7px] py-[2px] text-[10.5px] font-semibold ${STATUS_STYLES[interest.status] ?? ""}`}
              >
                {interest.status.charAt(0) + interest.status.slice(1).toLowerCase()}
              </span>
            )}
          </div>
          <div className="text-[11.5px] text-[#9CA3AF]">
            {[interest.investor.title, interest.investor.investorType]
              .filter(Boolean)
              .join(" · ") || "Investor"}
          </div>
          {interest.investor.location && (
            <div className="flex items-center gap-[3px] text-[11px] text-[#9CA3AF]">
              <MapPin className="h-3 w-3" />
              {interest.investor.location}
            </div>
          )}
        </div>
      </div>

      {interest.investor.sectors.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-[5px]">
          {interest.investor.sectors.map((s) => (
            <span
              key={s}
              className="rounded-full bg-[#EFF4FF] px-[8px] py-[2px] text-[10.5px] font-medium text-[#2563EB]"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {interest.message && (
        <div className="mb-4 rounded-[8px] bg-[#F9FAFB] px-3 py-[10px] text-[12.5px] leading-relaxed text-[#4B5563]">
          &ldquo;{interest.message}&rdquo;
        </div>
      )}

      {error && (
        <div className="mb-3 rounded-[7px] bg-[#FEF2F2] px-3 py-2 text-[12px] text-[#DC2626]">
          {error}
        </div>
      )}

      {interactive && (
        <div className="flex gap-2">
          <button
            onClick={() => respond("accept")}
            disabled={submitting !== null}
            className="flex flex-1 items-center justify-center gap-[6px] rounded-[7px] bg-[#2563EB] px-3 py-2 text-[12.5px] font-semibold text-white hover:bg-[#1d4ed8] disabled:opacity-50"
          >
            {submitting === "accept" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Accept
          </button>
          <button
            onClick={() => respond("decline")}
            disabled={submitting !== null}
            className="flex flex-1 items-center justify-center gap-[6px] rounded-[7px] border border-[#D1D5DB] px-3 py-2 text-[12.5px] font-semibold text-[#6B7280] hover:bg-[#F3F4F6] disabled:opacity-50"
          >
            {submitting === "decline" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
            Decline
          </button>
        </div>
      )}
    </div>
  );
}
