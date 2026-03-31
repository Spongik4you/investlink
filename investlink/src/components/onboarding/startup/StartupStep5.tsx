"use client";

import { useState } from "react";
import styles from "@/app/onboarding/onboarding.module.css";
import { useOnboardingStepSync } from "@/contexts/OnboardingWizardContext";

type Props = {
  onBack: () => void;
  onNext: () => void;
};

const EXPERT_CATEGORIES = [
  "⚖️ Legal / Compliance",
  "💼 CFO / Finance",
  "🎯 Marketing / GTM",
  "🔧 CTO / Tech Architecture",
  "🔬 Industry / Domain Expert",
  "🎨 Product / UX Design",
  "🤝 Fundraising Coach",
  "📊 Data Science / AI",
  "🏥 Regulatory / FDA",
  "🌐 International Expansion",
];

type EngageKey =
  | "hourly"
  | "retainer"
  | "project"
  | "equity"
  | "other";

const ENGAGEMENT_CARDS: {
  key: EngageKey;
  icon: string;
  name: string;
  desc: string;
}[] = [
  {
    key: "hourly",
    icon: "⏱",
    name: "Hourly / Ad-hoc",
    desc: "Pay for what you need, when you need it",
  },
  {
    key: "retainer",
    icon: "📅",
    name: "Monthly Retainer",
    desc: "Ongoing monthly commitment",
  },
  {
    key: "project",
    icon: "🎯",
    name: "Project-Based",
    desc: "Fixed scope, milestone delivery",
  },
  {
    key: "equity",
    icon: "📈",
    name: "Equity / Hybrid",
    desc: "Mix of cash and equity compensation",
  },
];

const BUDGET_OPTIONS = [
  "Under $1,000 / mo",
  "$1K – $5K / mo",
  "$5K – $20K / mo",
  "$20K+ / mo",
  "Equity only / no cash",
];

function toggleInList(value: string, setFn: React.Dispatch<React.SetStateAction<string[]>>) {
  setFn((prev) =>
    prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
  );
}

export default function StartupStep5({ onBack, onNext }: Props) {
  const [categories, setCategories] = useState<string[]>([
    "⚖️ Legal / Compliance",
    "💼 CFO / Finance",
    "🔬 Industry / Domain Expert",
  ]);
  const [categoriesOther, setCategoriesOther] = useState("");
  const [categoriesOtherSel, setCategoriesOtherSel] = useState(false);

  const [engagement, setEngagement] = useState<EngageKey>("hourly");
  const [engageOther, setEngageOther] = useState("");

  const [budget, setBudget] = useState("Under $1,000 / mo");
  const [budgetOther, setBudgetOther] = useState("");
  const [budgetIsOther, setBudgetIsOther] = useState(false);

  useOnboardingStepSync(
    "startup",
    5,
    () => ({
      categories,
      categoriesOther,
      categoriesOtherSel,
      engagement,
      engageOther,
      budget,
      budgetOther,
      budgetIsOther,
    }),
    [
      categories,
      categoriesOther,
      categoriesOtherSel,
      engagement,
      engageOther,
      budget,
      budgetOther,
      budgetIsOther,
    ]
  );

  return (
    <div className={[styles.stepForm, styles.active].join(" ")}>
      <div className={styles.stepHeader}>
        <div className={styles.stepTag}>Expert Collaboration</div>
        <div className={styles.stepTitle}>What expertise do you need?</div>
        <div className={styles.stepSub}>
          Tell us what help you&apos;re looking for so we can match you with the
          right experts on the platform.
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Which expert categories do you need?{" "}
          <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>
            (select all that apply)
          </span>
        </label>
        <div className={styles.chipGroup}>
          {EXPERT_CATEGORIES.map((opt) => {
            const selected = categories.includes(opt);
            return (
              <div
                key={opt}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => toggleInList(opt, setCategories)}
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
              categoriesOtherSel ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              setCategoriesOtherSel((v) => !v);
              if (categoriesOtherSel) setCategoriesOther("");
            }}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>
          {categoriesOtherSel && (
            <div className={styles.otherInputWrap}>
              <input
                className={styles.otherInput}
                placeholder="e.g. HR / Talent, PR & Communications, ESG…"
                type="text"
                value={categoriesOther}
                onChange={(e) => setCategoriesOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Preferred Expert Engagement Model</label>
        <div className={[styles.cardChoiceGroup, styles.cols2].join(" ")}>
          {ENGAGEMENT_CARDS.map((card) => {
            const selected = engagement === card.key;
            return (
              <div
                key={card.key}
                className={[styles.cardChoice, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setEngagement(card.key)}
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
              engagement === "other" ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setEngagement("other")}
            role="button"
            tabIndex={0}
          >
            <div className={styles.ccIcon}>✏️</div>
            <div className={styles.ccContent}>
              <div className={styles.ccName}>Other</div>
              <div className={styles.ccDesc}>
                Custom or flexible engagement
              </div>
            </div>
            <div className={styles.ccCheck}>
              {engagement === "other" ? "✓" : ""}
            </div>
          </div>

          {engagement === "other" && (
            <div
              className={styles.otherInputWrap}
              style={{ gridColumn: "1 / -1" }}
            >
              <input
                className={styles.otherInput}
                placeholder="e.g. Revenue share, Success fee, Deferred payment…"
                type="text"
                value={engageOther}
                onChange={(e) => setEngageOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup} style={{ marginTop: 4 }}>
        <label className={styles.formLabel}>
          Monthly Budget for Expert Collaboration{" "}
          <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>
            (helps us match experts within your range)
          </span>
        </label>
        <div className={styles.chipGroup}>
          {BUDGET_OPTIONS.map((opt) => {
            const selected = !budgetIsOther && budget === opt;
            return (
              <div
                key={opt}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  setBudgetIsOther(false);
                  setBudget(opt);
                }}
                role="button"
                tabIndex={0}
              >
                {opt}
              </div>
            );
          })}
          <div
            className={[styles.chip, budgetIsOther ? styles.selected : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setBudgetIsOther(true)}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>
          {budgetIsOther && (
            <div className={styles.otherInputWrap}>
              <input
                className={styles.otherInput}
                placeholder="e.g. $50K+ / mo, project-based budget…"
                type="text"
                value={budgetOther}
                onChange={(e) => setBudgetOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
