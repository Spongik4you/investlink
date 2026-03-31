"use client";

import { useState } from "react";
import styles from "@/app/onboarding/onboarding.module.css";
import { useOnboardingStepSync } from "@/contexts/OnboardingWizardContext";

type Props = {
  onBack: () => void;
  onNext: () => void;
};

const EDU_OPTIONS = [
  "Bachelor's",
  "Master's / MBA",
  "PhD / Doctorate",
  "Self-taught / Bootcamp",
  "Professional Certifications",
];

export default function ExpertStep1({ onBack, onNext }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("United States");
  const [yearsExp, setYearsExp] = useState("6–10 years");

  const [education, setEducation] = useState("PhD / Doctorate");
  const [educationOther, setEducationOther] = useState("");
  const [educationIsOther, setEducationIsOther] = useState(false);

  const [linkedIn, setLinkedIn] = useState("");
  const [bio, setBio] = useState("");
  const [brands, setBrands] = useState("");

  useOnboardingStepSync(
    "expert",
    1,
    () => ({
      firstName,
      lastName,
      title,
      country,
      yearsExp,
      education,
      educationOther,
      educationIsOther,
      linkedIn,
      bio,
      brands,
    }),
    [
      firstName,
      lastName,
      title,
      country,
      yearsExp,
      education,
      educationOther,
      educationIsOther,
      linkedIn,
      bio,
      brands,
    ]
  );

  return (
    <div className={[styles.stepForm, styles.active].join(" ")}>
      <div className={styles.stepHeader}>
        <div className={styles.stepTag}>Professional Identity</div>
        <div className={styles.stepTitle}>Tell us about yourself</div>
        <div className={styles.stepSub}>
          Your profile is your shop window. Be specific — startups search for
          exact expertise.
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>First Name</label>
          <input
            className={styles.formInput}
            placeholder="Eleanor"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Last Name</label>
          <input
            className={styles.formInput}
            placeholder="Vance"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Professional Title</label>
        <input
          className={styles.formInput}
          placeholder="e.g. Lead AI Architect & Biotech Advisor"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Country</label>
          <select
            className={styles.formInput}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Germany</option>
            <option>Singapore</option>
            <option>Romania</option>
            <option>Other</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Years of Experience</label>
          <select
            className={styles.formInput}
            value={yearsExp}
            onChange={(e) => setYearsExp(e.target.value)}
          >
            <option>0–2 years</option>
            <option>3–5 years</option>
            <option>6–10 years</option>
            <option>11–15 years</option>
            <option>15+ years</option>
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Highest Education Level</label>
        <div className={styles.chipGroup}>
          {EDU_OPTIONS.map((opt) => {
            const selected = !educationIsOther && education === opt;
            return (
              <div
                key={opt}
                className={[styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  setEducationIsOther(false);
                  setEducation(opt);
                }}
                role="button"
                tabIndex={0}
              >
                {opt}
              </div>
            );
          })}
          <div
            className={[styles.chip, educationIsOther ? styles.selected : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setEducationIsOther(true)}
            role="button"
            tabIndex={0}
          >
            ✏️ Other
          </div>
          {educationIsOther && (
            <div className={styles.otherInputWrap}>
              <input
                className={styles.otherInput}
                placeholder="e.g. MD, JD, Chartered Engineer, dual degree…"
                type="text"
                value={educationOther}
                onChange={(e) => setEducationOther(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>LinkedIn or Portfolio URL</label>
        <input
          className={styles.formInput}
          placeholder="linkedin.com/in/your-profile"
          type="text"
          value={linkedIn}
          onChange={(e) => setLinkedIn(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Professional Bio{" "}
          <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>
            (displayed in your pop-out profile to startups and investors)
          </span>
        </label>
        <div className={styles.formHint}>
          3–5 sentences. Cover your background, key achievements, and what
          makes you uniquely valuable. Be specific — generic bios get 70%
          fewer inquiries.
        </div>
        <textarea
          className={styles.formInput}
          placeholder="e.g. PhD in Computational Biology from ETH Zürich with 12 years across academic research and deep-tech startups. Specialist in AI for drug discovery and FDA regulatory strategy. Helped 4 companies achieve FDA Breakthrough Device Designation. Rated top 1% of InvestLink experts."
          style={{ height: 120 }}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Notable Brands or Companies You&apos;ve Worked With{" "}
          <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>
            (optional — builds trust immediately)
          </span>
        </label>
        <input
          className={styles.formInput}
          placeholder="e.g. Google, Stripe, Johns Hopkins, GSK, McKinsey (or describe anonymized clients)"
          type="text"
          value={brands}
          onChange={(e) => setBrands(e.target.value)}
        />
      </div>
    </div>
  );
}
