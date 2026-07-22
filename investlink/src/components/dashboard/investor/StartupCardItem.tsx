"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, Send, X } from "lucide-react";
import type { StartupForInvestorCard } from "@/lib/dashboard/get-startups-for-investor";

const GRADIENTS = [
  "linear-gradient(135deg,#60a5fa,#2563eb)",
  "linear-gradient(135deg,#34d399,#059669)",
  "linear-gradient(135deg,#f472b6,#ec4899)",
  "linear-gradient(135deg,#fbbf24,#f59e0b)",
  "linear-gradient(135deg,#a78bfa,#7c3aed)",
];

function gradientFor(id: string): string {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return GRADIENTS[sum % GRADIENTS.length];
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function StartupCardItem({ startup }: { startup: StartupForInvestorCard }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(startup.hasPendingInterest);

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/investment-interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startupProfileId: startup.startupProfileId,
          message: message.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Nu s-a putut trimite.");
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
        <div className="mb-3 flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-[10px] text-[15px] font-bold text-white"
            style={{ background: gradientFor(startup.startupProfileId) }}
          >
            {initialsFrom(startup.companyName)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[14px] font-bold text-[#1A1D23]">
              {startup.companyName}
            </div>
            {startup.location && (
              <div className="flex items-center gap-[3px] text-[11.5px] text-[#9CA3AF]">
                <MapPin className="h-3 w-3" />
                {startup.location}
              </div>
            )}
          </div>
        </div>

        {startup.oneLiner && (
          <p className="mb-3 line-clamp-2 text-[12.5px] leading-relaxed text-[#6B7280]">
            {startup.oneLiner}
          </p>
        )}

        {startup.industries.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-[5px]">
            {startup.industries.map((ind) => (
              <span
                key={ind}
                className="rounded-full bg-[#EFF4FF] px-[8px] py-[2px] text-[10.5px] font-medium text-[#2563EB]"
              >
                {ind}
              </span>
            ))}
          </div>
        )}

        <div className="mb-3 mt-auto flex items-center justify-between text-[12px]">
          <span className="text-[#9CA3AF]">
            {startup.fundingStage ?? "Stage n/a"}
          </span>
          {startup.fundraisingGoalUsd != null && (
            <span className="font-semibold text-[#1A1D23]">
              ${startup.fundraisingGoalUsd.toLocaleString()} goal
            </span>
          )}
        </div>

        {sent ? (
          <div className="flex w-full items-center justify-center rounded-[7px] bg-[#F0FDF4] px-3 py-[7px] text-[12.5px] font-semibold text-[#16A34A]">
            Interest sent
          </div>
        ) : (
          <button
            onClick={() => setModalOpen(true)}
            className="flex w-full items-center justify-center rounded-[7px] bg-[#2563EB] px-3 py-[7px] text-[12.5px] font-semibold text-white hover:bg-[#1d4ed8]"
          >
            Express Interest
          </button>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-[#1A1D23]">
                  Express interest in {startup.companyName}
                </h3>
                <p className="text-[12.5px] text-[#9CA3AF]">
                  The startup can accept or decline. This starts a conversation,
                  not an investment.
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

            <div className="mb-4">
              <label className="mb-1 block text-[12px] font-semibold text-[#374151]">
                Message <span className="font-normal text-[#9CA3AF]">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Introduce yourself and why you're interested."
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
                onClick={submit}
                disabled={submitting}
                className="flex items-center gap-[6px] rounded-[7px] bg-[#2563EB] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1d4ed8] disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send interest
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
