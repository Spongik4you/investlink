"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Loader2, Send, X } from "lucide-react";
import type { ExpertDirectoryCard } from "@/lib/dashboard/get-expert-directory";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#60a5fa,#2563eb)",
  "linear-gradient(135deg,#34d399,#059669)",
  "linear-gradient(135deg,#f472b6,#ec4899)",
  "linear-gradient(135deg,#fbbf24,#f59e0b)",
  "linear-gradient(135deg,#a78bfa,#7c3aed)",
];

function gradientFor(id: string): string {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length];
}

export function ExpertDirectoryCardItem({
  expert,
}: {
  expert: ExpertDirectoryCard;
}) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [roleTitle, setRoleTitle] = useState(expert.title ?? "");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(expert.invitationPending);

  async function submitInvite() {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expertProfileId: expert.expertProfileId,
          roleTitle: roleTitle.trim(),
          message: message.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Nu s-a putut trimite invitația.");
      }

      setSent(true);
      setModalOpen(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Eroare necunoscută.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex flex-col rounded-[10px] border border-[#E8EBF0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,.06),0_1px_8px_rgba(0,0,0,.04)]">
        <div
          className="mb-3 flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-bold text-white"
          style={{ background: gradientFor(expert.expertProfileId) }}
        >
          {expert.initials}
        </div>

        <div className="text-[14px] font-bold text-[#1A1D23]">
          {expert.fullName}
        </div>
        <div className="mb-2 text-[12px] text-[#9CA3AF]">
          {expert.title ?? "Expert"}
        </div>

        {expert.skills.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-[5px]">
            {expert.skills.map((s) => (
              <span
                key={s}
                className="rounded-full bg-[#EFF4FF] px-[8px] py-[2px] text-[10.5px] font-medium text-[#2563EB]"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="mb-3 mt-auto flex items-center justify-between text-[12px]">
          <span className="font-semibold text-[#1A1D23]">
            {expert.hourlyRateUsd != null
              ? `$${expert.hourlyRateUsd} / hour`
              : "Rate not set"}
          </span>
          {expert.availability && (
            <span className="flex items-center gap-[4px] text-[11px] text-[#16A34A]">
              <Clock className="h-3 w-3" />
              {expert.availability}
            </span>
          )}
        </div>

        {sent ? (
          <div className="flex w-full items-center justify-center rounded-[7px] bg-[#F0FDF4] px-3 py-[7px] text-[12.5px] font-semibold text-[#16A34A]">
            Invitation sent
          </div>
        ) : (
          <button
            onClick={() => setModalOpen(true)}
            className="flex w-full items-center justify-center rounded-[7px] bg-[#2563EB] px-3 py-[7px] text-[12.5px] font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
          >
            Invite
          </button>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-[#1A1D23]">
                  Invite {expert.fullName}
                </h3>
                <p className="text-[12.5px] text-[#9CA3AF]">
                  Send a collaboration invitation. They can accept or decline.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#9CA3AF] hover:text-[#374151]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-[12px] font-semibold text-[#374151]">
                Role / Title
              </label>
              <input
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Fractional CTO for MVP phase"
                className="w-full rounded-[7px] border border-[#D1D5DB] px-3 py-2 text-[13px] outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-[12px] font-semibold text-[#374151]">
                Message <span className="font-normal text-[#9CA3AF]">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Tell them briefly what you're working on and why they'd be a fit."
                className="w-full resize-none rounded-[7px] border border-[#D1D5DB] px-3 py-2 text-[13px] outline-none focus:border-[#2563EB]"
              />
            </div>

            {error && (
              <div className="mb-3 rounded-[7px] bg-[#FEF2F2] px-3 py-2 text-[12.5px] text-[#DC2626]">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                disabled={submitting}
                className="rounded-[7px] px-4 py-2 text-[13px] font-semibold text-[#6B7280] hover:bg-[#F3F4F6] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submitInvite}
                disabled={submitting || roleTitle.trim().length < 2}
                className="flex items-center gap-[6px] rounded-[7px] bg-[#2563EB] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1d4ed8] disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
