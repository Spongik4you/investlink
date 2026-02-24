import { RoleDashboard } from "@/components/onboarding/RoleDashboard";
import { requireDashboardAccess } from "@/lib/guards";

export default async function ExpertDashboardPage() {
  await requireDashboardAccess("EXPERT");

  return <RoleDashboard roleLabel="Expert" />;
}
