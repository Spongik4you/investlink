"use client";

import { useState } from "react";
import styles from "@/app/onboarding/onboarding.module.css";

type Props = {
  onBack: () => void;
  onNext: () => void;
};

const FOUNDER_BG = [
  "Serial entrepreneur",
  "First-time founder",
  "Ex-FAANG / Big Tech",
  "Academic / PhD",
  "Ex-VC / Finance",
  "Domain expert",
];

const TRACTION_OPTIONS = [
  "Paying customers",
  "Letters of Intent (LOIs)",
  "Patents / IP filed",
  "Regulatory approval",
  "Strategic partnerships",
  "Award / recognition",
  "Prior VC backing",
  "Accelerator alumni",
];

const PREV_FUNDING_OPTIONS = [
  "None",
  "Bootstrapped",
  "Friends & Family",
  "Grant / Non-dilutive",
  "Angel round",
  "Pre-seed VC",
];

function toggleInList(value: string, setFn: React.Dispatch<React.SetStateAction<string[]>>) {
  setFn((prev) =>
    prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
  );
}

export default function StartupStep4({ onBack, onNext }: Props) {
  const [founderCount, setFounderCount] = useState("2");
  const [teamSize, setTeamSize] = useState("4–10");

  const [founderBg, setFounderBg] = useState<string[]>([
    "Serial entrepreneur",
    "Ex-FAANG / Big Tech",
  ]);
  const [founderBgOther, setFounderBgOther] = useState("");
  const [founderBgOtherSel, setFounderBgOtherSel] = useState(false);

  const [traction, setTraction] = useState<string[]>([
    "Paying customers",
    "Patents / IP filed",
    "Strategic partnerships",
  ]);
  const [tractionOther, setTractionOther] = useState("");
  const [tractionOtherSel, setTractionOtherSel] = useState(false);

  const [prevFunding, setPrevFunding] = useState("Bootstrapped");
  const [prevFundingOther, setPrevFundingOther] = useState("");
  const [prevFundingIsOther, setPrevFundingIsOther] = useState(false);

  return (
    <div className={[styles.stepForm, styles.active].join(" ")}>
      <div className={styles.stepHeader}>
        <div className={styles.stepTag}>Team & Traction</div>
        <div className={styles.stepTitle}>Your team and key metrics</div>
        <div className={styles.stepSub}>
          Investors invest in people first. Share your team structure and
          traction to build confidence.
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Number of Founders</label>
          <select
            className={styles.formInput}
            value={founderCount}
            onChange={(e) => setFounderCount(e.target.value)}
          >
            <option>1 (Solo founder)</option>
            <option>2</option>
            <option>3</option>
            <option>4+</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Total Team Size (incl. part-time)
          </label>
          <select
            className={styles.formInput}
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
          >
            <option>1–3</option>
            <option>4–10</option>
            <option>11–25</option>
            <option>26–50</option>
            <option>50+</option>
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Founder Background</label>
        <div className={styles.chipGroup}>
          {FOUNDER_BG.map((opt) => {
            const selected = founderBg.includes(opt);
            return (
              <div
                key={opt}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => toggleInList(opt, setFounderBg)}
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
              founderBgOtherSel ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              setFounderBgOtherSel((v) => !v);
              if (founderBgOtherSel) setFounderBgOther("");
            }}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>
          {founderBgOtherSel && (
            <div className={styles.otherInputWrap}>
              <input
                className={styles.otherInput}
                placeholder="e.g. Government / Policy, Military, Healthcare…"
                type="text"
                value={founderBgOther}
                onChange={(e) => setFounderBgOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Key Traction Metrics (select all that apply)
        </label>
        <div className={styles.chipGroup}>
          {TRACTION_OPTIONS.map((opt) => {
            const selected = traction.includes(opt);
            return (
              <div
                key={opt}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => toggleInList(opt, setTraction)}
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
              tractionOtherSel ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              setTractionOtherSel((v) => !v);
              if (tractionOtherSel) setTractionOther("");
            }}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>
          {tractionOtherSel && (
            <div className={styles.otherInputWrap}>
              <input
                className={styles.otherInput}
                placeholder="e.g. FDA approval, Government contract, Media coverage…"
                type="text"
                value={tractionOther}
                onChange={(e) => setTractionOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Previous Funding Raised</label>
        <div className={styles.chipGroup}>
          {PREV_FUNDING_OPTIONS.map((opt) => {
            const selected = !prevFundingIsOther && prevFunding === opt;
            return (
              <div
                key={opt}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  setPrevFundingIsOther(false);
                  setPrevFunding(opt);
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
              prevFundingIsOther ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setPrevFundingIsOther(true)}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>
          {prevFundingIsOther && (
            <div className={styles.otherInputWrap}>
              <input
                className={styles.otherInput}
                placeholder="e.g. Revenue-based financing, ICO, Corporate VC…"
                type="text"
                value={prevFundingOther}
                onChange={(e) => setPrevFundingOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
