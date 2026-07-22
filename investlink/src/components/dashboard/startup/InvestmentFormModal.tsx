"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import type {
  InvestmentRecord,
  LinkableInvestor,
} from "@/lib/dashboard/get-startup-investments";

type Props = {
  linkableInvestors: LinkableInvestor[];
  /** dacă e prezent, modalul e în modul EDIT; altfel CREATE */
  existing?: InvestmentRecord;
  onClose: () => void;
};

export function InvestmentFormModal({
  linkableInvestors,
  existing,
  onClose,
}: Props) {
  const router = useRouter();
  const isEdit = !!existing;

  // "linked" = investitor de pe platformă (dropdown); "external" = nume liber.
  const [mode, setMode] = useState<"linked" | "external">(
    existing?.investorProfileId ? "linked" : "external",
  );
  const [investorProfileId, setInvestorProfileId] = useState(
    existing?.investorProfileId ?? "",
  );
  const [investorName, setInvestorName] = useState(existing?.investorName ?? "");
  const [amount, setAmount] = useState(
    existing ? String(existing.amountUsd) : "",
  );
  const [round, setRound] = useState(existing?.round ?? "");
  const [equity, setEquity] = useState(
    existing?.equityPercent != null ? String(existing.equityPercent) : "",
  );
  const [investedAt, setInvestedAt] = useState(
    existing ? existing.investedAt.slice(0, 10) : "",
  );
  const [note, setNote] = useState(existing?.note ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);

    // Validare client minimă (server revalidează).
    const amountNum = parseFloat(amount);
    if (Number.isNaN(amountNum) || amountNum <= 0) {
      setError("Introdu o sumă validă.");
      return;
    }
    if (!investedAt) {
      setError("Alege data investiției.");
      return;
    }

    let resolvedName = investorName.trim();
    let resolvedProfileId: string | null = null;

    if (mode === "linked") {
      if (!investorProfileId) {
        setError("Alege un investitor sau comută pe „extern”.");
        return;
      }
      resolvedProfileId = investorProfileId;
      resolvedName =
        linkableInvestors.find((i) => i.investorProfileId === investorProfileId)
          ?.name ?? resolvedName;
    } else {
      if (resolvedName.length < 2) {
        setError("Introdu numele investitorului.");
        return;
      }
    }

    const equityNum = equity.trim() ? parseFloat(equity) : undefined;

    const payload = {
      investorProfileId: resolvedProfileId ?? undefined,
      investorName: resolvedName,
      amountUsd: amountNum,
      round: round.trim() || undefined,
      equityPercent: equityNum,
      investedAt: new Date(investedAt).toISOString(),
      note: note.trim() || undefined,
    };

    setSubmitting(true);
    try {
      const url = isEdit ? `/api/investments/${existing!.id}` : "/api/investments";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEdit ? { ...payload, investorProfileId: resolvedProfileId } : payload,
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Nu s-a putut salva.");
      onClose();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Eroare necunoscută.");
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-[16px] font-bold text-[#1A1D23]">
            {isEdit ? "Edit investment" : "Record investment"}
          </h3>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#374151]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Investitor: linked vs external */}
        <div className="mb-3">
          <div className="mb-[6px] flex gap-2">
            <button
              onClick={() => setMode("linked")}
              disabled={linkableInvestors.length === 0}
              className={`flex-1 rounded-[7px] border px-3 py-[6px] text-[12px] font-semibold disabled:opacity-40 ${
                mode === "linked"
                  ? "border-[#2563EB] bg-[#EFF4FF] text-[#2563EB]"
                  : "border-[#D1D5DB] text-[#6B7280]"
              }`}
            >
              From platform
            </button>
            <button
              onClick={() => setMode("external")}
              className={`flex-1 rounded-[7px] border px-3 py-[6px] text-[12px] font-semibold ${
                mode === "external"
                  ? "border-[#2563EB] bg-[#EFF4FF] text-[#2563EB]"
                  : "border-[#D1D5DB] text-[#6B7280]"
              }`}
            >
              External
            </button>
          </div>

          {mode === "linked" ? (
            <select
              value={investorProfileId}
              onChange={(e) => setInvestorProfileId(e.target.value)}
              className="w-full rounded-[7px] border border-[#D1D5DB] px-3 py-2 text-[13px] outline-none focus:border-[#2563EB]"
            >
              <option value="">Select investor…</option>
              {linkableInvestors.map((i) => (
                <option key={i.investorProfileId} value={i.investorProfileId}>
                  {i.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={investorName}
              onChange={(e) => setInvestorName(e.target.value)}
              placeholder="Investor name (external)"
              className="w-full rounded-[7px] border border-[#D1D5DB] px-3 py-2 text-[13px] outline-none focus:border-[#2563EB]"
            />
          )}
          {mode === "linked" && linkableInvestors.length === 0 && (
            <p className="mt-1 text-[11px] text-[#9CA3AF]">
              No accepted investor relationships yet. Use „External” to record
              anyway.
            </p>
          )}
        </div>

        {/* Sumă + dată */}
        <div className="mb-3 flex gap-2">
          <div className="flex-1">
            <label className="mb-1 block text-[12px] font-semibold text-[#374151]">
              Amount (USD)
            </label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min="0"
              placeholder="50000"
              className="w-full rounded-[7px] border border-[#D1D5DB] px-3 py-2 text-[13px] outline-none focus:border-[#2563EB]"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-[12px] font-semibold text-[#374151]">
              Date
            </label>
            <input
              value={investedAt}
              onChange={(e) => setInvestedAt(e.target.value)}
              type="date"
              className="w-full rounded-[7px] border border-[#D1D5DB] px-3 py-2 text-[13px] outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        {/* Rundă + equity (opționale) */}
        <div className="mb-3 flex gap-2">
          <div className="flex-1">
            <label className="mb-1 block text-[12px] font-semibold text-[#374151]">
              Round <span className="font-normal text-[#9CA3AF]">(optional)</span>
            </label>
            <input
              value={round}
              onChange={(e) => setRound(e.target.value)}
              placeholder="Seed, Pre-seed…"
              className="w-full rounded-[7px] border border-[#D1D5DB] px-3 py-2 text-[13px] outline-none focus:border-[#2563EB]"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-[12px] font-semibold text-[#374151]">
              Equity %{" "}
              <span className="font-normal text-[#9CA3AF]">(optional)</span>
            </label>
            <input
              value={equity}
              onChange={(e) => setEquity(e.target.value)}
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="5"
              className="w-full rounded-[7px] border border-[#D1D5DB] px-3 py-2 text-[13px] outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        {/* Notă */}
        <div className="mb-4">
          <label className="mb-1 block text-[12px] font-semibold text-[#374151]">
            Note <span className="font-normal text-[#9CA3AF]">(optional)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="SAFE, convertible, terms…"
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
            onClick={onClose}
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
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Save changes" : "Record"}
          </button>
        </div>
      </div>
    </div>
  );
}
