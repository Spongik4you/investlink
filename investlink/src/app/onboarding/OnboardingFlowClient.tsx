"use client";

import styles from "./onboarding.module.css";
import { useMemo, useState } from "react";
import { Target, Rocket, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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

import { useOnboardingWizard, type WizardRoleKey } from "@/contexts/OnboardingWizardContext";

type RoleKey = WizardRoleKey;

const ROLES = {
  investor: {
    badge: "Setting up as Investor",
    title: "Let's build your investor profile",
    sub: "Answer a few questions so our AI can match you with the right startups and opportunities.",
    steps: [
      { name: "Identity", desc: "Your basic info" },
      { name: "Investment Profile", desc: "Type, sectors & stages" },
      { name: "Capital & Style", desc: "Budget, risk & collaboration" },
      { name: "Finish", desc: "Notifications & done" },
    ],
    prefix: "inv",
    topLabel: "Investor Onboarding",
  },
  startup: {
    badge: "Setting up as Startup",
    title: "Let's build your startup profile",
    sub: "Tell us about your company so our AI can match you with the right investors and experts.",
    steps: [
      { name: "Company Info", desc: "Basic details" },
      { name: "Vertical & Raise", desc: "Industry, stage & funding" },
      { name: "Team & Needs", desc: "Traction & expert needs" },
      { name: "Finish", desc: "Notifications & done" },
    ],
    prefix: "sta",
    topLabel: "Startup Onboarding",
  },
  expert: {
    badge: "Setting up as Expert",
    title: "Let's build your expert profile",
    sub: "Show startups and investors what you bring to the table. Precision gets better projects.",
    steps: [
      { name: "Identity", desc: "Professional details" },
      { name: "Expertise & Rates", desc: "Skills, pricing & schedule" },
      { name: "Portfolio & Style", desc: "Credibility & collaboration" },
      { name: "Finish", desc: "Notifications & done" },
    ],
    prefix: "exp",
    topLabel: "Expert Onboarding",
  },
} satisfies Record<RoleKey, any>;

export default function OnboardingFlowClient() {
  const router = useRouter();
  const { update } = useSession();
  const { getSnapshot } = useOnboardingWizard();

  // Pre-selectăm rolul din sugestia de pe landing (dacă există). NU e obligatoriu
  // — utilizatorul poate schimba cardul. Sursa de adevăr rămâne alegerea de aici.
  const [role, setRole] = useState<RoleKey>(() => {
    if (typeof window !== "undefined") {
      const s = window.sessionStorage.getItem("investlink:roleSuggestion");
      if (s === "STARTUP") return "startup";
      if (s === "EXPERT") return "expert";
      if (s === "INVESTOR") return "investor";
    }
    return "investor";
  });
  const [step, setStep] = useState<number>(0); // 0 = role picker, 1..6 = SUB-pași interni, 999 = success

  // ── COMASARE 6→4 (varianta A, fără risc pentru persistare) ──
  // Sub-pașii interni (1..6) rămân neschimbați: fiecare componentă își face
  // useOnboardingStepSync(role, N) cu N-ul ei original, deci datele ajung exact
  // unde onboarding-persist.ts le așteaptă. Comasăm DOAR afișarea: un „ecran"
  // vizual randează unul sau doi sub-pași împreună.
  //
  //   Ecran 1 → sub-pas 1        (Identity)
  //   Ecran 2 → sub-pași 2 + 3   (Type + Sectors)
  //   Ecran 3 → sub-pași 4 + 5   (Params + Preferences)
  //   Ecran 4 → sub-pas 6        (Notifications) + success
  const SCREENS: number[][] = [[1], [2, 3], [4, 5], [6]];
  const TOTAL_SCREENS = SCREENS.length;

  // Ecranul vizual curent, derivat din sub-pasul intern.
  const screenIndex = SCREENS.findIndex((sub) => sub.includes(step));
  const currentScreen = screenIndex === -1 ? 0 : screenIndex; // 0-based

  // Un sub-pas se afișează dacă aparține ecranului vizual curent.
const isSub = (n: number) => step >= 1 && (SCREENS[currentScreen]?.includes(n) ?? false);
  // Pas AFIȘAT în sidebar/progres: 0 = role picker, 1..4 = ecrane vizuale.
  // (Sub-pasul intern `step` merge 1..6; nu-l arătăm direct utilizatorului.)
  const displayStep = step === 0 ? 0 : currentScreen + 1;
  const [submitting, setSubmitting] = useState(false);
  const [completeError, setCompleteError] = useState<string | null>(null);
  const cfg = ROLES[role];


  // Investor onboarding state (UI now, persistence later)
  const [investorType, setInvestorType] = useState<
    "angel" | "vc" | "family" | "pe" | "corp" | "inst" | "other"
  >("angel");

  const progressPct = useMemo(() => {
    if (step === 0) return 0;
    if (step >= 1 && step <= 6) {
      return Math.round(((currentScreen + 1) / TOTAL_SCREENS) * 100);
    }
    return 100;
  }, [step, currentScreen, TOTAL_SCREENS]);

  // Avansăm/ne întoarcem la nivel de ECRAN: sărim la primul sub-pas al
  // ecranului vecin. Astfel un ecran cu doi sub-pași e traversat dintr-un click.
  function nextStep() {
    if (currentScreen < TOTAL_SCREENS - 1) {
      setStep(SCREENS[currentScreen + 1][0]);
    }
  }
  function prevStep() {
    if (currentScreen > 0) {
      setStep(SCREENS[currentScreen - 1][0]);
    } else {
      setStep(0); // înapoi la role picker
    }
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
    router.refresh();
    nextStep();
  }

  function dashboardPathForRole(r: RoleKey) {
    if (r === "investor") return "/dashboard/investor";
    if (r === "startup") return "/dashboard/startup";
    return "/dashboard/expert";
  }

  async function completeProfile() {
    try {
      setSubmitting(true);
      setCompleteError(null);
  
      const steps = getSnapshot(role);
  
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: role.toUpperCase(),
          investorType: role === "investor" ? investorType : undefined,
          payload: { steps },
        }),
      });
  
      const data = await res.json().catch(() => null);
  
      if (!res.ok) {
        throw new Error(data?.error || "Failed to complete onboarding.");
      }

      await update();
  
      router.refresh();
      if (role === "investor") router.push("/dashboard/investor");
      if (role === "startup") router.push("/dashboard/startup");
      if (role === "expert") router.push("/dashboard/expert");
    } catch (err) {
      setCompleteError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function goDashboard() {
    // redirecționare recomandată
    if (role === "investor") router.push("/dashboard/investor");
    if (role === "startup") router.push("/dashboard/startup");
    if (role === "expert") router.push("/dashboard/expert");
  }


return (
  <OnboardingShell
    left={<LeftPanel role={role} step={displayStep} cfg={cfg} />}
    right={
      <>
        {step !== 999 && (
          <TopProgress
            step={displayStep}
            totalScreens={TOTAL_SCREENS}
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
                      {r === "investor" ? (
                        <Target className="h-[22px] w-[22px] text-blue-600" />
                      ) : r === "startup" ? (
                        <Rocket className="h-[22px] w-[22px] text-emerald-600" />
                      ) : (
                        <Users className="h-[22px] w-[22px] text-violet-600" />
                      )}
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
      {role === "investor" && isSub(1) && (
        <InvestorStep1
          onBack={prevStep}
          onNext={nextStep}
        />
      )}

      {/* STEP 2: INVESTOR - Investor Type */}
      {role === "investor" && isSub(2) && (
        <InvestorStep2
          investorType={investorType}
          setInvestorType={setInvestorType}
          onBack={prevStep}
          onNext={nextStep}
        />
      )}

      {/* STEP 3: INVESTOR - Investment Focus */}
      {role === "investor" && isSub(3) && (
        <InvestorStep3 onBack={prevStep} onNext={nextStep} />
      )}

      {/* STEP 4: INVESTOR - Capital & Risk Profile */}
      {role === "investor" && isSub(4) && (
        <InvestorStep4 onBack={prevStep} onNext={nextStep} />
      )}

      {/* STEP 5: INVESTOR - Preferences & Collaboration */}
      {role === "investor" && isSub(5) && (
        <InvestorStep5 onBack={prevStep} onNext={nextStep} />
      )}

      {/* STEP 6: INVESTOR - Notifications */}
      {role === "investor" && isSub(6) && (
        <InvestorStep6 onBack={prevStep} onComplete={completeProfile} />
      )}

      {/* STARTUP steps 1–6 */}
      {role === "startup" && isSub(1) && (
        <StartupStep1 onBack={prevStep} onNext={nextStep} />
      )}
      {role === "startup" && isSub(2) && (
        <StartupStep2 onBack={prevStep} onNext={nextStep} />
      )}
      {role === "startup" && isSub(3) && (
        <StartupStep3 onBack={prevStep} onNext={nextStep} />
      )}
      {role === "startup" && isSub(4) && (
        <StartupStep4 onBack={prevStep} onNext={nextStep} />
      )}
      {role === "startup" && isSub(5) && (
        <StartupStep5 onBack={prevStep} onNext={nextStep} />
      )}
      {role === "startup" && isSub(6) && (
        <StartupStep6 onBack={prevStep} onComplete={completeProfile} />
      )}

      {/* EXPERT steps 1–6 */}
      {role === "expert" && isSub(1) && (
        <ExpertStep1 onBack={prevStep} onNext={nextStep} />
      )}
      {role === "expert" && isSub(2) && (
        <ExpertStep2 onBack={prevStep} onNext={nextStep} />
      )}
      {role === "expert" && isSub(3) && (
        <ExpertStep3 onBack={prevStep} onNext={nextStep} />
      )}
      {role === "expert" && isSub(4) && (
        <ExpertStep4 onBack={prevStep} onNext={nextStep} />
      )}
      {role === "expert" && isSub(5) && (
        <ExpertStep5 onBack={prevStep} onNext={nextStep} />
      )}
      {role === "expert" && isSub(6) && (
        <ExpertStep6 onBack={prevStep} onComplete={completeProfile} />
      )}

        {(role === "investor" || role === "startup" || role === "expert") &&
          step >= 1 &&
          step <= 6 && (
          <div className={styles.btnRow}>
            <button
              className={styles.btnBack}
              onClick={prevStep}
              disabled={submitting}
              type="button"
            >
              ← Back
            </button>

            {currentScreen < TOTAL_SCREENS - 1 ? (
              <button
                className={styles.btnNext}
                onClick={nextStep}
                disabled={submitting}
                type="button"
              >
                Continue →
              </button>
            ) : (
              <button
                className={styles.btnNext}
                onClick={() => void completeProfile()}
                disabled={submitting}
                type="button"
              >
                {submitting ? "Saving…" : "Complete Profile →"}
              </button>
            )}
          </div>
        )}

        {completeError && step >= 1 && step <= 6 && (
          <div
            className={styles.formGroup}
            style={{ color: "var(--red)", fontSize: 13, marginTop: -8 }}
          >
            {completeError}
          </div>
        )}

        {/* {step === 999 && (
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
        )} */}
      </>
    }
  />
);}
//Salutic, Dancik... hehehe 
//Cris a fost pe aici... aici... claaaar
