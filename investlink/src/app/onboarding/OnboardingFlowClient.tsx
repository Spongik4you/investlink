"use client";

import styles from "./onboarding.module.css";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import OnboardingShell from "@/components/onboarding/OnboardingShell";
import LeftPanel from "@/components/onboarding/LeftPanel";
import TopProgress from "@/components/onboarding/TopProgress";

import InvestorStep1 from "@/components/onboarding/investors/InvestorStep1";
import InvestorStep2 from "@/components/onboarding/investors/InvestorStep2";
import InvestorStep3 from "@/components/onboarding/investors/InvestorStep3";
import InvestorStep4 from "@/components/onboarding/investors/InvestorStep4";
import InvestorStep5 from "@/components/onboarding/investors/InvestorStep5";
import InvestorStep6 from "@/components/onboarding/investors/InvestorStep6";


import { AirVentIcon } from "lucide-react";

type RoleKey = "investor" | "startup" | "expert";

const ROLES = {
  investor: {
    badge: "💼 Setting up as Investor",
    title: "Let's build your investor profile",
    sub: "Answer a few questions so our AI can match you with the right startups and opportunities.",
    steps: [
      { name: "Identity", desc: "Your basic info" },
      { name: "Investor Type", desc: "Classification & compliance" },
      { name: "Sector Focus", desc: "Industries & stages" },
      { name: "Capital Profile", desc: "Budget & risk tolerance" },
      { name: "Preferences", desc: "Collaboration style" },
      { name: "Notifications", desc: "Stay informed" },
    ],
    prefix: "inv",
    topLabel: "Investor Onboarding",
  },
  startup: {
    badge: "🚀 Setting up as Startup",
    title: "Let's build your startup profile",
    sub: "Tell us about your company so our AI can match you with the right investors and experts.",
    steps: [
      { name: "Company Info", desc: "Basic details" },
      { name: "Industry & Stage", desc: "Your vertical" },
      { name: "Fundraising", desc: "Round details" },
      { name: "Team & Traction", desc: "People & metrics" },
      { name: "Expert Needs", desc: "Collaboration needs" },
      { name: "Notifications", desc: "Stay informed" },
    ],
    prefix: "sta",
    topLabel: "Startup Onboarding",
  },
  expert: {
    badge: "🧠 Setting up as Expert",
    title: "Let's build your expert profile",
    sub: "Show startups and investors what you bring to the table. Precision gets better projects.",
    steps: [
      { name: "Identity", desc: "Professional details" },
      { name: "Expertise", desc: "Skills & categories" },
      { name: "Rates & Availability", desc: "Pricing & schedule" },
      { name: "Portfolio", desc: "Credibility signals" },
      { name: "Work Style", desc: "Collaboration prefs" },
      { name: "Notifications", desc: "Stay informed" },
    ],
    prefix: "exp",
    topLabel: "Expert Onboarding",
  },
} satisfies Record<RoleKey, any>;

