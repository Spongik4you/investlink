"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "@/app/onboarding/onboarding.module.css";
import { COUNTRIES } from "@/lib/countries";
import { citiesForCountry } from "@/lib/cities";

const POPULAR = ["United States", "United Kingdom", "Germany", "Singapore", "Romania", "Moldova"];

function SearchSelect({
  label, value, onChange, options, placeholder, emptyHint, allowFreeText,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder: string; emptyHint?: string; allowFreeText?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    const prefix = options.filter((o) => o.toLowerCase().startsWith(q));
    const rest = options.filter((o) => !o.toLowerCase().startsWith(q) && o.toLowerCase().includes(q));
    return [...prefix, ...rest];
  }, [query, options]);

  return (
    <div className={styles.formGroup} ref={ref} style={{ position: "relative" }}>
      <label className={styles.formLabel}>{label}</label>
      <input
        className={styles.formInput}
        value={open ? query : value}
        placeholder={value || placeholder}
        onFocus={() => { setOpen(true); setQuery(""); }}
        onChange={(e) => { setQuery(e.target.value); if (allowFreeText) onChange(e.target.value); }}
      />
      {open && (
        <div style={{ position: "absolute", zIndex: 30, top: "100%", left: 0, right: 0, marginTop: 4, maxHeight: 240, overflowY: "auto", background: "#fff", border: "1.5px solid var(--gray-200)", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,.10)" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "12px 14px", fontSize: 13, color: "#94A3B8" }}>
              {allowFreeText ? "Keep typing to use your own entry." : (emptyHint ?? "No match.")}
            </div>
          ) : (
            filtered.map((opt) => (
              <button key={opt} type="button"
                onClick={() => { onChange(opt); setQuery(""); setOpen(false); }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", fontSize: 14, color: opt === value ? "#2563EB" : "#1A1D23", fontWeight: opt === value ? 600 : 400, background: opt === value ? "#F5F8FF" : "transparent", border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => { if (opt !== value) e.currentTarget.style.background = "#F9FAFB"; }}
                onMouseLeave={(e) => { if (opt !== value) e.currentTarget.style.background = "transparent"; }}
              >{opt}</button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function CountryCitySelect({
  country, city, onCountryChange, onCityChange, countryLabel = "Country", cityLabel = "City",
}: {
  country: string; city: string;
  onCountryChange: (v: string) => void; onCityChange: (v: string) => void;
  countryLabel?: string; cityLabel?: string;
}) {
  const countryOptions = useMemo(() => {
    const rest = COUNTRIES.filter((c) => !POPULAR.includes(c));
    return [...POPULAR, ...rest];
  }, []);
  const cityOptions = useMemo(() => citiesForCountry(country), [country]);
  const cityIsFree = cityOptions.length === 0;

  return (
    <div className={styles.formRow}>
      <SearchSelect label={countryLabel} value={country}
        onChange={(v) => { onCountryChange(v); onCityChange(""); }}
        options={countryOptions} placeholder="Type to search countries…" />
      <SearchSelect label={cityLabel} value={city} onChange={onCityChange}
        options={cityOptions}
        placeholder={!country ? "Pick a country first" : cityIsFree ? "Type your city" : "Type to search cities…"}
        allowFreeText={cityIsFree} emptyHint="Type your city" />
    </div>
  );
}
