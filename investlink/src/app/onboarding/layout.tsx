import type { ReactNode } from "react";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen w-full bg-white">
      {children}
    </main>
  );
}
