"use client";

import styles from "./onboarding.module.css";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    "angel" | "vc" | "family" | "pe" | "corp" | "inst"
  >("angel");


  // <---PRESELECTATELE---><---STEP 3--->
  const [sectorFocus, setSectorFocus] = useState<string[]>([
    // "Artificial Intelligence",
    // "CleanTech / GreenTech",
    // "FinTech",
    // "SaaS / B2B Software",
  ]);

  const [investmentStages, setInvestmentStages] = useState<string[]>([
    // "Pre-Seed",
    // "Seed",
    // "Series A",
  ]);

  const [preferredGeography, setPreferredGeography] = useState<string[]>([
    // "🌎 North America",
    "🌐 Global / No Preference",
  ]);

  function toggleInArray(
    value: string,
    setFn: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setFn((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    );
  }

  // <---STEP 4 (pentru investitori)--->
  const [ticketSize, setTicketSize] = useState<
    "under25" | "25to250" | "250to2m" | "2mplus"
  >("25to250");

  const [investmentsPerYear, setInvestmentsPerYear] = useState<
    "1-3" | "4-10" | "11-25" | "25+"
  >("4-10");

  const [riskTolerance, setRiskTolerance] = useState<
    "conservative" | "moderate" | "aggressive"
  >("moderate");

    const [startupValues, setStartupValues] = useState<string[]>([
    // "Strong founding team",
    // "Market size (TAM)",
    // "Scalability model",
  ]);

  //<---STEP 5 (pentru investitori)--->
  const [boardInvolvement, setBoardInvolvement] = useState<
    "always" | "sometimes" | "passive"
  >("sometimes");

  const [coInvesting, setCoInvesting] = useState<
    "syndicates" | "lead" | "solo"
  >("syndicates");

  const [referralSource, setReferralSource] = useState<string>("");

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

  const [notifChannels, setNotifChannels] = useState<string[]>(["Email", "In-App"]);


  //<-----STARTAPP STEP 1----->
  const [startupCompanyName, setStartupCompanyName] = useState("");
  const [startupLegalType, setStartupLegalType] = useState("LLC");
  const [startupCountry, setStartupCountry] = useState("United States");
  const [startupYearFounded, setStartupYearFounded] = useState("");
  const [startupWebsite, setStartupWebsite] = useState("");
  const [startupOneLiner, setStartupOneLiner] = useState("");
  const [startupDescription, setStartupDescription] = useState("");
  const [startupKeyMetric, setStartupKeyMetric] = useState("");

  function toggleNotif(key: keyof typeof notif) {
    setNotif((prev) => ({ ...prev, [key]: !prev[key] }));
  }

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
    setStep(999);
  }

  function goDashboard() {
    // redirecționare recomandată
    if (role === "investor") router.push("/dashboard/investor");
    if (role === "startup") router.push("/dashboard/startup");
    if (role === "expert") router.push("/dashboard/expert");
  }

