import { RoleDashboard } from "@/components/onboarding/RoleDashboard";
import { requireDashboardAccess } from "@/lib/guards";

export default async function StartupDashboardPage() {
  await requireDashboardAccess("STARTUP");

  return <RoleDashboard roleLabel="Startup" />;
}
