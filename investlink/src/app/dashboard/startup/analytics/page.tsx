import { redirect } from "next/navigation";

import { getCurrentStartupProfile } from "@/lib/dashboard/get-current-startup";
import { getStartupInvestments } from "@/lib/dashboard/get-startup-investments";
import { getInvestmentAnalytics } from "@/lib/dashboard/get-investment-analytics";
import { InvestmentsSection } from "@/components/dashboard/startup/InvestmentsSection";
import { SummaryMetrics } from "@/components/dashboard/startup/analytics/SummaryMetrics";
import { CumulativeChart } from "@/components/dashboard/startup/analytics/CumulativeChart";
import { RoundBreakdown } from "@/components/dashboard/startup/analytics/RoundBreakdown";
import { EquityDonut } from "@/components/dashboard/startup/analytics/EquityDonut";
import { TopInvestors } from "@/components/dashboard/startup/analytics/TopInvestors";

function ChartCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[12px] border border-[#E8EBF0] bg-white p-5">
      {children}
    </div>
  );
}

export default async function StartupAnalyticsPage() {
  const startup = await getCurrentStartupProfile();
  if (!startup) redirect("/dashboard/startup");

  const [investmentsData, analytics] = await Promise.all([
    getStartupInvestments(startup.startupProfileId),
    getInvestmentAnalytics(startup.startupProfileId),
  ]);

  return (
    <div className="space-y-6">
      {/* Sumar */}
      <SummaryMetrics data={analytics.summary} />

      {/* Grafice — rând 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard>
          <CumulativeChart data={analytics.cumulative} />
        </ChartCard>
        <ChartCard>
          <RoundBreakdown
            data={analytics.roundBreakdown}
            hasAnyRoundDeclared={analytics.hasAnyRoundDeclared}
          />
        </ChartCard>
      </div>

      {/* Grafice — rând 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard>
          <EquityDonut
            data={analytics.equity}
            hasAnyEquityDeclared={analytics.hasAnyEquityDeclared}
          />
        </ChartCard>
        <ChartCard>
          <TopInvestors data={analytics.topInvestors} />
        </ChartCard>
      </div>

      {/* Lista de investiții (pasul C) */}
      <InvestmentsSection data={investmentsData} />
    </div>
  );
}
