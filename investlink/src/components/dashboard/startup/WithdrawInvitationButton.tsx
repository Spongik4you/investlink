"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";

/**
 * Buton de retragere pentru o invitație PENDING, izolat ca singurul element
 * interactiv dintr-un tabel altfel server-rendered. Granița client/server e
 * împinsă cât mai jos — la frunza care chiar are nevoie de interactivitate.
 */
export function WithdrawInvitationButton({
  invitationId,
}: {
  invitationId: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function withdraw() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/invitations/${invitationId}/withdraw`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Nu s-a putut retrage invitația.");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Eroare necunoscută.");
      setSubmitting(false);
      setConfirming(false);
    }
  }

  if (error) {
    return (
      <span className="text-[11px] font-medium text-[#DC2626]">{error}</span>
    );
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-[12px] font-semibold text-[#6B7280] hover:text-[#DC2626]"
      >
        Withdraw
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        onClick={withdraw}
        disabled={submitting}
        className="inline-flex items-center gap-[4px] rounded-[6px] bg-[#DC2626] px-[8px] py-[3px] text-[11.5px] font-semibold text-white hover:bg-[#b91c1c] disabled:opacity-50"
      >
        {submitting ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <X className="h-3 w-3" />
        )}
        Confirm
      </button>
      <button
        onClick={() => setConfirming(false)}
        disabled={submitting}
        className="text-[11.5px] font-medium text-[#9CA3AF] hover:text-[#374151] disabled:opacity-50"
      >
        Cancel
      </button>
    </span>
  );
}
