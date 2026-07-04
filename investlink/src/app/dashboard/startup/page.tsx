import { getServerSession } from "next-auth";


import { authOptions } from "@/lib/auth";

import { getStartupDashboardData } from "@/features/dashboard/startup/server/get-startup-dashboard";

export default async function StartupDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error(
      "StartupDashboardPage: sesiune lipsă deși middleware ar fi trebuit să blocheze accesul.",
    );
  }

  const data = await getStartupDashboardData(session.user.email);

  return (
    <div className="space-y-6">
      <section className="rounded-[14px] border border-[#E5E7EB] bg-white p-8">
        <h1 className="text-[32px] font-extrabold text-[#111827]">
          Executive Dashboard
        </h1>
        <p className="mt-2 text-[15px] text-[#6B7280]">
          Monitor startup funding and collaborations.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-[14px] border border-[#F3F4F6] bg-white p-6 shadow-sm">
          <div className="text-[12px] font-bold uppercase tracking-wide text-[#9CA3AF]">
            Total Raised
          </div>
          <div className="mt-4 text-[32px] font-bold text-[#111827]">
            {data.kpis[0]?.value ?? "$0"}
          </div>
        </div>

        <div className="rounded-[14px] border border-[#F3F4F6] bg-white p-6 shadow-sm">
          <div className="text-[12px] font-bold uppercase tracking-wide text-[#9CA3AF]">
            Investors
          </div>
          <div className="mt-4 text-[32px] font-bold text-[#111827]">
            {data.kpis[1]?.value ?? "0"}
          </div>
        </div>

        <div className="rounded-[14px] border border-[#F3F4F6] bg-white p-6 shadow-sm">
          <div className="text-[12px] font-bold uppercase tracking-wide text-[#9CA3AF]">
            Experts
          </div>
          <div className="mt-4 text-[32px] font-bold text-[#111827]">
            {data.kpis[2]?.value ?? "0"}
          </div>
        </div>
      </section>
    </div>
  );
}