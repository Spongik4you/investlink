"use client";

import styles from "@/app/onboarding/onboarding.module.css";
import { useState } from "react";

type Props = {
  onBack: () => void;
  onNext: () => void;
};

export default function InvestorStep1({ onBack, onNext }: Props) {
  const [prevInvestments, setPrevInvestments] = useState("1–5 investments");
  const [prevInvestmentsOther, setPrevInvestmentsOther] = useState("");

  const [successfulExits, setSuccessfulExits] = useState("1–2 exits");
  const [successfulExitsOther, setSuccessfulExitsOther] = useState("");

  const prevInvestmentOptions = [
    "First investment",
    "1–5 investments",
    "6–15 investments",
    "15+ investments",
  ];

  const successfulExitOptions = [
    "None yet",
    "1–2 exits",
    "3–5 exits",
    "5+ exits",
  ];

  return (
    <div className={[styles.stepForm, styles.active].join(" ")}>
      <div className={styles.stepHeader}>
        <div className={styles.stepTag}>Identity & Background</div>
        <div className={styles.stepTitle}>Tell us about yourself</div>
        <div className={styles.stepSub}>
          Basic information to verify your account and personalize your
          experience.
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>First Name</label>
          <input
            className={styles.formInput}
            placeholder="Alexander"
            type="text"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Last Name</label>
          <input className={styles.formInput} placeholder="Wright" type="text" />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Country of Residence</label>
          <select className={styles.formInput} defaultValue="">
            <option value="">Select country…</option>
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Germany</option>
            <option>Singapore</option>
            <option>UAE</option>
            <option>Romania</option>
            <option>Other</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>City</label>
          <input className={styles.formInput} placeholder="New York" type="text" />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Professional Title / Role</label>
        <input
          className={styles.formInput}
          placeholder="e.g. Angel Investor, Fund Manager, Family Office"
          type="text"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          LinkedIn Profile URL{" "}
          <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>
            (optional)
          </span>
        </label>
        <input
          className={styles.formInput}
          placeholder="linkedin.com/in/your-profile"
          type="text"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Short Bio{" "}
          <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>
            (appears in your profile card — visible to startups and experts)
          </span>
        </label>

        <div className={styles.formHint}>
          2–4 sentences describing your background, track record, and what you
          bring beyond capital.
        </div>

        <textarea
          className={styles.formInput}
          placeholder="e.g. Angel investor with 3 successful exits in CleanTech and FinTech. Previously VP at Goldman Sachs. I write $50K–$200K checks at Seed stage and bring hands-on operational support and warm intros to European corporates."
          style={{ height: 100 }}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Number of Previous Investments
        </label>

        <div className={styles.chipGroup}>
          {prevInvestmentOptions.map((option) => {
            const selected = prevInvestments === option;
            return (
              <div
                key={option}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setPrevInvestments(option)}
                role="button"
                tabIndex={0}
              >
                {option}
              </div>
            );
          })}

          <div
            className={[
              styles.chip,
              prevInvestments === "other" ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setPrevInvestments("other")}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>

          {prevInvestments === "other" && (
            <div className={styles.otherInputWrap}>
              <input
                className={styles.otherInput}
                placeholder="Specify number of investments…"
                type="text"
                value={prevInvestmentsOther}
                onChange={(e) => setPrevInvestmentsOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Successful Exits{" "}
          <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>
            (optional — builds credibility)
          </span>
        </label>

        <div className={styles.chipGroup}>
          {successfulExitOptions.map((option) => {
            const selected = successfulExits === option;
            return (
              <div
                key={option}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setSuccessfulExits(option)}
                role="button"
                tabIndex={0}
              >
                {option}
              </div>
            );
          })}

          {/* <div
            className={[
              styles.chip,
              successfulExits === "other" ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setSuccessfulExits("other")}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div> */}

          {/* {successfulExits === "other" && (
            <div className={styles.otherInputWrap} 
                style={{ gridColumn: "1 / -1", display: "block" }}>
              <input
                className={styles.otherInput}
                placeholder="Specify number of exits…"
                type="text"
                value={successfulExitsOther}
                onChange={(e) => setSuccessfulExitsOther(e.target.value)}
              />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}