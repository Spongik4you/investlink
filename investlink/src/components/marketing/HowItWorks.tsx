/**
 * „How InvestLink Works".
 *
 * Pașii din machetă au fost curățați de ce nu există: „KYC verification",
 * „managed pools", „due diligence reports", „get paid securely", „verification
 * documents". Ce a rămas descrie exact fluxurile construite în platformă.
 */
const FLOWS = [
  {
    title: "Investors",
    steps: [
      "Create your account and set your thesis — sectors, stages, ticket size",
      "Browse startups and filter by stage, industry or keyword",
      "Express interest, or respond to startups that reach out to you",
      "Track your portfolio: amounts, equity and activity over time",
    ],
  },
  {
    title: "Startups",
    steps: [
      "Create your profile: pitch, industries, stage and what you need",
      "Discover investors and experts, or receive requests from them",
      "Accept the ones that fit and start the conversation",
      "Record investments as they close and watch your analytics build",
    ],
  },
  {
    title: "Experts",
    steps: [
      "Register and showcase your skills, rate and availability",
      "Get matched with startups whose needs overlap your skills",
      "Apply to startups directly, or answer invitations you receive",
      "Collaborate, then close the engagement with a private rating",
    ],
  },
];

export default function HowItWorks() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {FLOWS.map((flow) => (
        <div
          key={flow.title}
          className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-900">{flow.title}</h3>
          <ol className="mt-4 space-y-3">
            {flow.steps.map((s, i) => (
              <li key={s} className="flex gap-3 text-sm text-slate-600">
                <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-blue-50 text-[11px] font-bold text-blue-700">
                  {i + 1}
                </span>
                <span className="leading-snug">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
