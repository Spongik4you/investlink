"use client";

import { useState } from "react";
import styles from "@/app/onboarding/onboarding.module.css";

type Props = {
  onBack: () => void;
  onNext: () => void;
};

const FUND_USE_OPTIONS = [
  "Product development",
  "Hiring / team expansion",
  "Sales & marketing",
  "Market expansion",
  "Regulatory / compliance",
  "Infrastructure / tech",
];

const REVENUE_OPTIONS = [
  "Pre-revenue",
  "$0 – $10K/mo",
  "$10K – $100K/mo",
  "$100K – $500K/mo",
  "$500K+/mo",
];

function toggleInList(value: string, setFn: React.Dispatch<React.SetStateAction<string[]>>) {
  setFn((prev) =>
    prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
  );
}

export default function StartupStep3({ onBack, onNext }: Props) {
  const [fundraisingGoal, setFundraisingGoal] = useState("$1M – $5M");
  const [equityOffered, setEquityOffered] = useState("12%");
  const [minInvestment, setMinInvestment] = useState("");
  const [preMoney, setPreMoney] = useState("");

  const [revenue, setRevenue] = useState("$0 – $10K/mo");
  const [revenueOther, setRevenueOther] = useState("");
  const [revenueIsOther, setRevenueIsOther] = useState(false);

  const [fundUse, setFundUse] = useState<string[]>([
    "Product development",
    "Hiring / team expansion",
  ]);
  const [fundUseOther, setFundUseOther] = useState("");
  const [fundUseOtherSelected, setFundUseOtherSelected] = useState(false);

  return (
    <div className={[styles.stepForm, styles.active].join(" ")}>
      <div className={styles.stepHeader}>
        <div className={styles.stepTag}>Fundraising Details</div>
        <div className={styles.stepTitle}>Your funding round details</div>
        <div className={styles.stepSub}>
          Be transparent — investors reward clarity. This data is only shared
          with interested, verified investors.
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Fundraising Goal (USD)</label>
          <select
            className={styles.formInput}
            value={fundraisingGoal}
            onChange={(e) => setFundraisingGoal(e.target.value)}
          >
            <option>Under $250,000</option>
            <option>$250K – $1M</option>
            <option>$1M – $5M</option>
            <option>$5M – $20M</option>
            <option>$20M+</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Equity Offered (%)</label>
          <input
            className={styles.formInput}
            value={equityOffered}
            type="text"
            onChange={(e) => setEquityOffered(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Minimum Investment per Investor
          </label>
          <input
            className={styles.formInput}
            placeholder="$25,000"
            type="text"
            value={minInvestment}
            onChange={(e) => setMinInvestment(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Pre-Money Valuation</label>
          <input
            className={styles.formInput}
            placeholder="$8,000,000"
            type="text"
            value={preMoney}
            onChange={(e) => setPreMoney(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Current Monthly Revenue (ARR/MRR)
        </label>
        <div className={styles.chipGroup}>
          {REVENUE_OPTIONS.map((opt) => {
            const selected = !revenueIsOther && revenue === opt;
            return (
              <div
                key={opt}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  setRevenueIsOther(false);
                  setRevenue(opt);
                }}
                role="button"
                tabIndex={0}
              >
                {opt}
              </div>
            );
          })}
          <div
            className={[
              styles.chip,
              revenueIsOther ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              setRevenueIsOther(true);
            }}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>
          {revenueIsOther && (
            <div className={styles.otherInputWrap}>
              <input
                className={styles.otherInput}
                placeholder="e.g. $2M+/mo, GMV-based, subscription ARR…"
                type="text"
                value={revenueOther}
                onChange={(e) => setRevenueOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          What will the funds primarily be used for?
        </label>
        <div className={styles.chipGroup}>
          {FUND_USE_OPTIONS.map((opt) => {
            const selected = fundUse.includes(opt);
            return (
              <div
                key={opt}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => toggleInList(opt, setFundUse)}
                role="button"
                tabIndex={0}
              >
                {opt}
              </div>
            );
          })}
          <div
            className={[
              styles.chip,
              fundUseOtherSelected ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              setFundUseOtherSelected((v) => !v);
              if (fundUseOtherSelected) setFundUseOther("");
            }}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>
          {fundUseOtherSelected && (
            <div className={styles.otherInputWrap}>
              <input
                className={styles.otherInput}
                placeholder="e.g. Clinical trials, Acquisitions, Working capital…"
                type="text"
                value={fundUseOther}
                onChange={(e) => setFundUseOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
