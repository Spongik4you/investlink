"use client";

import { useState } from "react";
import styles from "@/app/onboarding/onboarding.module.css";

type Props = {
  onBack: () => void;
  onNext: () => void;
};

const RATE_OPTIONS = [
  "Under $50/h",
  "$50–$100/h",
  "$100–$150/h",
  "$150–$250/h",
  "$250+/h",
  "Project-based only",
];

type AvailKey =
  | "part"
  | "half"
  | "full"
  | "project"
  | "other";

const AVAIL_CARDS: {
  key: AvailKey;
  icon: string;
  name: string;
  desc: string;
}[] = [
  {
    key: "part",
    icon: "⚡",
    name: "Part-time (1–10h/week)",
    desc: "Ideal for quick gigs and advisory",
  },
  {
    key: "half",
    icon: "🕐",
    name: "Half-time (10–20h/week)",
    desc: "Good for ongoing retainers",
  },
  {
    key: "full",
    icon: "🗓",
    name: "Full-time (20–40h/week)",
    desc: "Dedicated project involvement",
  },
  {
    key: "project",
    icon: "📋",
    name: "Project-by-project",
    desc: "Varies per engagement",
  },
];

const EQUITY_OPTIONS = [
  "No, cash only",
  "Yes, hybrid (cash + equity)",
  "Yes, equity-only for right opportunity",
];

const STAGE_OPTIONS = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B+",
  "Any / No preference",
];

function toggleInList(value: string, setFn: React.Dispatch<React.SetStateAction<string[]>>) {
  setFn((prev) =>
    prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
  );
}

export default function ExpertStep3({ onBack, onNext }: Props) {
  const [rate, setRate] = useState("$150–$250/h");
  const [rateOther, setRateOther] = useState("");
  const [rateIsOther, setRateIsOther] = useState(false);

  const [availability, setAvailability] = useState<AvailKey>("half");
  const [availOther, setAvailOther] = useState("");

  const [equity, setEquity] = useState("Yes, hybrid (cash + equity)");
  const [equityOther, setEquityOther] = useState("");
  const [equityIsOther, setEquityIsOther] = useState(false);

  const [stages, setStages] = useState<string[]>(["Pre-Seed", "Seed", "Series A"]);
  const [stageOther, setStageOther] = useState("");
  const [stageOtherSel, setStageOtherSel] = useState(false);

  return (
    <div className={[styles.stepForm, styles.active].join(" ")}>
      <div className={styles.stepHeader}>
        <div className={styles.stepTag}>Availability & Rates</div>
        <div className={styles.stepTitle}>Set your rates and schedule</div>
        <div className={styles.stepSub}>
          You can update these anytime from your dashboard. Honest rates attract
          better clients.
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Hourly Rate (USD)</label>
        <div className={styles.chipGroup}>
          {RATE_OPTIONS.map((opt) => {
            const selected = !rateIsOther && rate === opt;
            return (
              <div
                key={opt}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  setRateIsOther(false);
                  setRate(opt);
                }}
                role="button"
                tabIndex={0}
              >
                {opt}
              </div>
            );
          })}
          <div
            className={[styles.chip, rateIsOther ? styles.selected : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setRateIsOther(true)}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>
          {rateIsOther && (
            <div className={styles.otherInputWrap}>
              <input
                className={styles.otherInput}
                placeholder="e.g. $400+/h, success fee, equity-only…"
                type="text"
                value={rateOther}
                onChange={(e) => setRateOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Weekly Availability</label>
        <div className={[styles.cardChoiceGroup, styles.cols2].join(" ")}>
          {AVAIL_CARDS.map((card) => {
            const selected = availability === card.key;
            return (
              <div
                key={card.key}
                className={[styles.cardChoice, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setAvailability(card.key)}
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
              availability === "other" ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setAvailability("other")}
            role="button"
            tabIndex={0}
          >
            <div className={styles.ccIcon}>✏️</div>
            <div className={styles.ccContent}>
              <div className={styles.ccName}>Other</div>
              <div className={styles.ccDesc}>Custom or seasonal availability</div>
            </div>
            <div className={styles.ccCheck}>
              {availability === "other" ? "✓" : ""}
            </div>
          </div>

          {availability === "other" && (
            <div
              className={styles.otherInputWrap}
              style={{ gridColumn: "1 / -1" }}
            >
              <input
                className={styles.otherInput}
                placeholder="e.g. Flexible hours, seasonal, per-milestone…"
                type="text"
                value={availOther}
                onChange={(e) => setAvailOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Are you open to equity compensation?
        </label>
        <div className={styles.chipGroup}>
          {EQUITY_OPTIONS.map((opt) => {
            const selected = !equityIsOther && equity === opt;
            return (
              <div
                key={opt}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  setEquityIsOther(false);
                  setEquity(opt);
                }}
                role="button"
                tabIndex={0}
              >
                {opt}
              </div>
            );
          })}
          <div
            className={[styles.chip, equityIsOther ? styles.selected : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setEquityIsOther(true)}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>
          {equityIsOther && (
            <div className={styles.otherInputWrap}>
              <input
                className={styles.otherInput}
                placeholder="e.g. Revenue share, token allocation, deferred…"
                type="text"
                value={equityOther}
                onChange={(e) => setEquityOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Preferred startup stage to work with
        </label>
        <div className={styles.chipGroup}>
          {STAGE_OPTIONS.map((opt) => {
            const selected = stages.includes(opt);
            return (
              <div
                key={opt}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => toggleInList(opt, setStages)}
                role="button"
                tabIndex={0}
              >
                {opt}
              </div>
            );
          })}
          <div
            className={[styles.chip, stageOtherSel ? styles.selected : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              setStageOtherSel((v) => !v);
              if (stageOtherSel) setStageOther("");
            }}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>
          {stageOtherSel && (
            <div className={styles.otherInputWrap}>
              <input
                className={styles.otherInput}
                placeholder="e.g. Only profitable companies, Post-revenue only…"
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
