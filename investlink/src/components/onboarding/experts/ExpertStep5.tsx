"use client";

import { useState } from "react";
import styles from "@/app/onboarding/onboarding.module.css";
import { useOnboardingStepSync } from "@/contexts/OnboardingWizardContext";

type Props = {
  onBack: () => void;
  onNext: () => void;
};

const COLLAB_OPTIONS = [
  "Async first (email / Slack)",
  "Regular video calls",
  "In-person (for local startups)",
  "Fully remote",
  "Embedded / on-site",
];

const PROJECT_OPTIONS = [
  "High-stakes legal/financial review",
  "Early-stage strategy",
  "Technical audits & deep dives",
  "Quick advisory sessions",
  "Long-term partnership",
  "International expansion",
];

const NDA_OPTIONS = [
  "Yes, always",
  "Case by case",
  "No, prefer open collaboration",
];

const NOTICE_OPTIONS = [
  "Immediately / same day",
  "1–3 days",
  "1 week",
  "2+ weeks",
];

function toggleInList(value: string, setFn: React.Dispatch<React.SetStateAction<string[]>>) {
  setFn((prev) =>
    prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
  );
}

export default function ExpertStep5({ onBack, onNext }: Props) {
  const [collab, setCollab] = useState<string[]>([
    "Async first (email / Slack)",
    "Fully remote",
  ]);
  const [collabOther, setCollabOther] = useState("");
  const [collabOtherSel, setCollabOtherSel] = useState(false);

  const [projects, setProjects] = useState<string[]>([
    "High-stakes legal/financial review",
    "Technical audits & deep dives",
  ]);
  const [projectsOther, setProjectsOther] = useState("");
  const [projectsOtherSel, setProjectsOtherSel] = useState(false);

  const [nda, setNda] = useState("Yes, always");
  const [ndaOther, setNdaOther] = useState("");
  const [ndaIsOther, setNdaIsOther] = useState(false);

  const [notice, setNotice] = useState("1–3 days");
  const [noticeOther, setNoticeOther] = useState("");
  const [noticeIsOther, setNoticeIsOther] = useState(false);

  useOnboardingStepSync(
    "expert",
    5,
    () => ({
      collab,
      collabOther,
      collabOtherSel,
      projects,
      projectsOther,
      projectsOtherSel,
      nda,
      ndaOther,
      ndaIsOther,
      notice,
      noticeOther,
      noticeIsOther,
    }),
    [
      collab,
      collabOther,
      collabOtherSel,
      projects,
      projectsOther,
      projectsOtherSel,
      nda,
      ndaOther,
      ndaIsOther,
      notice,
      noticeOther,
      noticeIsOther,
    ]
  );

  return (
    <div className={[styles.stepForm, styles.active].join(" ")}>
      <div className={styles.stepHeader}>
        <div className={styles.stepTag}>Work Preferences</div>
        <div className={styles.stepTitle}>How do you work best?</div>
        <div className={styles.stepSub}>
          Help startups understand what it&apos;s like to work with you before
          they reach out.
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Preferred Collaboration Style</label>
        <div className={styles.chipGroup}>
          {COLLAB_OPTIONS.map((opt) => {
            const selected = collab.includes(opt);
            return (
              <div
                key={opt}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => toggleInList(opt, setCollab)}
                role="button"
                tabIndex={0}
              >
                {opt}
              </div>
            );
          })}
          <div
            className={[styles.chip, collabOtherSel ? styles.selected : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              setCollabOtherSel((v) => !v);
              if (collabOtherSel) setCollabOther("");
            }}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>
          {collabOtherSel && (
            <div className={styles.otherInputWrap}>
              <input
                className={styles.otherInput}
                placeholder="e.g. Text-first, Loom video updates, in-person quarterly…"
                type="text"
                value={collabOther}
                onChange={(e) => setCollabOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          What type of projects excite you most?
        </label>
        <div className={styles.chipGroup}>
          {PROJECT_OPTIONS.map((opt) => {
            const selected = projects.includes(opt);
            return (
              <div
                key={opt}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => toggleInList(opt, setProjects)}
                role="button"
                tabIndex={0}
              >
                {opt}
              </div>
            );
          })}
          <div
            className={[styles.chip, projectsOtherSel ? styles.selected : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              setProjectsOtherSel((v) => !v);
              if (projectsOtherSel) setProjectsOther("");
            }}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>
          {projectsOtherSel && (
            <div className={styles.otherInputWrap}>
              <input
                className={styles.otherInput}
                placeholder="e.g. Investor relations, M&A target analysis, Board prep…"
                type="text"
                value={projectsOther}
                onChange={(e) => setProjectsOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Are you willing to sign NDAs?</label>
        <div className={styles.chipGroup}>
          {NDA_OPTIONS.map((opt) => {
            const selected = !ndaIsOther && nda === opt;
            return (
              <div
                key={opt}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  setNdaIsOther(false);
                  setNda(opt);
                }}
                role="button"
                tabIndex={0}
              >
                {opt}
              </div>
            );
          })}
          <div
            className={[styles.chip, ndaIsOther ? styles.selected : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setNdaIsOther(true)}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>
          {ndaIsOther && (
            <div className={styles.otherInputWrap}>
              <input
                className={styles.otherInput}
                placeholder="e.g. Mutual NDA required, NDA with carve-outs…"
                type="text"
                value={ndaOther}
                onChange={(e) => setNdaOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          How far in advance do you need project notice?
        </label>
        <div className={styles.chipGroup}>
          {NOTICE_OPTIONS.map((opt) => {
            const selected = !noticeIsOther && notice === opt;
            return (
              <div
                key={opt}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  setNoticeIsOther(false);
                  setNotice(opt);
                }}
                role="button"
                tabIndex={0}
              >
                {opt}
              </div>
            );
          })}
          <div
            className={[styles.chip, noticeIsOther ? styles.selected : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setNoticeIsOther(true)}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>
          {noticeIsOther && (
            <div className={styles.otherInputWrap}>
              <input
                className={styles.otherInput}
                placeholder="e.g. 1 month, project-dependent…"
                type="text"
                value={noticeOther}
                onChange={(e) => setNoticeOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
