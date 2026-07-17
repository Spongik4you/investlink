"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { StartupDirectoryCard } from "@/lib/dashboard/get-startup-directory";
import { StartupDirectoryCardItem } from "./StartupDirectoryCardItem";

export function StartupDirectorySection({
  startups,
  fundingStages,
}: {
  startups: StartupDirectoryCard[];
  fundingStages: string[];
}) {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");

  const filtered = useMemo(() => {
    return startups.filter((s) => {
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const hay = [
          s.companyName,
          s.oneLiner ?? "",
          ...s.industries,
          ...s.expertNeeds,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (stage && s.fundingStage !== stage) return false;
      return true;
    });
  }, [startups, search, stage]);

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#9CA3AF]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search startups…"
            className="w-[220px] rounded-[7px] border border-[#D1D5DB] py-[7px] pl-9 pr-3 text-[13px] outline-none focus:border-[#2563EB]"
          />
        </div>

        <select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="rounded-[7px] border border-[#D1D5DB] px-3 py-[7px] text-[13px] text-[#374151] outline-none focus:border-[#2563EB]"
        >
          <option value="">Funding stage</option>
          {fundingStages.map((fs) => (
            <option key={fs} value={fs}>
              {fs}
            </option>
          ))}
        </select>

        <span className="ml-auto text-[12.5px] text-[#9CA3AF]">
          {filtered.length} {filtered.length === 1 ? "startup" : "startups"}
        </span>
      </div>

      <div className="mb-1 text-[15px] font-bold text-[#1A1D23]">
        Startups looking for experts
      </div>
      <div className="mb-4 text-[12.5px] text-[#9CA3AF]">
        Apply directly to startups that match your skills.
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-5 py-10 text-center text-[13px] text-[#9CA3AF]">
          No startups match your filters. Try widening the search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((startup) => (
            <StartupDirectoryCardItem
              key={startup.startupProfileId}
              startup={startup}
            />
          ))}
        </div>
      )}
    </section>
  );
}
