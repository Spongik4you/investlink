"use client";

import styles from "@/app/onboarding/onboarding.module.css";
import { useState } from "react";
import { useOnboardingStepSync } from "@/contexts/OnboardingWizardContext";

type InvestorType =
  | "angel"
  | "vc"
  | "family"
  | "pe"
  | "corp"
  | "inst"
  | "other";

type Props = {
  investorType: InvestorType;
  setInvestorType: React.Dispatch<React.SetStateAction<InvestorType>>;
  onBack: () => void;
  onNext: () => void;
};

const options = [
  {
    key: "angel" as const,
    icon: "👤",
    name: "Angel Investor",
    desc: "Investing personal capital into early-stage startups.",
  },
  {
    key: "vc" as const,
    icon: "🏢",
    name: "Venture Capital",
    desc: "Fund-based investing across multiple portfolio companies.",
  },
  {
    key: "family" as const,
    icon: "🏛",
    name: "Family Office",
    desc: "Managing wealth on behalf of one or more families.",
  },
  {
    key: "pe" as const,
    icon: "💰",
    name: "Private Equity",
    desc: "Investing in established companies or buyouts.",
  },
  {
    key: "corp" as const,
    icon: "🌐",
    name: "Corporate Investor",
    desc: "Strategic investments from a corporation or enterprise.",
  },
  {
    key: "inst" as const,
    icon: "🏦",
    name: "Institutional Fund",
    desc: "Pension, endowment, sovereign wealth, or hedge fund.",
  },
];

export default function InvestorStep2({
  investorType,
  setInvestorType,
  onBack,
  onNext,
}: Props) {
  const [otherInvestorType, setOtherInvestorType] = useState("");

  useOnboardingStepSync(
    "investor",
    2,
    () => ({ investorType, otherInvestorType }),
    [investorType, otherInvestorType]
  );

  return (
    <div className={[styles.stepForm, styles.active].join(" ")}>
      <div className={styles.stepHeader}>
        <div className={styles.stepTag}>Investor Classification</div>
        <div className={styles.stepTitle}>What type of investor are you?</div>
        <div className={styles.stepSub}>
          This helps us apply the right compliance framework and show relevant
          deal flow.
        </div>
      </div>

      <div className={[styles.cardChoiceGroup, styles.cols2].join(" ")}>
        {options.map((option) => {
          const selected = investorType === option.key;

          return (
            <div
              key={option.key}
              className={[
                styles.cardChoice,
                styles.invTypeCard,
                selected ? styles.selected : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setInvestorType(option.key)}
              role="button"
              tabIndex={0}
            >
              <div className={styles.ccIcon}>{option.icon}</div>

              <div className={styles.ccContent}>
                <div className={styles.ccName}>{option.name}</div>
                <div className={styles.ccDesc}>{option.desc}</div>
              </div>

              <div className={styles.ccCheck}>{selected ? "✓" : ""}</div>
            </div>
          );
        })}

        <div
          className={[
            styles.cardChoice,
            styles.invTypeCard,
            styles.ccOther,
            investorType === "other" ? styles.selected : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => setInvestorType("other")}
          role="button"
          tabIndex={0}
        >
          <div className={styles.ccIcon}>✏️</div>

          <div className={styles.ccContent}>
            <div className={styles.ccName}>Other</div>
            <div className={styles.ccDesc}>Something not listed above</div>
          </div>

          <div className={styles.ccCheck}>
            {investorType === "other" ? "✓" : ""}
          </div>
        </div>

        {investorType === "other" && (
          <div
            className={styles.otherInputWrap}
            style={{ gridColumn: "1 / -1", display: "block" }}
          >
            <input
              className={styles.otherInput}
              placeholder="Describe your investor type…"
              type="text"
              value={otherInvestorType}
              onChange={(e) => setOtherInvestorType(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}