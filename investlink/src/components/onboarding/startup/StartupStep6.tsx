"use client";

import { useState } from "react";
import styles from "@/app/onboarding/onboarding.module.css";
import { useOnboardingStepSync } from "@/contexts/OnboardingWizardContext";

type Props = {
  onBack: () => void;
  onComplete: () => void;
};

export default function StartupStep6({ onBack, onComplete }: Props) {
  const [toggles, setToggles] = useState({
    investorInterest: true,
    expertApps: true,
    investmentReceived: true,
    fundingMilestones: false,
    expertProjectUpdates: false,
    platformCompliance: true,
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
    "startup",
    6,
    () => ({ toggles, channels }),
    [toggles, channels]
  );

  return (
    <div className={[styles.stepForm, styles.active].join(" ")}>
      <div className={styles.stepHeader}>
        <div className={styles.stepTag}>Final Step</div>
        <div className={styles.stepTitle}>Notification preferences</div>
        <div className={styles.stepSub}>
          Stay informed about investor interest, expert applications, and
          platform updates.
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
            <div className={styles.tfLabel}>Investor Interest Alerts</div>
            <div className={styles.tfDesc}>
              When an investor views or bookmarks your profile
            </div>
          </div>
          <div
            className={[
              styles.toggleSw,
              !toggles.investorInterest ? styles.off : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleSwitch("investorInterest")}
          />
        </div>

        <div className={styles.toggleField}>
          <div>
            <div className={styles.tfLabel}>New Expert Applications</div>
            <div className={styles.tfDesc}>
              When experts apply to your open projects
            </div>
          </div>
          <div
            className={[
              styles.toggleSw,
              !toggles.expertApps ? styles.off : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleSwitch("expertApps")}
          />
        </div>

        <div className={styles.toggleField}>
          <div>
            <div className={styles.tfLabel}>Investment Received</div>
            <div className={styles.tfDesc}>
              Confirmation when a deal or deposit is made
            </div>
          </div>
          <div
            className={[
              styles.toggleSw,
              !toggles.investmentReceived ? styles.off : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleSwitch("investmentReceived")}
          />
        </div>

        <div className={styles.toggleField}>
          <div>
            <div className={styles.tfLabel}>Funding Goal Milestones</div>
            <div className={styles.tfDesc}>
              Alerts at 25%, 50%, 75%, and 100% of goal
            </div>
          </div>
          <div
            className={[
              styles.toggleSw,
              !toggles.fundingMilestones ? styles.off : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleSwitch("fundingMilestones")}
          />
        </div>

        <div className={styles.toggleField}>
          <div>
            <div className={styles.tfLabel}>Expert Project Updates</div>
            <div className={styles.tfDesc}>
              Progress reports from active expert collaborations
            </div>
          </div>
          <div
            className={[
              styles.toggleSw,
              !toggles.expertProjectUpdates ? styles.off : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleSwitch("expertProjectUpdates")}
          />
        </div>

        <div className={styles.toggleField}>
          <div>
            <div className={styles.tfLabel}>Platform & Compliance</div>
            <div className={styles.tfDesc}>
              Security alerts and verification status updates
            </div>
          </div>
          <div
            className={[
              styles.toggleSw,
              !toggles.platformCompliance ? styles.off : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleSwitch("platformCompliance")}
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
