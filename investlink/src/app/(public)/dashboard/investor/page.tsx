import { RoleDashboard } from "@/components/onboarding/RoleDashboard";
import { requireDashboardAccess } from "@/lib/guards";

export default async function InvestorDashboardPage() {
  await requireDashboardAccess("INVESTOR");

  return <RoleDashboard roleLabel="Investor" />;
}
