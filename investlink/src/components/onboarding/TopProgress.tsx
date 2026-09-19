import styles from "@/app/onboarding/onboarding.module.css";

type TopProgressProps = {
  step: number; // 0 = role picker, 1..N = ecrane vizuale
  totalScreens: number;
  progressPct: number;
  topLabel: string;
};

export default function TopProgress({
  step,
  totalScreens,
  progressPct,
  topLabel,
}: TopProgressProps) {
  // Total = role picker + ecranele vizuale.
  const total = totalScreens + 1;
  const current = step + 1; // step 0 (role picker) → „Step 1"
  return (
    <div className={styles.rpTop}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gray-500)" }}>
        {topLabel}
      </div>

      <div className={styles.rpProgressBar}>
        <div
          className={styles.rpProgressFill}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className={styles.rpStepCount}>
        {`Step ${current} of ${total}`}
      </div>
    </div>
  );
}