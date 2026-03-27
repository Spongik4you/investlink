import Link from "next/link";
import styles from "@/app/onboarding/onboarding.module.css";

type RoleKey = "investor" | "startup" | "expert";

type StepItem = {
  name: string;
  desc: string;
};

type RoleConfig = {
  badge: string;
  title: string;
  sub: string;
  steps: StepItem[];
};

type LeftPanelProps = {
  role: RoleKey;
  step: number;
  cfg: RoleConfig;
};

export default function LeftPanel({ step, cfg }: LeftPanelProps) {
  return (
    <div className={styles.leftPanel}>
      <Link href="/" className={styles.lpLogo}>
        <div className={styles.lpLogoMark}>
          <svg viewBox="0 0 24 24">
            <polyline points="3 17 9 11 13 15 21 7" />
            <polyline points="14 7 21 7 21 14" />
          </svg>
        </div>
        <span className={styles.lpLogoText}>InvestLink</span>
      </Link>

      <div className={styles.lpRoleBadge}>{cfg.badge}</div>
      <div className={styles.lpTitle}>{cfg.title}</div>
      <div className={styles.lpSub}>{cfg.sub}</div>

      <div className={styles.progressSteps}>
        {cfg.steps.map((s, i) => {
          const stepNum = i + 1;
          const done = step !== 0 && stepNum < step;
          const active = stepNum === step;

          const itemClassName = [
            styles.psItem,
            done ? styles.done : "",
            active ? styles.active : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div key={s.name} className={itemClassName}>
              <div className={styles.psNum}>{done ? "✓" : stepNum}</div>
              <div className={styles.psLabel}>
                <div className={styles.psName}>{s.name}</div>
                <div className={styles.psDesc}>{s.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.lpBottom}>
        <div className={styles.lpSecurity}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Your data is encrypted and never shared without consent
        </div>
      </div>
    </div>
  );
}