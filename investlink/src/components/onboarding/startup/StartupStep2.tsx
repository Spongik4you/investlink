"use client";

import { useState } from "react";
import styles from "@/app/onboarding/onboarding.module.css";
import { useOnboardingStepSync } from "@/contexts/OnboardingWizardContext";

type Props = {
  onBack: () => void;
  onNext: () => void;
};

const INDUSTRY_OPTIONS = [
  "🤖 AI / Machine Learning",
  "🏥 HealthTech / BioTech",
  "💳 FinTech",
  "🌿 CleanTech",
  "🚀 SpaceTech",
  "🔒 Cybersecurity",
  "🧩 SaaS / B2B",
  "🎓 EdTech",
  "🏗 PropTech",
  "🍔 AgriTech",
  "🛒 Consumer / D2C",
  "🏭 DeepTech / Hardware",
];

type StageKey = "pre-seed" | "seed" | "series-a" | "series-b-plus" | "other";

const STAGE_CARDS: {
  key: StageKey;
  icon: string;
  name: string;
  desc: string;
}[] = [
  {
    key: "pre-seed",
    icon: "🌱",
    name: "Pre-Seed",
    desc: "Idea stage, building MVP",
  },
  {
    key: "seed",
    icon: "🌿",
    name: "Seed",
    desc: "MVP ready, early traction",
  },
  {
    key: "series-a",
    icon: "🌳",
    name: "Series A",
    desc: "Scaling with product-market fit",
  },
  {
    key: "series-b-plus",
    icon: "🏢",
    name: "Series B+",
    desc: "Significant revenue, scaling team",
  },
];

function toggleInList(value: string, setFn: React.Dispatch<React.SetStateAction<string[]>>) {
  setFn((prev) =>
    prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
  );
}

export default function StartupStep2({ onBack, onNext }: Props) {
  const [industries, setIndustries] = useState<string[]>(["🤖 AI / Machine Learning"]);
  const [industryOther, setIndustryOther] = useState("");
  const [industryOtherSelected, setIndustryOtherSelected] = useState(false);

  const [fundingStage, setFundingStage] = useState<StageKey>("seed");
  const [stageOther, setStageOther] = useState("");

  useOnboardingStepSync(
    "startup",
    2,
    () => ({
      industries,
      industryOther,
      industryOtherSelected,
      fundingStage,
      stageOther,
    }),
    [
      industries,
      industryOther,
      industryOtherSelected,
      fundingStage,
      stageOther,
    ]
  );

  return (
    <div className={[styles.stepForm, styles.active].join(" ")}>
      <div className={styles.stepHeader}>
        <div className={styles.stepTag}>Industry & Stage</div>
        <div className={styles.stepTitle}>What space are you in?</div>
        <div className={styles.stepSub}>
          This determines which investors and experts see your profile in their
          curated feed.
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Primary Industry / Vertical</label>
        <div className={styles.chipGroup}>
          {INDUSTRY_OPTIONS.map((label) => {
            const selected = industries.includes(label);
            return (
              <div
                key={label}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => toggleInList(label, setIndustries)}
                role="button"
                tabIndex={0}
              >
                {label}
              </div>
            );
          })}
          <div
            className={[
              styles.chip,
              industryOtherSelected ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              setIndustryOtherSelected((v) => !v);
              if (industryOtherSelected) setIndustryOther("");
            }}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>
          {industryOtherSelected && (
            <div className={styles.otherInputWrap}>
              <input
                className={styles.otherInput}
                placeholder="e.g. Space Tech, Robotics, Web3…"
                type="text"
                value={industryOther}
                onChange={(e) => setIndustryOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Current Funding Stage</label>
        <div className={[styles.cardChoiceGroup, styles.cols2].join(" ")}>
          {STAGE_CARDS.map((card) => {
            const selected = fundingStage === card.key;
            return (
              <div
                key={card.key}
                className={[styles.cardChoice, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setFundingStage(card.key)}
                role="button"
                tabIndex={0}
              >
                <div className={styles.ccIcon}>{card.icon}</div>
                <div className={styles.ccContent}>
                  <div className={styles.ccName}>{card.name}</div>
                  <div className={styles.ccDesc}>{card.desc}</div>
                </div>
                <div className={styles.ccCheck}>{selected ? "✓" : ""}</div>
              </div>
            );
          })}

          <div
            className={[
              styles.cardChoice,
              styles.ccOther,
              fundingStage === "other" ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setFundingStage("other")}
            role="button"
            tabIndex={0}
          >
            <div className={styles.ccIcon}>✏️</div>
            <div className={styles.ccContent}>
              <div className={styles.ccName}>Other</div>
              <div className={styles.ccDesc}>
                Bridge round, revenue-based, other
              </div>
            </div>
            <div className={styles.ccCheck}>
              {fundingStage === "other" ? "✓" : ""}
            </div>
          </div>

          {fundingStage === "other" && (
            <div
              className={styles.otherInputWrap}
              style={{ gridColumn: "1 / -1" }}
            >
              <input
                className={styles.otherInput}
                placeholder="e.g. Bridge round, Post-Series B, Pre-IPO…"
                type="text"
                value={stageOther}
                onChange={(e) => setStageOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
