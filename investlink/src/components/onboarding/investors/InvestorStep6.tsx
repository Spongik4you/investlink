"use client";

import { useState } from "react";
import styles from "@/app/onboarding/onboarding.module.css";
import { useOnboardingStepSync } from "@/contexts/OnboardingWizardContext";

type Props = {
  onBack: () => void;
  onComplete: () => void;
};

export default function InvestorStep6({ onBack, onComplete }: Props) {
  const [toggles, setToggles] = useState({
    deals: true,
    execution: true,
    portfolio: true,
    reports: false,
    market: false,
    security: true,
  });

  const [channels, setChannels] = useState<string[]>(["📧 Email", "🔔 In-App"]);

  const toggleChannel = (value: string) => {
    setChannels((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleSwitch = (key: keyof typeof toggles) => {
    setToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useOnboardingStepSync(
    "investor",
    6,
    () => ({ toggles, channels }),
    [toggles, channels]
  );

  return (
    <div className={[styles.stepForm, styles.active].join(" ")}>
      <div className={styles.stepHeader}>
        <div className={styles.stepTag}>Final Step</div>
        <div className={styles.stepTitle}>
          Notification & alert preferences
        </div>
        <div className={styles.stepSub}>
          Choose how InvestLink keeps you informed about new deals, expert
          insights, and portfolio updates.
        </div>
      </div>

      <div
        style={{
          border: "1px solid var(--gray-200)",
          borderRadius: 12,
          padding: "0 16px",
        }}
      >
        <div className={styles.toggleField}>
          <div>
            <div className={styles.tfLabel}>New Deal Matches</div>
            <div className={styles.tfDesc}>
              AI-curated startups matching your investment thesis
            </div>
          </div>
          <div
            className={[
              styles.toggleSw,
              !toggles.deals ? styles.off : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleSwitch("deals")}
          />
        </div>

        <div className={styles.toggleField}>
          <div>
            <div className={styles.tfLabel}>
              Investment Execution Confirmations
            </div>
            <div className={styles.tfDesc}>
              When a buy or deposit order is confirmed
            </div>
          </div>
          <div
            className={[
              styles.toggleSw,
              !toggles.execution ? styles.off : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleSwitch("execution")}
          />
        </div>

        <div className={styles.toggleField}>
          <div>
            <div className={styles.tfLabel}>Portfolio Performance Digest</div>
            <div className={styles.tfDesc}>
              Weekly summary of your portfolio performance
            </div>
          </div>
          <div
            className={[
              styles.toggleSw,
              !toggles.portfolio ? styles.off : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleSwitch("portfolio")}
          />
        </div>

        <div className={styles.toggleField}>
          <div>
            <div className={styles.tfLabel}>
              Expert Reports & Due Diligence
            </div>
            <div className={styles.tfDesc}>
              New reports published by your retained experts
            </div>
          </div>
          <div
            className={[
              styles.toggleSw,
              !toggles.reports ? styles.off : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleSwitch("reports")}
          />
        </div>

        <div className={styles.toggleField}>
          <div>
            <div className={styles.tfLabel}>Market Alerts & News</div>
            <div className={styles.tfDesc}>
              Key market movements in your focus sectors
            </div>
          </div>
          <div
            className={[
              styles.toggleSw,
              !toggles.market ? styles.off : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleSwitch("market")}
          />
        </div>

        <div className={styles.toggleField}>
          <div>
            <div className={styles.tfLabel}>Platform & Security Updates</div>
            <div className={styles.tfDesc}>
              Important changes to your account or the platform
            </div>
          </div>
          <div
            className={[
              styles.toggleSw,
              !toggles.security ? styles.off : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleSwitch("security")}
          />
        </div>
      </div>

      <div className={styles.formGroup} style={{ marginTop: 18 }}>
        <label className={styles.formLabel}>Preferred Notification Channel</label>

        <div className={styles.chipGroup}>
          {["📧 Email", "🔔 In-App", "📱 SMS", "💬 WhatsApp"].map((option) => (
            <div
              key={option}
              className={[
                styles.chip,
                channels.includes(option) ? styles.selected : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => toggleChannel(option)}
              role="button"
              tabIndex={0}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}