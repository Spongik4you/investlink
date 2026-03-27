"use client";

import { useState } from "react";
import styles from "@/app/onboarding/onboarding.module.css";

type Props = {
  onBack: () => void;
  onNext: () => void;
};

export default function InvestorStep3({ onBack, onNext }: Props) {
  const [sectors, setSectors] = useState<string[]>([
    "🤖 Artificial Intelligence",
    "🌿 CleanTech / GreenTech",
    "💳 FinTech",
  ]);
  const [otherSector, setOtherSector] = useState("");

  const [stages, setStages] = useState<string[]>([
    "Pre-Seed",
    "Seed",
    "Series A",
  ]);
  const [otherStage, setOtherStage] = useState("");

  const [geographies, setGeographies] = useState<string[]>([
    "🌎 North America",
    "🌐 Global / No Preference",
  ]);
  const [otherGeo, setOtherGeo] = useState("");

  const sectorOptions = [
    "🤖 Artificial Intelligence",
    "🌿 CleanTech / GreenTech",
    "🏥 HealthTech / BioTech",
    "💳 FinTech",
    "🚀 Space Tech",
    "🔒 Cybersecurity",
    "🛒 E-Commerce",
    "🎮 Gaming / Web3",
    "🏗 PropTech / Real Estate",
    "🎓 EdTech",
    "🍔 FoodTech / AgriTech",
    "🏭 DeepTech / Hardware",
    "📦 Logistics / Supply Chain",
    "🧩 SaaS / B2B Software",
  ];

  const stageOptions = [
    "Pre-Seed",
    "Seed",
    "Series A",
    "Series B",
    "Series C+",
    "Growth",
  ];

  const geographyOptions = [
    "🌎 North America",
    "🌍 Europe",
    "🌏 Asia-Pacific",
    "🌍 Africa",
    "🌎 Latin America",
    "🌐 Global / No Preference",
  ];

  const toggleMulti = (
    value: string,
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <div className={[styles.stepForm, styles.active].join(" ")}>
      <div className={styles.stepHeader}>
        <div className={styles.stepTag}>Investment Focus</div>
        <div className={styles.stepTitle}>What sectors interest you?</div>
        <div className={styles.stepSub}>
          Select all that apply. Our AI uses this to curate your deal flow and
          match you with relevant startups.
        </div>
      </div>

      <div className={styles.chipGroup} style={{ marginBottom: 20 }}>
        {sectorOptions.map((option) => (
          <div
            key={option}
            className={[
              styles.chip,
              sectors.includes(option) ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleMulti(option, setSectors)}
            role="button"
            tabIndex={0}
          >
            {option}
          </div>
        ))}

        <div
          className={[
            styles.chip,
            sectors.includes("other") ? styles.selected : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => toggleMulti("other", setSectors)}
          role="button"
          tabIndex={0}
        >
          ✏️ Other sector
        </div>

        {sectors.includes("other") && (
          <div
            className={styles.otherInputWrap}
            style={{ display: "block" }}
          >
            <input
              className={styles.otherInput}
              placeholder="e.g. Space Tech, Defense, Bioprinting…"
              type="text"
              value={otherSector}
              onChange={(e) => setOtherSector(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Preferred Investment Stage</label>

        <div className={styles.chipGroup}>
          {stageOptions.map((option) => (
            <div
              key={option}
              className={[
                styles.chip,
                stages.includes(option) ? styles.selected : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => toggleMulti(option, setStages)}
              role="button"
              tabIndex={0}
            >
              {option}
            </div>
          ))}

          <div
            className={[
              styles.chip,
              stages.includes("other") ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleMulti("other", setStages)}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>

          {stages.includes("other") && (
            <div
              className={styles.otherInputWrap}
              style={{ display: "block" }}
            >
              <input
                className={styles.otherInput}
                placeholder="e.g. Pre-IPO, SPAC, Buyout…"
                type="text"
                value={otherStage}
                onChange={(e) => setOtherStage(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Preferred Geography</label>

        <div className={styles.chipGroup}>
          {geographyOptions.map((option) => (
            <div
              key={option}
              className={[
                styles.chip,
                geographies.includes(option) ? styles.selected : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => toggleMulti(option, setGeographies)}
              role="button"
              tabIndex={0}
            >
              {option}
            </div>
          ))}

          <div
            className={[
              styles.chip,
              geographies.includes("other") ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleMulti("other", setGeographies)}
            role="button"
            tabIndex={0}
          >
            ✏️ Other region
          </div>

          {geographies.includes("other") && (
            <div
              className={styles.otherInputWrap}
              style={{ display: "block" }}
            >
              <input
                className={styles.otherInput}
                placeholder="e.g. Middle East, Central Asia, Eastern Europe…"
                type="text"
                value={otherGeo}
                onChange={(e) => setOtherGeo(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}