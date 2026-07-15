"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Star, X } from "lucide-react";

/**
 * Modal de terminare, reutilizabil pe ambele dashboard-uri (startup și expert).
 * Acțiunea e identică — endpoint-ul determină rolul server-side. counterpartLabel
 * e doar textul afișat ("expert" sau "startup") pentru claritate.
 *
 * Rating-ul e OPȚIONAL: cine termină poate evalua sau poate sări. Un rating dat
 * doar când cineva chiar vrea e mai onest decât unul forțat de complezență.
 */
export function EndCollaborationButton({
  collaborationId,
  counterpartLabel,
}: {
  collaborationId: string;
  counterpartLabel: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [outcome, setOutcome] = useState<"completed" | "cancelled">(
    "completed",
  );
  const [reason, setReason] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/collaborations/${collaborationId}/end`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outcome,
          reason: reason.trim() || undefined,
          rating: rating > 0 ? rating : undefined,
          comment: comment.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Nu s-a putut încheia colaborarea.");
      }
      setOpen(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Eroare necunoscută.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-[7px] border border-[#D1D5DB] px-3 py-[6px] text-[12px] font-semibold text-[#6B7280] hover:border-[#DC2626] hover:text-[#DC2626]"
      >
        End collaboration
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-[#1A1D23]">
                  End collaboration
                </h3>
                <p className="text-[12.5px] text-[#9CA3AF]">
                  This ends the collaboration with your {counterpartLabel}. It
                  can&apos;t be undone.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[#9CA3AF] hover:text-[#374151]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Outcome */}
            <div className="mb-4">
              <div className="mb-[6px] text-[12px] font-semibold text-[#374151]">
                How did it end?
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setOutcome("completed")}
                  className={`flex-1 rounded-[7px] border px-3 py-2 text-[12.5px] font-semibold ${
                    outcome === "completed"
                      ? "border-[#2563EB] bg-[#EFF4FF] text-[#2563EB]"
                      : "border-[#D1D5DB] text-[#6B7280]"
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setOutcome("cancelled")}
                  className={`flex-1 rounded-[7px] border px-3 py-2 text-[12.5px] font-semibold ${
                    outcome === "cancelled"
                      ? "border-[#DC2626] bg-[#FEF2F2] text-[#DC2626]"
                      : "border-[#D1D5DB] text-[#6B7280]"
                  }`}
                >
                  Cancelled
                </button>
              </div>
            </div>

            {/* Rating — opțional */}
            <div className="mb-4">
              <div className="mb-[6px] text-[12px] font-semibold text-[#374151]">
                Rate your {counterpartLabel}{" "}
                <span className="font-normal text-[#9CA3AF]">
                  (optional, private)
                </span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(n === rating ? 0 : n)}
                    aria-label={`${n} stars`}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        n <= rating
                          ? "fill-[#FBBF24] text-[#FBBF24]"
                          : "text-[#D1D5DB]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment — opțional */}
            <div className="mb-4">
              <label className="mb-1 block text-[12px] font-semibold text-[#374151]">
                Comment{" "}
                <span className="font-normal text-[#9CA3AF]">(optional)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                placeholder="Private feedback, visible only on this collaboration."
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
                onClick={() => setOpen(false)}
                disabled={submitting}
                className="rounded-[7px] px-4 py-2 text-[13px] font-semibold text-[#6B7280] hover:bg-[#F3F4F6] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={submitting}
                className="flex items-center gap-[6px] rounded-[7px] bg-[#DC2626] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#b91c1c] disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                End collaboration
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
