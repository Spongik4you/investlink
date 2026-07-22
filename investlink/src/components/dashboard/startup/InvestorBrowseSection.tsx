"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { InvestorForStartupCard } from "@/lib/dashboard/get-investors-for-startup";
import { InvestorCardItem } from "./InvestorCardItem";

export function InvestorBrowseSection({
  investors,
  investorTypes,
}: {
  investors: InvestorForStartupCard[];
  investorTypes: string[];
}) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [sector, setSector] = useState("");

  const sectors = useMemo(() => {
    const set = new Set<string>();
    for (const inv of investors) for (const s of inv.sectors) set.add(s);
    return Array.from(set).sort();
  }, [investors]);

  const filtered = useMemo(() => {
    return investors.filter((inv) => {
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const hay = [inv.name, inv.title ?? "", ...inv.sectors]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (type && inv.investorType !== type) return false;
      if (sector && !inv.sectors.includes(sector)) return false;
      return true;
    });
  }, [investors, search, type, sector]);

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#9CA3AF]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search investors…"
            className="w-[220px] rounded-[7px] border border-[#D1D5DB] py-[7px] pl-9 pr-3 text-[13px] outline-none focus:border-[#2563EB]"
          />
        </div>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-[7px] border border-[#D1D5DB] px-3 py-[7px] text-[13px] text-[#374151] outline-none focus:border-[#2563EB]"
        >
          <option value="">Investor type</option>
          {investorTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="rounded-[7px] border border-[#D1D5DB] px-3 py-[7px] text-[13px] text-[#374151] outline-none focus:border-[#2563EB]"
        >
          <option value="">Sector</option>
          {sectors.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <span className="ml-auto text-[12.5px] text-[#9CA3AF]">
          {filtered.length} {filtered.length === 1 ? "investor" : "investors"}
        </span>
      </div>

      <div className="mb-1 text-[15px] font-bold text-[#1A1D23]">
        Discover Investors
      </div>
      <div className="mb-4 text-[12.5px] text-[#9CA3AF]">
        Find investors matching your stage and sector, and express interest.
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-5 py-10 text-center text-[13px] text-[#9CA3AF]">
          No investors match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((inv) => (
            <InvestorCardItem key={inv.investorProfileId} investor={inv} />
          ))}
        </div>
      )}
    </section>
  );
}
