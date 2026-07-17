"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, Send, X } from "lucide-react";
import type { StartupDirectoryCard } from "@/lib/dashboard/get-startup-directory";

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function StartupDirectoryCardItem({
  startup,
}: {
  startup: StartupDirectoryCard;
}) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [roleTitle, setRoleTitle] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState(startup.hasPendingRequest);

  async function submitApplication() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startupProfileId: startup.startupProfileId,
          roleTitle: roleTitle.trim(),
          message: message.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Nu s-a putut trimite aplicația.");
      }
      setApplied(true);
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
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#EFF4FF] text-[14px] font-bold text-[#2563EB]">
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
          {startup.fundingStage && (
            <span className="shrink-0 rounded-full bg-[#EFF4FF] px-[8px] py-[2px] text-[10.5px] font-semibold text-[#2563EB]">
              {startup.fundingStage}
            </span>
          )}
        </div>

        {startup.oneLiner && (
          <p className="mb-3 text-[12.5px] leading-relaxed text-[#6B7280]">
            {startup.oneLiner}
          </p>
        )}

        {startup.expertNeeds.length > 0 && (
          <div className="mb-3">
            <div className="mb-[6px] text-[10.5px] font-semibold uppercase tracking-[0.05em] text-[#9CA3AF]">
              Looking for
            </div>
            <div className="flex flex-wrap gap-[5px]">
              {startup.expertNeeds.map((need) => (
                <span
                  key={need}
                  className="rounded-full bg-[#F0FDF4] px-[8px] py-[2px] text-[10.5px] font-medium text-[#16A34A]"
                >
                  {need}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-2">
          {applied ? (
            <div className="flex w-full items-center justify-center rounded-[7px] bg-[#F0FDF4] px-3 py-[7px] text-[12.5px] font-semibold text-[#16A34A]">
              Application sent
            </div>
          ) : (
            <button
              onClick={() => setModalOpen(true)}
              className="flex w-full items-center justify-center rounded-[7px] bg-[#2563EB] px-3 py-[7px] text-[12.5px] font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
            >
              Apply
            </button>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-[#1A1D23]">
                  Apply to {startup.companyName}
                </h3>
                <p className="text-[12.5px] text-[#9CA3AF]">
                  Propose the role you&apos;d fill. They can accept or decline.
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
                Role you&apos;re applying for{" "}
                <span className="font-normal text-[#DC2626]">*</span>
              </label>
              <input
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Fractional CTO, Growth Advisor"
                className="w-full rounded-[7px] border border-[#D1D5DB] px-3 py-2 text-[13px] outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-[12px] font-semibold text-[#374151]">
                Message{" "}
                <span className="font-normal text-[#9CA3AF]">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Briefly, why you're a fit for what they need."
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
                onClick={submitApplication}
                disabled={submitting || roleTitle.trim().length < 2}
                className="flex items-center gap-[6px] rounded-[7px] bg-[#2563EB] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1d4ed8] disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send application
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
