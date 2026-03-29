"use client";

import styles from "./onboarding.module.css";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import OnboardingShell from "@/components/onboarding/OnboardingShell";
import LeftPanel from "@/components/onboarding/LeftPanel";
import TopProgress from "@/components/onboarding/TopProgress";

import InvestorStep1 from "@/components/onboarding/investors/InvestorStep1";
import InvestorStep2 from "@/components/onboarding/investors/InvestorStep2";
import InvestorStep3 from "@/components/onboarding/investors/InvestorStep3";
import InvestorStep4 from "@/components/onboarding/investors/InvestorStep4";
import InvestorStep5 from "@/components/onboarding/investors/InvestorStep5";
import InvestorStep6 from "@/components/onboarding/investors/InvestorStep6";

import StartupStep1 from "@/components/onboarding/startup/StartupStep1";
import StartupStep2 from "@/components/onboarding/startup/StartupStep2";
import StartupStep3 from "@/components/onboarding/startup/StartupStep3";
import StartupStep4 from "@/components/onboarding/startup/StartupStep4";
import StartupStep5 from "@/components/onboarding/startup/StartupStep5";
import StartupStep6 from "@/components/onboarding/startup/StartupStep6";

import ExpertStep1 from "@/components/onboarding/experts/ExpertStep1";
import ExpertStep2 from "@/components/onboarding/experts/ExpertStep2";
import ExpertStep3 from "@/components/onboarding/experts/ExpertStep3";
import ExpertStep4 from "@/components/onboarding/experts/ExpertStep4";
import ExpertStep5 from "@/components/onboarding/experts/ExpertStep5";
import ExpertStep6 from "@/components/onboarding/experts/ExpertStep6";

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

      {/* STARTUP steps 1–6 */}
      {role === "startup" && step === 1 && (
        <StartupStep1 onBack={prevStep} onNext={nextStep} />
      )}
      {role === "startup" && step === 2 && (
        <StartupStep2 onBack={prevStep} onNext={nextStep} />
      )}
      {role === "startup" && step === 3 && (
        <StartupStep3 onBack={prevStep} onNext={nextStep} />
      )}
      {role === "startup" && step === 4 && (
        <StartupStep4 onBack={prevStep} onNext={nextStep} />
      )}
      {role === "startup" && step === 5 && (
        <StartupStep5 onBack={prevStep} onNext={nextStep} />
      )}
      {role === "startup" && step === 6 && (
        <StartupStep6 onBack={prevStep} onComplete={completeProfile} />
      )}

      {/* EXPERT steps 1–6 */}
      {role === "expert" && step === 1 && (
        <ExpertStep1 onBack={prevStep} onNext={nextStep} />
      )}
      {role === "expert" && step === 2 && (
        <ExpertStep2 onBack={prevStep} onNext={nextStep} />
      )}
      {role === "expert" && step === 3 && (
        <ExpertStep3 onBack={prevStep} onNext={nextStep} />
      )}
      {role === "expert" && step === 4 && (
        <ExpertStep4 onBack={prevStep} onNext={nextStep} />
      )}
      {role === "expert" && step === 5 && (
        <ExpertStep5 onBack={prevStep} onNext={nextStep} />
      )}
      {role === "expert" && step === 6 && (
        <ExpertStep6 onBack={prevStep} onComplete={completeProfile} />
      )}

        {(role === "investor" || role === "startup" || role === "expert") &&
          step >= 1 &&
          step <= 6 && (
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
