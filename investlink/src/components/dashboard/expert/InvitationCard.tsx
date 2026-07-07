"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, MapPin, X } from "lucide-react";
import type { ExpertInvitationItem } from "@/lib/dashboard/get-expert-invitations";

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 week ago";
  return `${weeks} weeks ago`;
}

const STATUS_STYLES: Record<string, string> = {
  ACCEPTED: "bg-green-50 text-green-600",
  DECLINED: "bg-red-50 text-red-500",
  WITHDRAWN: "bg-gray-100 text-gray-500",
};

export function InvitationCard({
  invitation,
  interactive,
}: {
  invitation: ExpertInvitationItem;
  interactive: boolean;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState<null | "accept" | "decline">(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  async function respond(action: "accept" | "decline") {
    setSubmitting(action);
    setError(null);

    try {
      const res = await fetch(`/api/invitations/${invitation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Nu s-a putut procesa răspunsul.");
      }
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
          {initialsFrom(invitation.startup.companyName)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate text-[14px] font-bold text-[#1A1D23]">
              {invitation.startup.companyName}
            </div>
            {!interactive && (
              <span
                className={`rounded-full px-[7px] py-[2px] text-[10.5px] font-semibold ${STATUS_STYLES[invitation.status] ?? ""}`}
              >
                {invitation.status.charAt(0) +
                  invitation.status.slice(1).toLowerCase()}
              </span>
            )}
          </div>
          {invitation.startup.location && (
            <div className="flex items-center gap-[3px] text-[11.5px] text-[#9CA3AF]">
              <MapPin className="h-3 w-3" />
              {invitation.startup.location}
            </div>
          )}
        </div>
        <div className="shrink-0 text-[11px] text-[#9CA3AF]">
          {timeAgo(invitation.createdAt)}
        </div>
      </div>

      <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-[#9CA3AF]">
        Role offered
      </div>
      <div className="mb-3 text-[13.5px] font-semibold text-[#374151]">
        {invitation.roleTitle}
      </div>

      {invitation.startup.oneLiner && (
        <p className="mb-3 text-[12.5px] leading-relaxed text-[#6B7280]">
          {invitation.startup.oneLiner}
        </p>
      )}

      {invitation.message && (
        <div className="mb-4 rounded-[8px] bg-[#F9FAFB] px-3 py-[10px] text-[12.5px] leading-relaxed text-[#4B5563]">
          &ldquo;{invitation.message}&rdquo;
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
