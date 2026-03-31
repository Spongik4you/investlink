"use client";

import { useState } from "react";
import styles from "@/app/onboarding/onboarding.module.css";
import { useOnboardingStepSync } from "@/contexts/OnboardingWizardContext";

type Props = {
  onBack: () => void;
  onNext: () => void;
};

type TicketSize =
  | "under25k"
  | "25k-250k"
  | "250k-2m"
  | "2m+"
  | "other";

type RiskTolerance = "conservative" | "moderate" | "aggressive";

export default function InvestorStep4({ onBack, onNext }: Props) {
  const [ticketSize, setTicketSize] = useState<TicketSize>("25k-250k");
  const [otherTicket, setOtherTicket] = useState("");

  const [investmentFrequency, setInvestmentFrequency] = useState("4–10");
  const [otherFrequency, setOtherFrequency] = useState("");

  const [riskTolerance, setRiskTolerance] =
    useState<RiskTolerance>("moderate");

  const ticketOptions = [
    {
      key: "under25k" as const,
      icon: "💵",
      name: "Under $25,000",
      desc: "Micro / small checks, high volume",
    },
    {
      key: "25k-250k" as const,
      icon: "💵",
      name: "$25K – $250K",
      desc: "Angel / early institutional range",
    },
    {
      key: "250k-2m" as const,
      icon: "💰",
      name: "$250K – $2M",
      desc: "Seed to Series A range",
    },
    {
      key: "2m+" as const,
      icon: "🏦",
      name: "$2M+",
      desc: "Institutional / large fund tickets",
    },
  ];

  const frequencyOptions = ["1–3", "4–10", "11–25", "25+"];

  const riskOptions = [
    {
      key: "conservative" as const,
      icon: "🛡",
      name: "Conservative",
      desc: "Capital preservation",
    },
    {
      key: "moderate" as const,
      icon: "⚖️",
      name: "Moderate",
      desc: "Balanced growth",
    },
    {
      key: "aggressive" as const,
      icon: "🔥",
      name: "Aggressive",
      desc: "Max growth potential",
    },
  ];

  useOnboardingStepSync(
    "investor",
    4,
    () => ({
      ticketSize,
      otherTicket,
      investmentFrequency,
      otherFrequency,
      riskTolerance,
    }),
    [
      ticketSize,
      otherTicket,
      investmentFrequency,
      otherFrequency,
      riskTolerance,
    ]
  );

  return (
    <div className={[styles.stepForm, styles.active].join(" ")}>
      <div className={styles.stepHeader}>
        <div className={styles.stepTag}>Capital & Risk Profile</div>
        <div className={styles.stepTitle}>Your investment parameters</div>
        <div className={styles.stepSub}>
          Helps us surface deals in your comfort zone and connect you with
          compatible co-investors.
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Typical ticket size per investment
        </label>

        <div className={[styles.cardChoiceGroup, styles.cols2].join(" ")}>
          {ticketOptions.map((option) => {
            const selected = ticketSize === option.key;

            return (
              <div
                key={option.key}
                className={[
                  styles.cardChoice,
                  styles.invTicket,
                  selected ? styles.selected : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setTicketSize(option.key)}
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
              styles.invTicket,
              styles.ccOther,
              ticketSize === "other" ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setTicketSize("other")}
            role="button"
            tabIndex={0}
          >
            <div className={styles.ccIcon}>✏️</div>

            <div className={styles.ccContent}>
              <div className={styles.ccName}>Other</div>
              <div className={styles.ccDesc}>
                Custom or flexible ticket size
              </div>
            </div>

            <div className={styles.ccCheck}>
              {ticketSize === "other" ? "✓" : ""}
            </div>
          </div>

          {ticketSize === "other" && (
            <div
              className={styles.otherInputWrap}
              style={{ gridColumn: "1 / -1", display: "block" }}
            >
              <input
                className={styles.otherInput}
                placeholder="e.g. $10M–$50M, case-by-case…"
                type="text"
                value={otherTicket}
                onChange={(e) => setOtherTicket(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup} style={{ marginTop: 4 }}>
        <label className={styles.formLabel}>
          How many investments do you plan to make per year?
        </label>

        <div className={styles.chipGroup}>
          {frequencyOptions.map((option) => (
            <div
              key={option}
              className={[
                styles.chip,
                investmentFrequency === option ? styles.selected : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setInvestmentFrequency(option)}
              role="button"
              tabIndex={0}
            >
              {option}
            </div>
          ))}

          <div
            className={[
              styles.chip,
              investmentFrequency === "other" ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setInvestmentFrequency("other")}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>

          {investmentFrequency === "other" && (
            <div
              className={styles.otherInputWrap}
              style={{ display: "block" }}
            >
              <input
                className={styles.otherInput}
                placeholder="e.g. Varies by year, deal-dependent…"
                type="text"
                value={otherFrequency}
                onChange={(e) => setOtherFrequency(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Risk Tolerance</label>

        <div
          className={styles.cardChoiceGroup}
          style={{ gridTemplateColumns: "repeat(3,1fr)" }}
        >
          {riskOptions.map((option) => {
            const selected = riskTolerance === option.key;

            return (
              <div
                key={option.key}
                className={[
                  styles.cardChoice,
                  styles.invRisk,
                  selected ? styles.selected : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setRiskTolerance(option.key)}
                role="button"
                tabIndex={0}
                style={{
                  flexDirection: "column",
                  textAlign: "center",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div style={{ fontSize: 22 }}>{option.icon}</div>
                <div className={styles.ccName} style={{ fontSize: 13 }}>
                  {option.name}
                </div>
                <div className={styles.ccDesc}>{option.desc}</div>
                <div className={styles.ccCheck} style={{ margin: "0 auto" }}>
                  {selected ? "✓" : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}