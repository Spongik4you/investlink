"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

export type WizardRoleKey = "investor" | "startup" | "expert";

export type StepDataMap = Record<number, Record<string, unknown>>;

type Store = Record<WizardRoleKey, StepDataMap>;

const defaultStore = (): Store => ({
  investor: {},
  startup: {},
  expert: {},
});

type Ctx = {
  setStepData: (
    role: WizardRoleKey,
    step: number,
    data: Record<string, unknown>
  ) => void;
  getSnapshot: (role: WizardRoleKey) => StepDataMap;
};

const OnboardingWizardContext = createContext<Ctx | null>(null);

export function OnboardingWizardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<Store>(defaultStore());

  
  const setStepData = useCallback(
    (role: WizardRoleKey, step: number, data: Record<string, unknown>) => {
      storeRef.current[role][step] = data;
    },
    []
  );

  const getSnapshot = useCallback((role: WizardRoleKey) => {
    console.log("getSnapshot returning:", storeRef.current);
    return { ...storeRef.current[role] }; 
  }, []);

  const value = useMemo(
    () => ({ setStepData, getSnapshot }),
    [setStepData, getSnapshot]
  );

  return (
    <OnboardingWizardContext.Provider value={value}>
      {children}
    </OnboardingWizardContext.Provider>
  );
}

export function useOnboardingWizard() {
  const ctx = useContext(OnboardingWizardContext);
  if (!ctx) {
    throw new Error("useOnboardingWizard must be used within OnboardingWizardProvider");
  }
  return ctx;
}

/** Keeps the wizard store in sync with the current step's form state. */
export function useOnboardingStepSync(
  role: WizardRoleKey,
  step: number,
  build: () => Record<string, unknown>,
  deps: React.DependencyList
) {
  const { setStepData } = useOnboardingWizard();

  useEffect(() => {
    const data = build();
    console.log("setStepData called:", { role, step, data });
    setStepData(role, step, data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, step, setStepData, ...deps]);
}
