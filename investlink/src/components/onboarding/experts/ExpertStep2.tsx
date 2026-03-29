"use client";

import { useState } from "react";
import styles from "@/app/onboarding/onboarding.module.css";

type Props = {
  onBack: () => void;
  onNext: () => void;
};

type CategoryKey =
  | "legal"
  | "finance"
  | "ai"
  | "marketing"
  | "biotech"
  | "engineering"
  | "other";

const CATEGORY_CARDS: {
  key: CategoryKey;
  icon: string;
  name: string;
  desc: string;
}[] = [
  {
    key: "legal",
    icon: "⚖️",
    name: "Legal & Compliance",
    desc: "IP, contracts, regulatory, M&A",
  },
  {
    key: "finance",
    icon: "💼",
    name: "Finance & CFO",
    desc: "Fundraising, FP&A, due diligence",
  },
  {
    key: "ai",
    icon: "🤖",
    name: "AI / Machine Learning",
    desc: "ML systems, data pipelines, AI ethics",
  },
  {
    key: "marketing",
    icon: "🎯",
    name: "Marketing & GTM",
    desc: "Growth, branding, go-to-market",
  },
  {
    key: "biotech",
    icon: "🔬",
    name: "BioTech / Clinical",
    desc: "Clinical trials, drug discovery, FDA",
  },
  {
    key: "engineering",
    icon: "🔧",
    name: "Engineering / CTO",
    desc: "Architecture, security, DevOps",
  },
];

const SKILL_OPTIONS = [
  "Series A / B Due Diligence",
  "IP Protection",
  "GDPR / Data Privacy",
  "Term Sheet Negotiation",
  "Cap Table Management",
  "FDA / Regulatory",
  "Contract Drafting",
  "M&A Advisory",
  "Venture Debt",
];

const INDUSTRY_OPTIONS = [
  "🤖 AI / ML",
  "🏥 BioTech",
  "💳 FinTech",
  "🌿 CleanTech",
  "🔒 Cybersecurity",
  "🧩 SaaS",
  "🚀 DeepTech",
];

function toggleInList(value: string, setFn: React.Dispatch<React.SetStateAction<string[]>>) {
  setFn((prev) =>
    prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
  );
}

export default function ExpertStep2({ onBack, onNext }: Props) {
  const [primaryCategory, setPrimaryCategory] = useState<CategoryKey>("legal");
  const [categoryOther, setCategoryOther] = useState("");

  const [skills, setSkills] = useState<string[]>([
    "Series A / B Due Diligence",
    "IP Protection",
    "Contract Drafting",
  ]);
  const [skillsOther, setSkillsOther] = useState("");
  const [skillsOtherSel, setSkillsOtherSel] = useState(false);

  const [industries, setIndustries] = useState<string[]>(["🤖 AI / ML", "🏥 BioTech"]);
  const [industriesOther, setIndustriesOther] = useState("");
  const [industriesOtherSel, setIndustriesOtherSel] = useState(false);

  return (
    <div className={[styles.stepForm, styles.active].join(" ")}>
      <div className={styles.stepHeader}>
        <div className={styles.stepTag}>Expertise & Skills</div>
        <div className={styles.stepTitle}>What are you expert in?</div>
        <div className={styles.stepSub}>
          Be precise. Startups search by skill — the more accurate, the better
          your AI match score.
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Primary Expert Category{" "}
          <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>
            (choose your main one)
          </span>
        </label>
        <div className={[styles.cardChoiceGroup, styles.cols2].join(" ")}>
          {CATEGORY_CARDS.map((card) => {
            const selected = primaryCategory === card.key;
            return (
              <div
                key={card.key}
                className={[styles.cardChoice, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setPrimaryCategory(card.key)}
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
              primaryCategory === "other" ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setPrimaryCategory("other")}
            role="button"
            tabIndex={0}
          >
            <div className={styles.ccIcon}>✏️</div>
            <div className={styles.ccContent}>
              <div className={styles.ccName}>Other</div>
              <div className={styles.ccDesc}>Specialty not listed above</div>
            </div>
            <div className={styles.ccCheck}>
              {primaryCategory === "other" ? "✓" : ""}
            </div>
          </div>

          {primaryCategory === "other" && (
            <div
              className={styles.otherInputWrap}
              style={{ gridColumn: "1 / -1" }}
            >
              <input
                className={styles.otherInput}
                placeholder="e.g. Climate Science, Defense, Supply Chain, HR Tech…"
                type="text"
                value={categoryOther}
                onChange={(e) => setCategoryOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Specific Skills / Sub-specialties
        </label>
        <div className={styles.chipGroup}>
          {SKILL_OPTIONS.map((opt) => {
            const selected = skills.includes(opt);
            return (
              <div
                key={opt}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => toggleInList(opt, setSkills)}
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
              skillsOtherSel ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              setSkillsOtherSel((v) => !v);
              if (skillsOtherSel) setSkillsOther("");
            }}
            role="button"
            tabIndex={0}
          >
            ✏️ Other skill
          </div>
          {skillsOtherSel && (
            <div className={styles.otherInputWrap}>
              <input
                className={styles.otherInput}
                placeholder="e.g. Pricing strategy, ESG reporting, Tokenomics…"
                type="text"
                value={skillsOther}
                onChange={(e) => setSkillsOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Industries you know best</label>
        <div className={styles.chipGroup}>
          {INDUSTRY_OPTIONS.map((opt) => {
            const selected = industries.includes(opt);
            return (
              <div
                key={opt}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => toggleInList(opt, setIndustries)}
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
              industriesOtherSel ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              setIndustriesOtherSel((v) => !v);
              if (industriesOtherSel) setIndustriesOther("");
            }}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>
          {industriesOtherSel && (
            <div className={styles.otherInputWrap}>
              <input
                className={styles.otherInput}
                placeholder="e.g. Defense, AgriTech, Space, GovTech…"
                type="text"
                value={industriesOther}
                onChange={(e) => setIndustriesOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
