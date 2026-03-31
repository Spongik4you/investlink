"use client";

import { useState } from "react";
import styles from "@/app/onboarding/onboarding.module.css";
import { useOnboardingStepSync } from "@/contexts/OnboardingWizardContext";

type Props = {
  onBack: () => void;
  onComplete: () => void;
};

export default function ExpertStep6({ onBack, onComplete }: Props) {
  const [toggles, setToggles] = useState({
    invitations: true,
    aiMatch: true,
    payments: true,
    messages: false,
    reviews: false,
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
    "expert",
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
          Choose how we keep you informed about new opportunities and project
          updates.
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
            <div className={styles.tfLabel}>New Project Invitations</div>
            <div className={styles.tfDesc}>
              When a startup invites you to apply for a project
            </div>
          </div>
          <div
            className={[
              styles.toggleSw,
              !toggles.invitations ? styles.off : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleSwitch("invitations")}
          />
        </div>

        <div className={styles.toggleField}>
          <div>
            <div className={styles.tfLabel}>AI Match Alerts</div>
            <div className={styles.tfDesc}>
              New opportunities matching your expertise (daily digest)
            </div>
          </div>
          <div
            className={[
              styles.toggleSw,
              !toggles.aiMatch ? styles.off : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleSwitch("aiMatch")}
          />
        </div>

        <div className={styles.toggleField}>
          <div>
            <div className={styles.tfLabel}>Payment Confirmations</div>
            <div className={styles.tfDesc}>
              When a milestone payment is released to your account
            </div>
          </div>
          <div
            className={[
              styles.toggleSw,
              !toggles.payments ? styles.off : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleSwitch("payments")}
          />
        </div>

        <div className={styles.toggleField}>
          <div>
            <div className={styles.tfLabel}>New Messages</div>
            <div className={styles.tfDesc}>
              Direct messages from startups and the platform
            </div>
          </div>
          <div
            className={[
              styles.toggleSw,
              !toggles.messages ? styles.off : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleSwitch("messages")}
          />
        </div>

        <div className={styles.toggleField}>
          <div>
            <div className={styles.tfLabel}>Review Received</div>
            <div className={styles.tfDesc}>
              When a startup leaves feedback on your work
            </div>
          </div>
          <div
            className={[
              styles.toggleSw,
              !toggles.reviews ? styles.off : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleSwitch("reviews")}
          />
        </div>

        <div className={styles.toggleField}>
          <div>
            <div className={styles.tfLabel}>Security & Account Alerts</div>
            <div className={styles.tfDesc}>
              Login, password changes, and verification updates
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
