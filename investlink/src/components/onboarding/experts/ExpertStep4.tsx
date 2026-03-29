"use client";

import { useRef, useState } from "react";
import styles from "@/app/onboarding/onboarding.module.css";

type Props = {
  onBack: () => void;
  onNext: () => void;
};

const CRED_OPTIONS = [
  "PhD / Doctorate",
  "CFA",
  "CPA / Chartered Accountant",
  "Bar Admission (Law)",
  "PMP",
  "AWS / Google Cloud Cert",
  "Published Research",
  "Patent Holder",
  "Board Member Experience",
];

function toggleInList(value: string, setFn: React.Dispatch<React.SetStateAction<string[]>>) {
  setFn((prev) =>
    prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
  );
}

export default function ExpertStep4({ onBack, onNext }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pastClients, setPastClients] = useState("");
  const [credentials, setCredentials] = useState<string[]>([
    "PhD / Doctorate",
    "Published Research",
  ]);
  const [credOther, setCredOther] = useState("");
  const [credOtherSel, setCredOtherSel] = useState(false);

  return (
    <div className={[styles.stepForm, styles.active].join(" ")}>
      <div className={styles.stepHeader}>
        <div className={styles.stepTag}>Credibility & Portfolio</div>
        <div className={styles.stepTitle}>Showcase your track record</div>
        <div className={styles.stepSub}>
          Experts with case studies and verified credentials get 3× more
          project invitations.
        </div>
      </div>

      <div className={styles.notice}>
        <strong>💡 Tip:</strong> Upload a case study or link your LinkedIn to
        boost your AI Match Score by up to 28 points.
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Notable Past Clients / Companies{" "}
          <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>
            (names, if permitted)
          </span>
        </label>
        <textarea
          className={styles.formInput}
          placeholder="e.g. Advised Series A startup in MedTech (NDA), Reviewed IP portfolio for AI company ($50M exit)…"
          value={pastClients}
          onChange={(e) => setPastClients(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Upload Case Study or Portfolio Document
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.md,text/markdown"
          style={{ display: "none" }}
          onChange={() => {}}
        />
        <div
          className={styles.uploadZone}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ")
              fileInputRef.current?.click();
          }}
        >
          <div className={styles.uzIcon}>📄</div>
          <div className={styles.uzText}>Drag & drop or click to upload</div>
          <div className={styles.uzSub}>
            PDF, DOCX, or Markdown · Max 10 MB
          </div>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Professional Certifications or Credentials
        </label>
        <div className={styles.chipGroup}>
          {CRED_OPTIONS.map((opt) => {
            const selected = credentials.includes(opt);
            return (
              <div
                key={opt}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => toggleInList(opt, setCredentials)}
                role="button"
                tabIndex={0}
              >
                {opt}
              </div>
            );
          })}
          <div
            className={[styles.chip, credOtherSel ? styles.selected : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              setCredOtherSel((v) => !v);
              if (credOtherSel) setCredOther("");
            }}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>
          {credOtherSel && (
            <div className={styles.otherInputWrap}>
              <input
                className={styles.otherInput}
                placeholder="e.g. FDA 510k experience, CISO certification…"
                type="text"
                value={credOther}
                onChange={(e) => setCredOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
