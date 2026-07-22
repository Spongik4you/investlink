"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, TrendingUp } from "lucide-react";
import type {
  StartupInvestmentsData,
  InvestmentRecord,
} from "@/lib/dashboard/get-startup-investments";
import { InvestmentFormModal } from "./InvestmentFormModal";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function InvestmentsSection({ data }: { data: StartupInvestmentsData }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<InvestmentRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function del(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/investments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      // eroarea rămâne silențioasă aici; într-un pas viitor putem afișa toast
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[15px] font-bold text-[#1A1D23]">
            Investments
          </div>
          <div className="text-[12.5px] text-[#9CA3AF]">
            Record and track investments received.
          </div>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-[6px] rounded-[7px] bg-[#2563EB] px-4 py-[8px] text-[13px] font-semibold text-white hover:bg-[#1d4ed8]"
        >
          <Plus className="h-4 w-4" />
          Record investment
        </button>
      </div>

      {data.investments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-5 py-12 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF4FF]">
            <TrendingUp className="h-5 w-5 text-[#2563EB]" />
          </div>
          <div className="mb-1 text-[13.5px] font-semibold text-[#374151]">
            No investments recorded yet
          </div>
          <p className="max-w-sm text-[12.5px] text-[#9CA3AF]">
            Record investments you&apos;ve received to track your funding and
            see analytics.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[10px] border border-[#E8EBF0] bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8EBF0] bg-[#F9FAFB] text-left">
                <th className="px-4 py-[10px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                  Investor
                </th>
                <th className="px-4 py-[10px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                  Amount
                </th>
                <th className="px-4 py-[10px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                  Round
                </th>
                <th className="px-4 py-[10px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                  Equity
                </th>
                <th className="px-4 py-[10px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                  Date
                </th>
                <th className="px-4 py-[10px] text-right text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.investments.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b border-[#F1F3F5] last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1A1D23]">
                      {inv.investorName}
                      {!inv.onPlatform && (
                        <span className="rounded-full bg-[#F3F4F6] px-[6px] py-[1px] text-[10px] font-medium text-[#6B7280]">
                          External
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-semibold text-[#1A1D23]">
                    {formatUsd(inv.amountUsd)}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#6B7280]">
                    {inv.round ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#6B7280]">
                    {inv.equityPercent != null ? `${inv.equityPercent}%` : "—"}
                  </td>
                  <td className="px-4 py-3 text-[12.5px] text-[#9CA3AF]">
                    {formatDate(inv.investedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {confirmDeleteId === inv.id ? (
                        <>
                          <button
                            onClick={() => del(inv.id)}
                            disabled={deletingId === inv.id}
                            className="flex items-center gap-1 rounded-[6px] bg-[#DC2626] px-[8px] py-[3px] text-[11px] font-semibold text-white hover:bg-[#b91c1c] disabled:opacity-50"
                          >
                            {deletingId === inv.id && (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            )}
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded-[6px] px-[8px] py-[3px] text-[11px] font-medium text-[#9CA3AF] hover:text-[#374151]"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditing(inv);
                              setModalOpen(true);
                            }}
                            className="rounded-[6px] p-[6px] text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#2563EB]"
                            aria-label="Edit"
                          >
                            <Pencil className="h-[15px] w-[15px]" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(inv.id)}
                            className="rounded-[6px] p-[6px] text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#DC2626]"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-[15px] w-[15px]" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <InvestmentFormModal
          linkableInvestors={data.linkableInvestors}
          existing={editing ?? undefined}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      )}
    </section>
  );
}
