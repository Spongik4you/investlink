import styles from "@/app/onboarding/onboarding.module.css";
import { ReactNode } from "react";

type OnboardingShellProps = {
  left: ReactNode;
  right: ReactNode;
};

export default function OnboardingShell({
  left,
  right,
}: OnboardingShellProps) {
  return (
    <div className={styles.onboardWrap}>
      {left}
      <div className={styles.rightPanel}>{right}</div>
    </div>
  );
}