return (
  <div className={styles.onboardWrap}>
    {/* LEFT PANEL */}
    <div className={styles.leftPanel}>
      <Link href="/" className={styles.lpLogo}>
      {/* <div className={styles.lpLogo}> */}
        <div className={styles.lpLogoMark}>
          <svg viewBox="0 0 24 24">
            <polyline points="3 17 9 11 13 15 21 7" />
            <polyline points="14 7 21 7 21 14" />
          </svg>
        </div>
        <span className={styles.lpLogoText}>InvestLink</span>
      {/* </div> */}
      </Link>

      <div className={styles.lpRoleBadge}>{cfg.badge}</div>
      <div className={styles.lpTitle}>{cfg.title}</div>
      <div className={styles.lpSub}>{cfg.sub}</div>

      <div className={styles.progressSteps}>
        {cfg.steps.map((s: any, i: number) => {
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

    {/* RIGHT PANEL */}
    <div className={styles.rightPanel}>
      {/* TOP BAR */}
      {step !== 999 && (
        <div className={styles.rpTop}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gray-500)" }}>
            {cfg.topLabel}
          </div>
          <div className={styles.rpProgressBar}>
            <div className={styles.rpProgressFill} style={{ width: `${progressPct}%` }} />
          </div>
          <div className={styles.rpStepCount}>
            {step === 0 ? "Step 1 of 7" : `Step ${step + 1} of 7`}
          </div>
        </div>
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
                    <div className={styles.ccName}>{r[0].toUpperCase() + r.slice(1)}</div>
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

      {/* STEP 1: INVESTOR - Identity */}
      {role === "investor" && step === 1 && (
        <div className={[styles.stepForm, styles.active].join(" ")}>
          <div className={styles.stepHeader}>
            <div className={styles.stepTag}>Identity & Background</div>
            <div className={styles.stepTitle}>Tell us about yourself</div>
            <div className={styles.stepSub}>
              Basic information to verify your account and personalize your experience.
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>First Name</label>
              <input className={styles.formInput} placeholder="Alexander" type="text" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Last Name</label>
              <input className={styles.formInput} placeholder="Wright" type="text" />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Country of Residence</label>
              <select className={styles.formInput} defaultValue="">
                <option value="">Select country…</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Germany</option>
                <option>Singapore</option>
                <option>UAE</option>
                <option>Romania</option>
                <option>Other</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>City</label>
              <input className={styles.formInput} placeholder="New York" type="text" />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Professional Title / Role</label>
            <input
              className={styles.formInput}
              placeholder="e.g. Angel Investor, Fund Manager, Family Office"
              type="text"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              LinkedIn Profile URL{" "}
              <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>
                (optional)
              </span>
            </label>
            <input
              className={styles.formInput}
              placeholder="linkedin.com/in/your-profile"
              type="text"
            />
          </div>
        </div>
      )}

      {/* STEP 2: INVESTOR - Investor Type */}
      {role === "investor" && step === 2 && (
        <div className={[styles.stepForm, styles.active].join(" ")}>
          <div className={styles.stepHeader}>
            <div className={styles.stepTag}>Investor Classification</div>
            <div className={styles.stepTitle}>What type of investor are you?</div>
            <div className={styles.stepSub}>
              This helps us apply the right compliance framework and show relevant deal flow.
            </div>
          </div>

          <div className={[styles.cardChoiceGroup, styles.cols2].join(" ")}>
            {[
              {
                key: "angel" as const,
                icon: "👤",
                name: "Angel Investor",
                desc: "Investing personal capital into early-stage startups.",
              },
              {
                key: "vc" as const,
                icon: "🏢",
                name: "Venture Capital",
                desc: "Fund-based investing across multiple portfolio companies.",
              },
              {
                key: "family" as const,
                icon: "🏛",
                name: "Family Office",
                desc: "Managing wealth on behalf of one or more families.",
              },
              {
                key: "pe" as const,
                icon: "💰",
                name: "Private Equity",
                desc: "Investing in established companies or buyouts.",
              },
              {
                key: "corp" as const,
                icon: "🌐",
                name: "Corporate Investor",
                desc: "Strategic investments from a corporation or enterprise.",
              },
              {
                key: "inst" as const,
                icon: "🏦",
                name: "Institutional Fund",
                desc: "Pension, endowment, sovereign wealth, or hedge fund.",
              },
            ].map((c) => {
              const selected = investorType === c.key;

              const cardClassName = [
                styles.cardChoice,
                selected ? styles.selected : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={c.key}
                  className={cardClassName}
                  onClick={() => setInvestorType(c.key)}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.ccIcon}>{c.icon}</div>
                  <div className={styles.ccContent}>
                    <div className={styles.ccName}>{c.name}</div>
                    <div className={styles.ccDesc}>{c.desc}</div>
                  </div>
                  <div className={styles.ccCheck}>{selected ? "✓" : ""}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: INVESTOR - Investment Focus */}
      {role === "investor" && step === 3 && (
        <div className={[styles.stepForm, styles.active].join(" ")}>
          <div className={styles.stepHeader}>
            <div className={styles.stepTag}>Investment Focus</div>
            <div className={styles.stepTitle}>What sectors interest you?</div>
            <div className={styles.stepSub}>
              Select all that apply. Our AI uses this to curate your deal flow and match you with relevant startups.
            </div>
          </div>

          {/* Sectors */}
          <div className={styles.chipGroup} style={{ marginBottom: 20 }}>
            {[
              "🤖 Artificial Intelligence",
              "🌿 CleanTech / GreenTech",
              "🏥 HealthTech / BioTech",
              "💳 FinTech",
              "🚀 Space Tech",
              "🔒 Cybersecurity",
              "🛒 E-Commerce",
              "🎮 Gaming / Web3",
              "🏗 PropTech / Real Estate",
              "🎓 EdTech",
              "🍔 FoodTech / AgriTech",
              "🏭 DeepTech / Hardware",
              "📦 Logistics / Supply Chain",
              "🧩 SaaS / B2B Software",
            ].map((label) => {
              // păstrăm intern fără emoji ca să fie mai ușor de salvat mai târziu
              const value = label.replace(/^[^\s]+\s/, ""); // scoate emoji + spațiu
              const selected = sectorFocus.includes(value);

              const cls = [styles.chip, selected ? styles.selected : ""]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={value}
                  className={cls}
                  onClick={() => toggleInArray(value, setSectorFocus)}
                  role="button"
                  tabIndex={0}
                >
                  {label}
                </div>
              );
            })}
          </div>

          {/* Stage */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Preferred Investment Stage</label>
            <div className={styles.chipGroup}>
              {["Pre-Seed", "Seed", "Series A", "Series B", "Series C+", "Growth"].map((s) => {
                const selected = investmentStages.includes(s);
                const cls = [styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    key={s}
                    className={cls}
                    onClick={() => toggleInArray(s, setInvestmentStages)}
                    role="button"
                    tabIndex={0}
                  >
                    {s}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Geography */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Preferred Geography</label>
            <div className={styles.chipGroup}>
              {[
                "🌎 North America",
                "🌍 Europe",
                "🌏 Asia-Pacific",
                "🌍 Africa",
                "🌎 Latin America",
                "🌐 Global / No Preference",
              ].map((g) => {
                const selected = preferredGeography.includes(g);
                const cls = [styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    key={g}
                    className={cls}
                    onClick={() => toggleInArray(g, setPreferredGeography)}
                    role="button"
                    tabIndex={0}
                  >
                    {g}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: INVESTOR - Capital & Risk Profile */}
      {role === "investor" && step === 4 && (
        <div className={[styles.stepForm, styles.active].join(" ")}>
          <div className={styles.stepHeader}>
            <div className={styles.stepTag}>Capital & Risk Profile</div>
            <div className={styles.stepTitle}>Your investment parameters</div>
            <div className={styles.stepSub}>
              Helps us surface deals in your comfort zone and connect you with compatible co-investors.
            </div>
          </div>

          {/* Ticket size */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Typical ticket size per investment</label>

            <div className={[styles.cardChoiceGroup, styles.cols2].join(" ")}>
              {[
                {
                  key: "under25" as const,
                  icon: "💵",
                  name: "Under $25,000",
                  desc: "Micro / small checks, high volume",
                },
                {
                  key: "25to250" as const,
                  icon: "💵",
                  name: "$25K – $250K",
                  desc: "Angel / early institutional range",
                },
                {
                  key: "250to2m" as const,
                  icon: "💰",
                  name: "$250K – $2M",
                  desc: "Seed to Series A range",
                },
                {
                  key: "2mplus" as const,
                  icon: "🏦",
                  name: "$2M+",
                  desc: "Institutional / large fund tickets",
                },
              ].map((t) => {
                const selected = ticketSize === t.key;
                const cls = [styles.cardChoice, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    key={t.key}
                    className={cls}
                    onClick={() => setTicketSize(t.key)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.ccIcon}>{t.icon}</div>
                    <div className={styles.ccContent}>
                      <div className={styles.ccName}>{t.name}</div>
                      <div className={styles.ccDesc}>{t.desc}</div>
                    </div>
                    <div className={styles.ccCheck}>{selected ? "✓" : ""}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Investments per year */}
          <div className={styles.formGroup} style={{ marginTop: 4 }}>
            <label className={styles.formLabel}>
              How many investments do you plan to make per year?
            </label>

            <div className={styles.chipGroup}>
              {(["1-3", "4-10", "11-25", "25+"] as const).map((v) => {
                const selected = investmentsPerYear === v;
                const cls = [styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    key={v}
                    className={cls}
                    onClick={() => setInvestmentsPerYear(v)}
                    role="button"
                    tabIndex={0}
                  >
                    {v.replace("-", "–")}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Risk tolerance */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Risk Tolerance</label>

            <div
              className={styles.cardChoiceGroup}
              style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
            >
              {[
                {
                  key: "conservative" as const,
                  icon: "🛡",
                  name: "Conservative",
                  desc: "Capital preservation",
                },
                {
                  key: "moderate" as const,
                  icon: "⚖️",
                  name: "Moderate",
                  desc: "Balanced growth",
                },
                {
                  key: "aggressive" as const,
                  icon: "🔥",
                  name: "Aggressive",
                  desc: "Max growth potential",
                },
              ].map((r) => {
                const selected = riskTolerance === r.key;
                const cls = [styles.cardChoice, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    key={r.key}
                    className={cls}
                    onClick={() => setRiskTolerance(r.key)}
                    role="button"
                    tabIndex={0}
                    style={{
                      flexDirection: "column",
                      textAlign: "center",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <div style={{ fontSize: 22 }}>{r.icon}</div>
                    <div className={styles.ccName} style={{ fontSize: 13 }}>
                      {r.name}
                    </div>
                    <div className={styles.ccDesc}>{r.desc}</div>
                    <div className={styles.ccCheck} style={{ margin: "0 auto" }}>
                      {selected ? "✓" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: INVESTOR - Preferences & Collaboration */}
      {role === "investor" && step === 5 && (
        <div className={[styles.stepForm, styles.active].join(" ")}>
          <div className={styles.stepHeader}>
            <div className={styles.stepTag}>Collaboration Style</div>
            <div className={styles.stepTitle}>How do you prefer to invest?</div>
            <div className={styles.stepSub}>
              These preferences shape how we present opportunities and connect you with other platform members.
            </div>
          </div>

          {/* Values (max 3) */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              What do you value most in a startup?{" "}
              <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>
                (pick up to 3)
              </span>
            </label>

            <div className={styles.chipGroup}>
              {[
                "Strong founding team",
                "Traction & revenue",
                "Market size (TAM)",
                "Proprietary tech / IP",
                "Scalability model",
                "Social / ESG impact",
                "Defensibility / moat",
                "Clear exit strategy",
              ].map((v) => {
                const selected = startupValues.includes(v);
                const cls = [styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    key={v}
                    className={cls}
                    onClick={() => toggleWithLimit(v, 3, setStartupValues)}
                    role="button"
                    tabIndex={0}
                    title={
                      !selected && startupValues.length >= 3
                        ? "You can select up to 3"
                        : undefined
                    }
                  >
                    {v}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Board involvement */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Do you want board seat or advisory involvement?
            </label>

            <div className={styles.chipGroup}>
              {[
                { key: "always" as const, label: "Yes, always" },
                { key: "sometimes" as const, label: "Sometimes, deal-specific" },
                { key: "passive" as const, label: "No, passive investor" },
              ].map((o) => {
                const selected = boardInvolvement === o.key;
                const cls = [styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    key={o.key}
                    className={cls}
                    onClick={() => setBoardInvolvement(o.key)}
                    role="button"
                    tabIndex={0}
                  >
                    {o.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Co-investing */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Are you open to co-investing with other InvestLink investors?
            </label>

            <div className={styles.chipGroup}>
              {[
                {
                  key: "syndicates" as const,
                  label: "Yes, actively looking for syndicates",
                },
                { key: "lead" as const, label: "Open but prefer to lead" },
                { key: "solo" as const, label: "No, solo investments only" },
              ].map((o) => {
                const selected = coInvesting === o.key;
                const cls = [styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    key={o.key}
                    className={cls}
                    onClick={() => setCoInvesting(o.key)}
                    role="button"
                    tabIndex={0}
                  >
                    {o.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Referral */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              How did you hear about InvestLink?
            </label>

            <select
              className={styles.formInput}
              value={referralSource}
              onChange={(e) => setReferralSource(e.target.value)}
            >
              <option value="">Select…</option>
              <option>LinkedIn / Social Media</option>
              <option>Friend or Colleague referral</option>
              <option>Press / News article</option>
              <option>Google / Online search</option>
              <option>VC or Accelerator network</option>
              <option>Other</option>
            </select>
          </div>
        </div>
      )}

      {/* STEP 6: INVESTOR - Notifications */}
      {role === "investor" && step === 6 && (
        <div className={[styles.stepForm, styles.active].join(" ")}>
          <div className={styles.stepHeader}>
            <div className={styles.stepTag}>Final Step</div>
            <div className={styles.stepTitle}>Notification & alert preferences</div>
            <div className={styles.stepSub}>
              Choose how InvestLink keeps you informed about new deals, expert insights, and portfolio updates.
            </div>
          </div>

          <div
            style={{
              border: "1px solid var(--gray-200)",
              borderRadius: 12,
              padding: "0 16px",
            }}
          >
            {[
              {
                key: "newDeals" as const,
                title: "New Deal Matches",
                desc: "AI-curated startups matching your investment thesis",
              },
              {
                key: "execution" as const,
                title: "Investment Execution Confirmations",
                desc: "When a buy or deposit order is confirmed",
              },
              {
                key: "digest" as const,
                title: "Portfolio Performance Digest",
                desc: "Weekly summary of your portfolio performance",
              },
              {
                key: "expertReports" as const,
                title: "Expert Reports & Due Diligence",
                desc: "New reports published by your retained experts",
              },
              {
                key: "marketAlerts" as const,
                title: "Market Alerts & News",
                desc: "Key market movements in your focus sectors",
              },
              {
                key: "securityUpdates" as const,
                title: "Platform & Security Updates",
                desc: "Important changes to your account or the platform",
              },
            ].map((t) => {
              const isOff = !notif[t.key];
              const swClass = [styles.toggleSw, isOff ? styles.off : ""]
                .filter(Boolean)
                .join(" ");

              return (
                <div key={t.key} className={styles.toggleField}>
                  <div>
                    <div className={styles.tfLabel}>{t.title}</div>
                    <div className={styles.tfDesc}>{t.desc}</div>
                  </div>

                  <div
                    className={swClass}
                    onClick={() => toggleNotif(t.key)}
                    role="switch"
                    aria-checked={!isOff}
                    tabIndex={0}
                  />
                </div>
              );
            })}
          </div>

          <div className={styles.formGroup} style={{ marginTop: 18 }}>
            <label className={styles.formLabel}>Preferred Notification Channel</label>

            <div className={styles.chipGroup}>
              {[
                { label: "📧 Email", value: "Email" },
                { label: "🔔 In-App", value: "In-App" },
                { label: "📱 SMS", value: "SMS" },
                { label: "💬 WhatsApp", value: "WhatsApp" },
              ].map((c) => {
                const selected = notifChannels.includes(c.value);
                const cls = [styles.chip, selected ? styles.selected : ""]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    key={c.value}
                    className={cls}
                    onClick={() => toggleInArray(c.value, setNotifChannels)}
                    role="button"
                    tabIndex={0}
                  >
                    {c.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
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

      {/* EXEMPLU: Butoane Next/Back pentru orice step */}
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

      {/* SUCCESS */}
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
    </div>
  </div>
);
}