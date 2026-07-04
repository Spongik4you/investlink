import { RoleDashboard } from "@/components/onboarding/RoleDashboard";
// Autorizarea (sesiune + rol EXPERT + onboarding complet) e verificată
// deja de middleware.ts pentru orice rută /dashboard/expert/*.
export default function ExpertDashboardPage() {
  return <RoleDashboard roleLabel="Expert" />;
}