export default function OnboardingFlowClient() {
  const router = useRouter();

  const [role, setRole] = useState<RoleKey>("investor");
  const [step, setStep] = useState<number>(0); // 0 = role picker, 1..6 = steps, 999 = success
  const cfg = ROLES[role];


  // Investor onboarding state (UI now, persistence later)
  const [investorType, setInvestorType] = useState<
    "angel" | "vc" | "family" | "pe" | "corp" | "inst" | "other"
  >("angel");

  function toggleInArray(
    value: string,
    setFn: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setFn((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    );
  }


  function toggleWithLimit(
    value: string,
    max: number,
    setFn: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setFn((prev) => {
      if (prev.includes(value)) return prev.filter((x) => x !== value);
      if (prev.length >= max) return prev; // nu mai adăugăm dacă e full
      return [...prev, value];
    });
  }

  //<---STEP 6 (pentru investitori)--->
    const [notif, setNotif] = useState({
    newDeals: true,
    execution: true,
    digest: true,
    expertReports: false,
    marketAlerts: false,
    securityUpdates: true,
  });

  //<-----STARTAPP STEP 1----->
  const [startupCompanyName, setStartupCompanyName] = useState("");
  const [startupLegalType, setStartupLegalType] = useState("LLC");
  const [startupCountry, setStartupCountry] = useState("United States");
  const [startupYearFounded, setStartupYearFounded] = useState("");
  const [startupWebsite, setStartupWebsite] = useState("");
  const [startupOneLiner, setStartupOneLiner] = useState("");
  const [startupDescription, setStartupDescription] = useState("");
  const [startupKeyMetric, setStartupKeyMetric] = useState("");

  const progressPct = useMemo(() => {
    if (step === 0) return 0;
    if (step >= 1 && step <= 6) return Math.round((step / 6) * 100);
    return 100;
  }, [step]);

  function nextStep() {
    if (step < 6) setStep((s) => s + 1);
  }
  function prevStep() {
    if (step > 0) setStep((s) => s - 1);
  }

  async function persistRoleIfNeeded() {
    // dacă ai endpoint API, salvează rolul în DB
    try {
      await fetch("/api/onboarding/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: role.toUpperCase() }),
      });
    } catch {
      // momentan ignorăm dacă endpoint-ul nu există; îl adăugăm la pasul 5
    }
  }

  async function continueFromRolePicker() {
    await persistRoleIfNeeded();
    nextStep();
  }

  async function completeProfile() {
    // aici (mai târziu) salvezi și toate câmpurile pe profil + onboardingStatus=COMPLETED
    // goDashboard()
    setStep(999);
  }

  function goDashboard() {
    // redirecționare recomandată
    if (role === "investor") router.push("/dashboard/investor");
    if (role === "startup") router.push("/dashboard/startup");
    if (role === "expert") router.push("/dashboard/expert");
  }




return (
  <OnboardingShell
    left={<LeftPanel role={role} step={step} cfg={cfg} />}
    right={
      <>
        {step !== 999 && (
          <TopProgress
            step={step}
            progressPct={progressPct}
            topLabel={cfg.topLabel}
          />
        )}

        {/* STEP 0: ROLE PICKER */}
        {step === 0 && (
          <div className={[styles.stepForm, styles.active].join(" ")}>
            <div className={styles.stepHeader}>
              <div className={styles.stepTag}>Welcome to InvestLink</div>
              <div className={styles.stepTitle}>Who are you on InvestLink?</div>
              <div className={styles.stepSub}>
                Choose your role. This shapes your entire dashboard, matching algorithm, and the questions we ask next.
              </div>
            </div>

            <div className={styles.cardChoiceGroup}>
              {(["investor", "startup", "expert"] as RoleKey[]).map((r) => {
                const cardClassName = [
                  styles.cardChoice,
                  role === r ? styles.selected : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    key={r}
                    className={cardClassName}
                    onClick={() => setRole(r)}
                  >
                    <div className={styles.ccIcon}>
                      {r === "investor" ? "💼" : r === "startup" ? "🚀" : "🧠"}
                    </div>
                    <div className={styles.ccContent}>
                      <div className={styles.ccName}>
                        {r[0].toUpperCase() + r.slice(1)}
                      </div>
                      <div className={styles.ccDesc}>
                        {r === "investor" &&
                          "I want to discover verified startups, invest capital, and track portfolio performance in real time."}
                        {r === "startup" &&
                          "I'm raising capital and need to connect with investors and world-class experts to grow my company."}
                        {r === "expert" &&
                          "I'm a specialist (legal, tech, finance, marketing) ready to collaborate with startups and get paid for my expertise."}
                      </div>
                    </div>
                    <div className={styles.ccCheck}>{role === r ? "✓" : ""}</div>
                  </div>
                );
              })}
            </div>

            <div className={styles.btnRow}>
              <div />
              <button className={styles.btnNext} onClick={continueFromRolePicker}>
                Continue →
              </button>
            </div>
          </div>
        )}

      {/* restul step-urilor rămân momentan exact cum sunt */}
      {/* STEP 1: INVESTOR - Identity */}
      {role === "investor" && step === 1 && (
        <InvestorStep1
          onBack={prevStep}
          onNext={nextStep}
        />
      )}

      {/* STEP 2: INVESTOR - Investor Type */}
      {role === "investor" && step === 2 && (
        <InvestorStep2
          investorType={investorType}
          setInvestorType={setInvestorType}
          onBack={prevStep}
          onNext={nextStep}
        />
      )}

      {/* STEP 3: INVESTOR - Investment Focus */}
      {role === "investor" && step === 3 && (
        <InvestorStep3 onBack={prevStep} onNext={nextStep} />
      )}

      {/* STEP 4: INVESTOR - Capital & Risk Profile */}
      {role === "investor" && step === 4 && (
        <InvestorStep4 onBack={prevStep} onNext={nextStep} />
      )}

      {/* STEP 5: INVESTOR - Preferences & Collaboration */}
      {role === "investor" && step === 5 && (
        <InvestorStep5 onBack={prevStep} onNext={nextStep} />
      )}

      {/* STEP 6: INVESTOR - Notifications */}
      {role === "investor" && step === 6 && (
        <InvestorStep6 onBack={prevStep} onComplete={completeProfile} />
      )}

      {/* STEP 1: STARTUP - Company Identity */}
      {role === "startup" && step === 1 && (
        <div className={[styles.stepForm, styles.active].join(" ")}>
          <div className={styles.stepHeader}>
            <div className={styles.stepTag}>Company Identity</div>
            <div className={styles.stepTitle}>Tell us about your startup</div>
            <div className={styles.stepSub}>
              Basic information to create your company profile and start the verification process.
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Company Name</label>
              <input
                className={styles.formInput}
                placeholder="TechCore Inc."
                type="text"
                value={startupCompanyName}
                onChange={(e) => setStartupCompanyName(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Legal Entity Type</label>
              <select
                className={styles.formInput}
                value={startupLegalType}
                onChange={(e) => setStartupLegalType(e.target.value)}
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
                value={startupCountry}
                onChange={(e) => setStartupCountry(e.target.value)}
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
                value={startupYearFounded}
                onChange={(e) => setStartupYearFounded(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Website</label>
            <input
              className={styles.formInput}
              placeholder="https://yourcompany.com"
              type="url"
              value={startupWebsite}
              onChange={(e) => setStartupWebsite(e.target.value)}
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
              value={startupOneLiner}
              onChange={(e) => setStartupOneLiner(e.target.value)}
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
              3–5 sentences: what problem you solve, how, current traction, and why now.
            </div>
            <textarea
              className={styles.formInput}
              placeholder="e.g. TechCore builds enterprise-grade AI infrastructure handling 200M+ requests/day. Trusted by 40+ Fortune 500 clients. Raised $1.2M ARR in 18 months with zero paid marketing. Now raising Series A to expand into Europe."
              style={{ height: 110 }}
              value={startupDescription}
              onChange={(e) => setStartupDescription(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Key Metric You're Most Proud Of{" "}
              <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>
                (optional — increases investor attention)
              </span>
            </label>
            <input
              className={styles.formInput}
              placeholder="e.g. $1.2M ARR · 40+ enterprise clients · 200M requests/day"
              type="text"
              value={startupKeyMetric}
              onChange={(e) => setStartupKeyMetric(e.target.value)}
            />
          </div>
        </div>
      )}

        {step >= 1 && step <= 6 && (
          <div className={styles.btnRow}>
            <button className={styles.btnBack} onClick={prevStep}>
              ← Back
            </button>

            {step < 6 ? (
              <button className={styles.btnNext} onClick={nextStep}>
                Continue →
              </button>
            ) : (
              <button className={styles.btnNext} onClick={completeProfile}>
                Complete Profile →
              </button>
            )}
          </div>
        )}

        {step === 999 && (
          <div className={[styles.successWrap, styles.active].join(" ")}>
            <div className={styles.successIcon}>✅</div>
            <div className={styles.successTitle}>Profile Complete!</div>
            <div className={styles.successSub}>
              Your profile is live. Next we’ll take you to your dashboard.
            </div>

            <button className={styles.btnDashboard} onClick={goDashboard}>
              Go to My Dashboard →
            </button>
          </div>
        )}
      </>
    }
  />
);}
//Salutic, Dancik... hehehe 
//Cris a fost pe aici... aici... claaaar
