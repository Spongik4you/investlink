"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { ExpertDirectoryCard } from "@/lib/dashboard/get-expert-directory";
import { ExpertDirectoryCardItem } from "./ExpertDirectoryCardItem";

type Props = {
  experts: ExpertDirectoryCard[];
  categories: string[];
};

const RATE_OPTIONS = [
  { label: "Hourly Rate", value: "" },
  { label: "< $100/h", value: "100" },
  { label: "< $200/h", value: "200" },
  { label: "< $300/h", value: "300" },
];

export function ExpertDirectorySection({ experts, categories }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("");
  const [maxRate, setMaxRate] = useState("");

  // Filtrare pe client: setul e mic (≤60), deci nu justifică un round-trip
  // la server pentru fiecare tastă. Query-ul server-side rămâne sursa
  // inițială și suportă aceleași filtre dacă setul crește.
  const availabilities = useMemo(() => {
    const set = new Set<string>();
    for (const e of experts) if (e.availability) set.add(e.availability);
    return Array.from(set).sort();
  }, [experts]);

  const filtered = useMemo(() => {
    return experts.filter((e) => {
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const hay = [
          e.fullName,
          e.title ?? "",
          ...e.skills,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (category && e.primaryCategory !== category) return false;
      if (availability && e.availability !== availability) return false;
      if (maxRate) {
        const cap = Number(maxRate);
        if (e.hourlyRateUsd == null || e.hourlyRateUsd >= cap) return false;
      }
      return true;
    });
  }, [experts, search, category, availability, maxRate]);

  return (
    <section>
      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#9CA3AF]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search experts…"
            className="w-[220px] rounded-[7px] border border-[#D1D5DB] py-[7px] pl-9 pr-3 text-[13px] outline-none focus:border-[#2563EB]"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-[7px] border border-[#D1D5DB] px-3 py-[7px] text-[13px] text-[#374151] outline-none focus:border-[#2563EB]"
        >
          <option value="">Category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="rounded-[7px] border border-[#D1D5DB] px-3 py-[7px] text-[13px] text-[#374151] outline-none focus:border-[#2563EB]"
        >
          <option value="">Availability</option>
          {availabilities.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select
          value={maxRate}
          onChange={(e) => setMaxRate(e.target.value)}
          className="rounded-[7px] border border-[#D1D5DB] px-3 py-[7px] text-[13px] text-[#374151] outline-none focus:border-[#2563EB]"
        >
          {RATE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        <span className="ml-auto text-[12.5px] text-[#9CA3AF]">
          {filtered.length} {filtered.length === 1 ? "expert" : "experts"}
        </span>
      </div>

      <div className="mb-1 text-[15px] font-bold text-[#1A1D23]">
        Discover Experts
      </div>
      <div className="mb-4 text-[12.5px] text-[#9CA3AF]">
        Find and invite specialists to collaborate with your startup.
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-5 py-10 text-center text-[13px] text-[#9CA3AF]">
          No experts match your filters. Try widening the search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((expert) => (
            <ExpertDirectoryCardItem
              key={expert.expertProfileId}
              expert={expert}
            />
          ))}
        </div>
      )}
    </section>
  );
}
