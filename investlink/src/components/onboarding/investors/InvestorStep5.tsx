"use client";

import { useState } from "react";
import styles from "@/app/onboarding/onboarding.module.css";
import { useOnboardingStepSync } from "@/contexts/OnboardingWizardContext";

type Props = {
  onBack: () => void;
  onNext: () => void;
};

export default function InvestorStep5({ onBack, onNext }: Props) {
  const [startupValues, setStartupValues] = useState<string[]>([

  ]);
  const [otherValue, setOtherValue] = useState("");

  const [boardPreference, setBoardPreference] = useState("");
  const [otherBoard, setOtherBoard] = useState("");

  const [coInvesting, setCoInvesting] = useState("");
  const [otherCoInvesting, setOtherCoInvesting] = useState("");

  const [hearAbout, setHearAbout] = useState("");

  const startupValueOptions = [
    "Strong founding team",
    "Traction & revenue",
    "Market size (TAM)",
    "Proprietary tech / IP",
    "Scalability model",
    "Social / ESG impact",
    "Defensibility / moat",
    "Clear exit strategy",
  ];

  const boardOptions = [
    "Yes, always",
    "Sometimes, deal-specific",
    "No, passive investor",
  ];

  const coInvestingOptions = [
    "Yes, actively looking for syndicates",
    "Open but prefer to lead",
    "No, solo investments only",
  ];

  const toggleStartupValue = (value: string) => {
    setStartupValues((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, value];
    });
  };

  useOnboardingStepSync(
    "investor",
    5,
    () => ({
      startupValues,
      otherValue,
      boardPreference,
      otherBoard,
      coInvesting,
      otherCoInvesting,
      hearAbout,
    }),
    [
      startupValues,
      otherValue,
      boardPreference,
      otherBoard,
      coInvesting,
      otherCoInvesting,
      hearAbout,
    ]
  );

  return (
    <div className={[styles.stepForm, styles.active].join(" ")}>
      <div className={styles.stepHeader}>
        <div className={styles.stepTag}>Collaboration Style</div>
        <div className={styles.stepTitle}>How do you prefer to invest?</div>
        <div className={styles.stepSub}>
          These preferences shape how we present opportunities and connect you
          with other platform members.
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          What do you value most in a startup?{" "}
          <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>
            (pick up to 3)
          </span>
        </label>

        <div className={styles.chipGroup}>
          {startupValueOptions.map((option) => (
            <div
              key={option}
              className={[
                styles.chip,
                startupValues.includes(option) ? styles.selected : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => toggleStartupValue(option)}
              role="button"
              tabIndex={0}
            >
              {option}
            </div>
          ))}

          <div
            className={[
              styles.chip,
              startupValues.includes("other") ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleStartupValue("other")}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>

          {startupValues.includes("other") && (
            <div
              className={styles.otherInputWrap}
              style={{ display: "block" }}
            >
              <input
                className={styles.otherInput}
                placeholder="e.g. Regulatory moat, Network effects…"
                type="text"
                value={otherValue}
                onChange={(e) => setOtherValue(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Do you want board seat or advisory involvement?
        </label>

        <div className={styles.chipGroup}>
          {boardOptions.map((option) => (
            <div
              key={option}
              className={[
                styles.chip,
                boardPreference === option ? styles.selected : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setBoardPreference(option)}
              role="button"
              tabIndex={0}
            >
              {option}
            </div>
          ))}

          <div
            className={[
              styles.chip,
              boardPreference === "other" ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setBoardPreference("other")}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>

          {boardPreference === "other" && (
            <div
              className={styles.otherInputWrap}
              style={{ display: "block" }}
            >
              <input
                className={styles.otherInput}
                placeholder="Describe your preferred involvement…"
                type="text"
                value={otherBoard}
                onChange={(e) => setOtherBoard(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Are you open to co-investing with other InvestLink investors?
        </label>

        <div className={styles.chipGroup}>
          {coInvestingOptions.map((option) => (
            <div
              key={option}
              className={[
                styles.chip,
                coInvesting === option ? styles.selected : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setCoInvesting(option)}
              role="button"
              tabIndex={0}
            >
              {option}
            </div>
          ))}

          <div
            className={[
              styles.chip,
              coInvesting === "other" ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setCoInvesting("other")}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>

          {coInvesting === "other" && (
            <div
              className={styles.otherInputWrap}
              style={{ display: "block" }}
            >
              <input
                className={styles.otherInput}
                placeholder="Describe your syndication preferences…"
                type="text"
                value={otherCoInvesting}
                onChange={(e) => setOtherCoInvesting(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          How did you hear about InvestLink?
        </label>

        <select
          className={styles.formInput}
          value={hearAbout}
          onChange={(e) => setHearAbout(e.target.value)}
        >
          <option value="">Select…</option>
          <option>LinkedIn / Social Media</option>
          <option>Friend or Colleague referral</option>
          <option>Press / News article</option>
          <option>Google / Online search</option>
          <option>VC or Accelerator network</option>
          <option>Other</option>
        </select>
      </div>
    </div>
  );
}