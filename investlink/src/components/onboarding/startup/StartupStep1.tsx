"use client";

import { useState } from "react";
import styles from "@/app/onboarding/onboarding.module.css";

type Props = {
  onBack: () => void;
  onNext: () => void;
};

export default function StartupStep1({ onBack, onNext }: Props) {
  const [companyName, setCompanyName] = useState("");
  const [legalType, setLegalType] = useState("LLC");
  const [country, setCountry] = useState("United States");
  const [yearFounded, setYearFounded] = useState("");
  const [website, setWebsite] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [description, setDescription] = useState("");
  const [keyMetric, setKeyMetric] = useState("");

  return (
    <div className={[styles.stepForm, styles.active].join(" ")}>
      <div className={styles.stepHeader}>
        <div className={styles.stepTag}>Company Identity</div>
        <div className={styles.stepTitle}>Tell us about your startup</div>
        <div className={styles.stepSub}>
          Basic information to create your company profile and start the
          verification process.
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Company Name</label>
          <input
            className={styles.formInput}
            placeholder="TechCore Inc."
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Legal Entity Type</label>
          <select
            className={styles.formInput}
            value={legalType}
            onChange={(e) => setLegalType(e.target.value)}
          >
            <option>LLC</option>
            <option>C-Corp</option>
            <option>S-Corp</option>
            <option>Ltd</option>
            <option>GmbH</option>
            <option>Not yet incorporated</option>
          </select>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Country of Incorporation</label>
          <select
            className={styles.formInput}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Germany</option>
            <option>Singapore</option>
            <option>Estonia</option>
            <option>Romania</option>
            <option>Other</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Year Founded</label>
          <input
            className={styles.formInput}
            placeholder="2022"
            type="number"
            value={yearFounded}
            onChange={(e) => setYearFounded(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Website</label>
        <input
          className={styles.formInput}
          placeholder="https://yourcompany.com"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          One-liner: What does your company do?
        </label>
        <div className={styles.formHint}>
          Max 160 characters — this appears on your public profile
        </div>
        <input
          className={styles.formInput}
          placeholder="We help investors discover verified startups using AI-powered matching."
          type="text"
          maxLength={160}
          value={oneLiner}
          onChange={(e) => setOneLiner(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Company Description{" "}
          <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>
            (shown in pop-out profile to investors & experts)
          </span>
        </label>
        <div className={styles.formHint}>
          3–5 sentences: what problem you solve, how, current traction, and why
          now.
        </div>
        <textarea
          className={styles.formInput}
          placeholder="e.g. TechCore builds enterprise-grade AI infrastructure handling 200M+ requests/day. Trusted by 40+ Fortune 500 clients. Raised $1.2M ARR in 18 months with zero paid marketing. Now raising Series A to expand into Europe."
          style={{ height: 110 }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Key Metric You&apos;re Most Proud Of{" "}
          <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>
            (optional — increases investor attention)
          </span>
        </label>
        <input
          className={styles.formInput}
          placeholder="e.g. $1.2M ARR · 40+ enterprise clients · 200M requests/day"
          type="text"
          value={keyMetric}
          onChange={(e) => setKeyMetric(e.target.value)}
        />
      </div>
    </div>
  );
}
