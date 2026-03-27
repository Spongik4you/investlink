import styles from "@/app/onboarding/onboarding.module.css";

type TopProgressProps = {
  step: number;
  progressPct: number;
  topLabel: string;
};

export default function TopProgress({
  step,
  progressPct,
  topLabel,
}: TopProgressProps) {
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
        {step === 0 ? "Step 1 of 7" : `Step ${step + 1} of 7`}
      </div>
    </div>
  );
}